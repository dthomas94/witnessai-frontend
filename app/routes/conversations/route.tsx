import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { getConversations } from "api/index";
import { format } from "date-fns";
import { ConversationsList } from "@/features/conversations/components/ConversationsList";

export function HydrateFallback() {
  return (
    <main>
      <h1>Loading...</h1>
    </main>
  );
}

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page")
    ? Number(url.searchParams.get("page"))
    : 1;
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : 25;
  const conversations = await getConversations({ page, limit });
  return {
    conversations: conversations.conversations,
    pagination: {
      pageIndex: conversations.page - 1,
      pageSize: conversations.limit,
      total: conversations.total,
    },
  };
}

export default function ConversationsIndexRoute() {
  const navigate = useNavigate();
  const { conversations, pagination } = useLoaderData<typeof clientLoader>();
  const columns = useMemo<ColumnDef<(typeof conversations)[number]>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Conversation Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "user_id",
        header: "User ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) =>
          format(new Date(row.updated), "MMM d, yyyy hh:mm a"),
        header: "Last Message Sent",
      },
    ],
    [],
  );

  const handleRowClick = (row: (typeof conversations)[number]) => {
    navigate(`/conversations/${row.id}`, { replace: true });
  };

  return (
    <div className="flex gap-4 h-full mt-4">
      <div className="flex-1 min-w-[400px]">
        <ConversationsList
          title="Conversations"
          data={conversations}
          columns={columns}
          pagination={pagination}
          onRowClick={handleRowClick}
        />
      </div>

      <div className="flex-1 h-full">
        <Outlet />
      </div>
    </div>
  );
}
