import {
    useMutation,
    useQuery,
    useQueryClient,
    type QueryClient,
} from "@tanstack/react-query";
import { createMessage, getMessages } from "../action";


export const prefetchMessages = async (
    queryClient: QueryClient,
    projectId: string,
) => {
    await queryClient.prefetchQuery({
        queryKey: ["messages", projectId],
        queryFn: () => getMessages(projectId),
        staleTime: 10_000,
    });
};


export const useGetMessages = (projectId: string) => {
    return useQuery({
        queryKey: ["messages", projectId],
        queryFn: () => getMessages(projectId),
        staleTime: 10_000,
        refetchInterval: (query) => {
            return query.state.data?.length ? 5000 : false;
        },
        enabled: Boolean(projectId),
    });
};

/**
 * React Query mutation hook for sending a new message to a project.
 *
 * Invalidates the project's messages query on success so the list refetches.
 *
 * @param projectId - The project the new message belongs to.
 */
export const useCreateMessage = (projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (value: string) => createMessage(value, projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages", projectId],
            });
        },
    });
};
