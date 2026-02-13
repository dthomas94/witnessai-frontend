import { ChatBubble } from "@/ui/primitives/ChatBubble/ChatBubble";
import { getConversation, getPromptsAndResponses } from "api";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Badge } from "@radix-ui/themes";
import clsx from "clsx";

function extractResponseText(
  output: { [key: string]: string | unknown } | null,
): string {
  try {
    const parsed = JSON.parse(output as unknown as string);
    return parsed?.[0]?.content?.[0]?.text ?? "No response";
  } catch {
    return "Invalid response";
  }
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params as { id: string }; // not great type safety but it's fine for now
  const conversation = await getConversation(id);
  const promptsAndResponses = await getPromptsAndResponses(id);
  const promptsReversed = promptsAndResponses.prompts
    .map((prompt) => ({
      ...prompt,
      llm_responses: [...(prompt.llm_responses ?? [])].reverse(), // Reverse the responses to show the latest at the bottom
    }))
    .reverse(); // Reverse the prompts to show the latest at the bottom

  return {
    conversation,
    promptsAndResponses: promptsReversed,
  };
}
export default function ConversationRoute() {
  const { conversation, promptsAndResponses } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className="text-2xl font-bold text-center py-4">
        {conversation.title}
      </h1>
      <div className="flex flex-col gap-8 p-4 overflow-scroll h-[calc(100vh-10rem)]">
        {promptsAndResponses.map((prompt) => (
          <div
            key={prompt.id}
            className="flex flex-col gap-7 chat-bubble-container"
          >
            <ChatBubble variant="user" date={prompt.created}>
              <p>{prompt.text}</p>
            </ChatBubble>
            {prompt.llm_responses.map((response) => (
              <ChatBubble
                variant="assistant"
                key={response.id}
                date={response.created}
                className={clsx(response.risk_score >= 3 && "bg-red-500")}
              >
                {extractResponseText(response.output)}
                <Badge color="red">{response.risk_score}</Badge>
              </ChatBubble>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
