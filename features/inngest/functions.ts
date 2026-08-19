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
            const sandbox = await Sandbox.create({
                template: "0awqf35ohrnx2e7zgxo4",
            });

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

                return messages.map((message:any) => ({
                    type: "text" as const,
                    role:
                        message.role === MessageRole.ASSISTANT
                            ? ("assistant" as const)
                            : ("user" as const),
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
            description: "An expert coding agent",
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
