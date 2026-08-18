import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProjectById } from "@/features/projects/action";
import ProjectDetailClient from "./project-detail-client";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    // Protect: redirect unauthenticated users
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }

    const { id } = await params;
    const project = await getProjectById(id);

    if (!project || "error" in project) {
        redirect("/projects");
    }

    return <ProjectDetailClient project={project} />;
}
