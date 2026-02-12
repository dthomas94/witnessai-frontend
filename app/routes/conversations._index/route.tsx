import { Table } from "@/ui/primitives/Table/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import axios from "axios";
import {
  useLoaderData,
  useNavigate,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { getConversations } from "api/index";
import { format } from "date-fns";

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
    navigate(`/conversations/${row.id}`);
  };

  return (
    <main>
      <h1 className="font-bold text-center py-4">Conversations</h1>
      <div className="w-full calc(100vh-10rem) overflow-scroll">
        <Table
          data={conversations}
          columns={columns}
          pagination={pagination}
          onRowClick={handleRowClick}
        />
      </div>
    </main>
  );
}
