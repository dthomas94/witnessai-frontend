import axios, { type AxiosResponse } from "axios";
import type { paths, components } from "./schema";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

type PromptsAndResponsesResponse =
  paths["/api/prompts"]["get"]["responses"]["200"]["content"]["application/json"];
type ConversationResponse =
  paths["/api/conversations/{id}"]["get"]["responses"]["200"]["content"]["application/json"];
type ConversationsResponse =
  paths["/api/conversations"]["get"]["responses"]["200"]["content"]["application/json"];

export const getPromptsAndResponses = async (
  conversationId?: string,
): Promise<PromptsAndResponsesResponse> => {
  const promptsAndResponses = await api.get<PromptsAndResponsesResponse>(
    "/prompts",
    {
      params: {
        filter: { conversation_id: conversationId },
        include: "llm_responses",
      },
    },
  );
  return promptsAndResponses.data;
};

export const getConversation = async (
  conversationId: string,
): Promise<ConversationResponse> => {
  const conversation = await api.get<ConversationResponse>(
    `/conversations/${conversationId}`,
  );
  return conversation.data;
};

export const getConversations = async (params: {
  page: number;
  limit: number;
}): Promise<ConversationsResponse> => {
  const conversations = await api.get<ConversationsResponse>("/conversations", {
    params,
  });
  return conversations.data;
};
