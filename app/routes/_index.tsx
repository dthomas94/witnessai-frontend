import { useNavigate } from "react-router";
import { Card } from "@radix-ui/themes";
import {
  BellIcon,
  ShieldChevronIcon,
  ChatCircleTextIcon,
  SparkleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  DetectiveIcon,
} from "@phosphor-icons/react";
import { FeatureCard } from "@/ui/components/FeatureCard/FeatureCard";

type LinkItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  cta: string;
  tone: "blue" | "green" | "amber";
};

export default function HomeRoute() {
  const navigate = useNavigate();

  const links: LinkItem[] = [
    {
      title: "Monitor Conversations",
      description:
        "Track user interactions and analyze AI generated responses for quality and safety.",
      href: "/conversations",
      icon: <DetectiveIcon size={22} weight="fill" />,
      cta: "View conversations",
      tone: "blue",
    },
    {
      title: "Detect Risks",
      description:
        "Identify risky prompts and responses that require attention and follow up.",
      href: "/alerts",
      icon: <ShieldCheckIcon size={22} weight="fill" />,
      cta: "Review alerts",
      tone: "green",
    },
    {
      title: "Manage Alerts",
      description:
        "Stay informed with alerts for sensitive or harmful content across models and users.",
      href: "/alerts",
      icon: <BellIcon size={22} weight="fill" />,
      cta: "Open alert center",
      tone: "amber",
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-10rem)] bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <Card className="shadow-sm overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr] md:items-center">
              {/* Icon */}
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="h-44 w-44 sm:h-52 sm:w-52 rounded-[36px] bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex items-center justify-center">
                    <ShieldChevronIcon
                      size={88}
                      weight="fill"
                      className="text-white"
                    />
                  </div>

                  <div className="absolute -bottom-3 -right-3 h-12 w-12 rounded-full bg-white shadow flex items-center justify-center border border-slate-200">
                    <SparkleIcon
                      size={20}
                      weight="fill"
                      className="text-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className="min-w-0">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                  Welcome to WitnessAI
                </h1>
                <p className="text-lg text-slate-600 mt-3 max-w-2xl">
                  Monitor and review AI conversations with confidence.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/conversations")}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Get Started
                    <ArrowRightIcon size={18} className="ml-2" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/alerts")}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-slate-700 font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    View Alerts
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <ShieldChevronIcon
                      size={16}
                      weight="fill"
                      className="text-slate-600"
                    />
                    Safety first
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <ChatCircleTextIcon
                      size={16}
                      weight="fill"
                      className="text-slate-600"
                    />
                    Conversation review
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                    <BellIcon
                      size={16}
                      weight="fill"
                      className="text-slate-600"
                    />
                    Alerting and triage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Feature cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {links.map((link) => (
            <FeatureCard
              key={link.title}
              title={link.title}
              description={link.description}
              cta={link.cta}
              icon={link.icon}
              tone={link.tone}
              onClick={() => navigate(link.href)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
