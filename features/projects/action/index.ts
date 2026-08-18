import { MessageRole, MessageType } from "@/app/generated/prisma/enums";
import { getCurrentUser } from "@/features/auth/action";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "random-word-slugs";


export async function createProject(value: string){
    const user = await getCurrentUser()
    if(!user){
        return {
            error: "User not found"
        }
    }

    const project = await prisma.project.create({
        data: {
            name: generateSlug(2, { format: "kebab" }),
            userId: user.id,
            messages:{
                create: {
                    content: value,
                    role: MessageRole.USER,
                    type: MessageType.RESULT
                }
            }
        }
    })

    // TODO=> inngest call

    return project
}


export async function getProjects(){
    const user = await getCurrentUser()
    if(!user){
        return {
            error: "User not found"
        }
    }

    const projects = await prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    })

    return projects
}


export async function getProjectById(id: string){
    const user = await getCurrentUser()
    if(!user){
        return {
            error: "User not found"
        }
    }

    const project = await prisma.project.findFirst({
        where: { id, userId: user.id },
        include: { messages: true }
    })

    if(!project){
        return {
            error: "Project not found"
        }
    }

    return project
}
