import { Box, Card } from "@radix-ui/themes";
import clsx from "clsx";

type ChatBubbleProps = {
  /** Message content */
  children: React.ReactNode;
  /** Who sent the message */
  variant?: "user" | "assistant";
  /** Timestamp for the message (ISO string or parseable date string) */
  date?: string;
  /** Additional class names */
  className?: string;
};

function formatTimestamp(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

const userCardStyles = "bg-blue-900 text-white rounded-br-md opacity-100";
const assistantCardStyles =
  "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-md";

export function ChatBubble({
  children,
  variant = "assistant",
  date,
  className,
}: ChatBubbleProps) {
  const isUser = variant === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <Box className="flex max-w-[85%] flex-col">
        <Card
          size="1"
          variant="ghost"
          className={clsx(
            `px-4 py-2.5 `,
            isUser ? userCardStyles : assistantCardStyles,
            className,
          )}
        >
          <div className="wrap-break-word text-[15px] leading-relaxed">
            {children}
          </div>
          {date && (
            <div
              className={clsx(
                "mt-1 text-xs opacity-80",
                isUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {formatTimestamp(date)}
            </div>
          )}
        </Card>
      </Box>
    </div>
  );
}
