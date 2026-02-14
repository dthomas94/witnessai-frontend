import { ChatCircleIcon } from "@phosphor-icons/react";
import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router";
import { getPromptsAndResponses } from "api";
import { AlertPanel } from "@/ui/components/AlertPanel/AlertPanel";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await getPromptsAndResponses();

  return {
    riskyPrompts: data.prompts.filter((prompt) => prompt.risk_score > 0),
    riskyResponses: data.prompts.filter((prompt) =>
      prompt.llm_responses?.some((response) => response.risk_score >= 3),
    ),
  };
}

export default function AlertsIndexRoute() {
  const navigate = useNavigate();
  const { riskyPrompts, riskyResponses } = useLoaderData<typeof loader>();
  const shownPrompts = riskyPrompts.slice(0, 8);
  const shownResponses = riskyResponses.slice(0, 8);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-6 shadow-sm h-[85vh] gap-4 overflow-hidden w-[90vw] mx-auto rounded max-w-[1200px]">
      <AlertPanel<(typeof riskyPrompts)[number]>
        title="Risky Prompts"
        description="Prompts that may lead to harmful or sensitive content."
        count={riskyPrompts.length}
        items={shownPrompts}
        className="overflow-y-auto"
        onAlertClick={(prompt) => {
          navigate(`/conversations/${prompt.conversation_id}`);
        }}
        onViewAll={() => {}}
      />
      <AlertPanel<(typeof riskyResponses)[number]>
        title="Risky Responses"
        count={riskyResponses.length}
        icon={<ChatCircleIcon size={22} weight="fill" />}
        description="LLM responses that may provide harmful, sensitive, or confidential information."
        items={shownResponses}
        className="overflow-y-auto"
        onAlertClick={(response) => {
          navigate(`/conversations/${response.conversation_id}`);
        }}
        onViewAll={() => {}}
      />
    </div>
  );
}
