import type { ReactNode } from "react";
import { Card } from "@radix-ui/themes";
import { ArrowRightIcon } from "@phosphor-icons/react";

export function FeatureCard({
  title,
  description,
  cta,
  icon,
  onClick,
  tone,
}: {
  title: string;
  description: string;
  cta: string;
  icon: ReactNode;
  onClick: () => void;
  tone: "blue" | "green" | "amber";
}) {
  const toneClasses =
    tone === "blue"
      ? {
          bubble: "bg-blue-50 text-blue-700 border-blue-100",
          link: "text-blue-700",
          hover: "hover:bg-blue-50/60",
        }
      : tone === "green"
        ? {
            bubble: "bg-green-50 text-green-700 border-green-100",
            link: "text-green-700",
            hover: "hover:bg-green-50/60",
          }
        : {
            bubble: "bg-amber-50 text-amber-700 border-amber-100",
            link: "text-amber-700",
            hover: "hover:bg-amber-50/60",
          };

  return (
    <Card className="shadow-sm">
      <div
        onClick={onClick}
        className={`w-full text-left p-6 rounded-[inherit] focus:outline-none focus:ring-2 focus:ring-slate-300 ${toneClasses.hover}`}
      >
        <div
          className={`h-12 w-12 rounded-full border flex items-center justify-center ${toneClasses.bubble}`}
        >
          {icon}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mt-4">{title}</h3>
        <p className="text-sm text-slate-600 mt-2 leading-6">{description}</p>

        <div
          className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${toneClasses.link}`}
        >
          {cta}
          <ArrowRightIcon size={16} />
        </div>
      </div>
    </Card>
  );
}
