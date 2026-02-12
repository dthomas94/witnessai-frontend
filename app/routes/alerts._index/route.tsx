import { getPromptsAndResponses } from "api";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Card, Badge, Text, Box, Flex } from "@radix-ui/themes";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await getPromptsAndResponses();
  console.log(data);

  return {
    riskyPrompts: data.prompts.filter((prompt) => prompt.risk_score > 0),
    riskyResponses: data.prompts.filter((prompt) =>
      prompt.llm_responses?.some((response) => response.risk_score >= 3),
    ),
  };
}

export default function AlertsRoute() {
  const { riskyPrompts, riskyResponses } = useLoaderData<typeof loader>();
  return (
    <div className="flex gap-4 p-4 mb-4 h-[calc(100vh-10rem)]">
      <Flex className="w-50  p-4 justify-center items-center flex-col overflow-scroll h-full">
        <Badge color="red">Risky Prompts</Badge>
        <Text>{riskyPrompts.length}</Text>

        {riskyPrompts.map((prompt) => (
          <Text className="border border-red-400" key={prompt.id}>
            {prompt.text}
          </Text>
        ))}
      </Flex>
      <Flex className="w-50 h-50 p-4 justify-center items-center flex-col">
        <Badge color="red">Risky Responses</Badge>
        <div className="flex flex-col gap-2"> </div>
        <Text>{riskyResponses.length}</Text>

        <div className="flex flex-col gap-2">
          {riskyResponses.map((response) => (
            <Text className="border border-red-400" key={response.id}>
              {response.text.slice(0, 100)}...
            </Text>
          ))}
        </div>
      </Flex>
    </div>
  );
}
