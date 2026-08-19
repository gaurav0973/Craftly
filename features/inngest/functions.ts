import { Sandbox } from "@e2b/code-interpreter";
import { inngest } from "./client";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/lib/prompt";
import {
    createAgent,
    createNetwork,
    createState,
    createTool,
    openai,
} from "@inngest/agent-kit";
import z from "zod";

import {
    agentOutputText,
    connectSandbox,
    lastAssistantTextMessageContent,
} from "./utils";
import { prisma } from "@/lib/prisma";
import { MessageRole, MessageType } from "@/app/generated/prisma/enums";

export interface CodeAgentState {
    sandboxId: string;
    summary: string;
    files: Record<string, string>;
}

export const codeAgentFunction = inngest.createFunction(
    { id: "code-agent", triggers: { event: "code-agent/run" } },
    async ({ event, step }) => {


        const sandboxId = await step.run("get-sandbox-id", async () => {
            // Create a base sandbox (Node.js environment)
            const sandbox = await Sandbox.create({
                template: "base",
                timeoutMs: 5 * 60 * 1000, // 5 min to install & scaffold
            });

            // Install the static file server
            await sandbox.commands.run(
                "npm install -g serve 2>&1 | tail -5",
                { timeoutMs: 60_000 },
            );

            // Create project directory structure
            await sandbox.commands.run("mkdir -p /home/user/pages");

            // Scaffold index.html
            await sandbox.files.write(
                "/home/user/index.html",
                `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <p>Loading...</p>
  <script src="script.js"></script>
</body>
</html>`,
            );

            // Scaffold style.css
            await sandbox.files.write(
                "/home/user/style.css",
                `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; background: #f9fafb; color: #111827; }`,
            );

            // Scaffold script.js
            await sandbox.files.write(
                "/home/user/script.js",
                `console.log('App ready');`,
            );

            // Start the static file server in the background on port 3000
            await sandbox.commands.run(
                "nohup serve /home/user -l 3000 --no-clipboard > /tmp/serve.log 2>&1 &",
                { timeoutMs: 5_000 },
            );

            // Wait until the server is ready
            for (let i = 0; i < 20; i++) {
                try {
                    const check = await sandbox.commands.run(
                        "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000",
                        { timeoutMs: 3_000 },
                    );
                    if (check.stdout.trim() === "200") break;
                } catch {}
                await new Promise((r) => setTimeout(r, 500));
            }

            return sandbox.sandboxId;
        });

        const previousMessages = await step.run(
            "get-previous-messages",
            async () => {
                const messages = await prisma.message.findMany({
                    where: {
                        projectId: event.data.projectId,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                });

                // Only pass the last few USER messages to avoid polluting
                // the agent context with old error/debug conversation noise.
                const userMessages = messages.filter(
                    (m: any) => m.role === MessageRole.USER
                );
                // Take the last 3 user messages max
                const recentUserMessages = userMessages.slice(-3);

                return recentUserMessages.map((message: any) => ({
                    type: "text" as const,
                    role: "user" as const,
                    content: message.content,
                }));
            },
        );

        
        const state = createState<CodeAgentState>(
            { sandboxId, summary: "", files: {} },
            { messages: previousMessages },
        );

        const openaiModel = openai({
            model: "gpt-4o-mini",
            apiKey: process.env.OPENAI_API_KEY!,
        });

        const codeAgent = createAgent({
            name: "code-agent",
            description: "An expert front-end coding agent that builds HTML/CSS/JS apps",
            system: PROMPT,
            model: openai({
                model: "gpt-4o-mini",
                apiKey: process.env.OPENAI_API_KEY!,
            }),
            tools: [
                // 1. Terminal
                createTool({
                    name: "terminal",
                    description: "Use the terminal to run commands",
                    parameters: z.object({
                        command: z.string(),
                    }),
                    handler: async ({ command }, { step }) => {
                        return await step?.run("terminal", async () => {
                            const buffers = { stdout: "", stderr: "" };

                            try {
                                const sandbox =
                                    await Sandbox.connect(sandboxId);

                                const result = await sandbox.commands.run(
                                    command,
                                    {
                                        onStdout: (data) => {
                                            buffers.stdout += data;
                                        },

                                        onStderr: (data) => {
                                            buffers.stderr += data;
                                        },
                                    },
                                );

                                return result.stdout;
                            } catch (error) {
                                console.log(
                                    `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`,
                                );

                                return `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`;
                            }
                        });
                    },
                }),

                // 2. createOrUpdateFiles
                createTool({
                    name: "createOrUpdateFiles",
                    description: "Create or update multiple files in the sandbox",
                    parameters: z.object({
                        files: z.array(
                            z.object({
                                path: z.string(),
                                content: z.string(),
                            }),
                        ),
                    }),

                    handler: async ({ files }, { step, network }) => {
                        const newFiles = await step?.run(
                            "createOrUpdateFiles",
                            async () => {
                                try {
                                    const updatedFiles =
                                        network?.state?.data.files || {};

                                    const sandbox =
                                        await Sandbox.connect(sandboxId);

                                    for (const file of files) {
                                        const cleanPath = file.path
                                            .replace(/^\/home\/user\//, "")
                                            .replace(/^\//, "")
                                            .replace(/^\.\//, "");
                                        const absolutePath = `/home/user/${cleanPath}`;

                                        await sandbox.files.write(
                                            absolutePath,
                                            file.content,
                                        );
                                        updatedFiles[cleanPath] = file.content;
                                    }

                                    return updatedFiles;
                                } catch (error) {
                                    return "Error: " + error;
                                }
                            },
                        );

                        if (typeof newFiles === "object" && newFiles !== null) {
                            if (network?.state?.data) {
                                network.state.data.files = newFiles;
                            }
                            return `Successfully updated ${files.length} file(s): ${files.map((f) => f.path).join(", ")}`;
                        }
                        return String(newFiles);
                    },
                }),

                // 2b. createOrUpdateFile (single file helper)
                createTool({
                    name: "createOrUpdateFile",
                    description: "Create or update a single file in the sandbox",
                    parameters: z.object({
                        path: z.string(),
                        content: z.string(),
                    }),
                    handler: async ({ path, content }, { step, network }) => {
                        const newFiles = await step?.run(
                            "createOrUpdateFile",
                            async () => {
                                try {
                                    const updatedFiles =
                                        network?.state?.data.files || {};

                                    const sandbox =
                                        await Sandbox.connect(sandboxId);

                                    const cleanPath = path
                                        .replace(/^\/home\/user\//, "")
                                        .replace(/^\//, "")
                                        .replace(/^\.\//, "");
                                    const absolutePath = `/home/user/${cleanPath}`;

                                    await sandbox.files.write(absolutePath, content);
                                    updatedFiles[cleanPath] = content;

                                    return updatedFiles;
                                } catch (error) {
                                    return "Error: " + error;
                                }
                            },
                        );

                        if (typeof newFiles === "object" && newFiles !== null) {
                            if (network?.state?.data) {
                                network.state.data.files = newFiles;
                            }
                            return `Successfully updated file: ${path}`;
                        }
                        return String(newFiles);
                    },
                }),

                // 3. readFiles
                createTool({
                    name: "readFiles",
                    description: "Read files in the sandbox",

                    parameters: z.object({
                        files: z.array(z.string()),
                    }),
                    handler: async ({ files }, { step }) => {
                        return await step?.run("readFiles", async () => {
                            try {
                                const sandbox = await Sandbox.connect(sandboxId);

                                const contents: any = [];
                                for (const file of files) {
                                    const cleanPath = file
                                        .replace(/^\/home\/user\//, "")
                                        .replace(/^\//, "")
                                        .replace(/^\.\//, "");
                                    const absolutePath = `/home/user/${cleanPath}`;

                                    const content =
                                        await sandbox.files.read(absolutePath);
                                    contents.push({ path: cleanPath, content });
                                }
                                return JSON.stringify(contents);
                            } catch (error) {
                                return "Error: " + error;
                            }
                        });
                    },
                }),
            ],

            lifecycle: {
                onResponse: async ({ result, network }) => {
                    console.log(result);
                    const lastAssistantMessageText =
                        lastAssistantTextMessageContent(result);

                    if (lastAssistantMessageText && network) {
                        if (
                            lastAssistantMessageText.includes("<task_summary>")
                        ) {
                            network.state.data.summary =
                                lastAssistantMessageText;
                        }
                    }

                    return result;
                },
            },
        });

        const network = createNetwork({
            name: "code-agent-network",
            agents: [codeAgent],
            maxIter: 15,
            router: async ({ network }) => {
                const summary = network.state.data.summary;

                if (summary) {
                    return;
                }

                return codeAgent;
            },
        });

        const result = await network.run(event.data.value, { state });
        console.log(result);
        const { summary, files } = result.state.data;

        const makeTextAgent = (name: string, system: string) =>
            createAgent({ name, system, model: openaiModel });

        const fragmentTitleGenerator = makeTextAgent(
            "fragment-title-generator",
            FRAGMENT_TITLE_PROMPT,
        );
        const responseGenerator = makeTextAgent(
            "response-generator",
            RESPONSE_PROMPT,
        );

        const [{ output: fragmentTitleOutput }, { output: responseOutput }] =
            await Promise.all([
                fragmentTitleGenerator.run(summary, { step }),
                responseGenerator.run(summary, { step }),
            ]);

        const fragmentTitle = agentOutputText(fragmentTitleOutput, "Untitled");
        const responseText = agentOutputText(responseOutput, "Here you go");

        console.log(files);

        const isError =
            !result.state.data.summary ||
            Object.keys(result.state.data.files || {}).length === 0;

        const sandboxUrl = await step.run("get-sandbox-url", async () => {
            const sandbox = await connectSandbox(sandboxId);
            return `https://${sandbox.getHost(3000)}`;
        });

        await step.run("save-result", async () => {
            if (isError) {
                return prisma.message.create({
                    data: {
                        projectId: event.data.projectId,
                        content: "Something went wrong. Please try again",
                        role: MessageRole.ASSISTANT,
                        type: MessageType.ERROR,
                    },
                });
            }

            return prisma.message.create({
                data: {
                    projectId: event.data.projectId,
                    content: responseText,
                    role: MessageRole.ASSISTANT,
                    type: MessageType.RESULT,
                    fragments: {
                        create: {
                            sandboxUrl,
                            title: fragmentTitle,
                            files,
                        },
                    },
                },
            });
        });

        return {
            url: sandboxUrl,
            title: fragmentTitle,
            files,
            summary,
        };
    },
);
