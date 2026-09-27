import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AGENT_COOKIE_NAME, getAgentSession } from "@/lib/server/agent-session";
import { getAgentDashboardData } from "@/lib/server/agents";
import { listInvoicesForActor } from "@/lib/server/invoices";
import { AgentDashboard, type AgentView } from "@/components/agent/agent-dashboard";

export const metadata: Metadata = {
  title: "Agent dashboard",
  description: "Eluxus agent dashboard.",
  alternates: {
    canonical: "/agent",
  },
};

const views: AgentView[] = [
  "overview",
  "calendar",
  "tasks",
  "invoices",
  "availability",
  "services",
  "chat",
  "profile",
];
export default async function AgentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  const session = getAgentSession(cookieStore.get(AGENT_COOKIE_NAME)?.value);
  if (!session) {
    redirect("/agent/login");
  }

  const data = await getAgentDashboardData(session.agentId);
  if (!data) {
    redirect("/agent/login");
  }

  const params = await searchParams;
  const rawView = Array.isArray(params.view) ? params.view[0] : params.view || "overview";
  const view = views.includes(rawView as AgentView) ? (rawView as AgentView) : "overview";
  const saved = Array.isArray(params.saved) ? params.saved[0] : params.saved || "";
  const error = Array.isArray(params.error) ? params.error[0] : params.error || "";
  const invoices =
    view === "invoices"
      ? await listInvoicesForActor({
          actorType: "agent",
          actorId: session.agentId,
          agentId: session.agentId,
        })
      : [];

  return (
    <AgentDashboard
      data={data}
      invoices={invoices}
      view={view}
      saved={saved}
      error={error}
    />
  );
}
