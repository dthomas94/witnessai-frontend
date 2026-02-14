import type { ReactNode } from "react";
import clsx from "clsx";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";

export type AlertItem = {
  id: string;
  text: string;
  meta?: string;
};

export type AlertPanelTone = "danger" | "warning" | "info";

export type AlertPanelProps<T extends AlertItem> = {
  title: string;
  description?: string;

  /** Label shown in the inner header (e.g. "Risky Prompts") */
  subtitle?: string;

  /** Count of items */
  count?: number;

  /** Items rendered in the list */
  items: T[];

  /** Optional icon shown in the panel header bubble */
  icon?: ReactNode;

  /** Visual tone */
  tone?: AlertPanelTone;

  /** Max rows to show before "View all" */
  maxItems?: number;

  /** CTA */
  viewAllText?: string;
  onViewAll?: () => void;
  onAlertClick?: (item: T) => void;
  className?: string;
};

export function AlertPanel<T extends AlertItem>({
  title,
  description,
  subtitle = title,
  items,
  icon,
  tone = "danger",
  count,
  maxItems = 8,
  viewAllText = "View all",
  onViewAll,
  onAlertClick,
  className,
}: AlertPanelProps<T>) {
  const s = toneStyles(tone);
  const shown = items.slice(0, maxItems);

  return (
    <div className={clsx("p-6 h-full", className)}>
      {/* Top header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={clsx(
              "h-11 w-11 rounded-full flex items-center justify-center ring-1 shrink-0",
              s.iconBg,
              s.iconFg,
              s.iconRing,
            )}
          >
            {icon ?? <WarningCircleIcon size={22} weight="fill" />}
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {description ? (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Inner panel */}
      <div
        className={clsx(
          "rounded-xl overflow-hidden border",
          s.shellBorder,
          s.shellBg,
        )}
      >
        {/* Inner header */}
        <div
          className={clsx(
            "px-4 py-3 border-b flex items-center justify-between",
            s.shellBorder,
            s.shellHeaderBg,
          )}
        >
          <div className="flex items-center gap-2">
            <WarningCircleIcon size={18} weight="fill" className={s.iconFg} />
            <span className="font-semibold text-slate-900">{subtitle}</span>
          </div>

          <span
            className={clsx(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              s.badgeBg,
            )}
          >
            {count ?? items.length}{" "}
            {(count ?? items.length) === 1 ? "alert" : "alerts"}
          </span>
        </div>

        {/* Rows */}
        <div className="px-2 py-2">
          {shown.length === 0 ? (
            <EmptyState />
          ) : (
            <div className={clsx("divide-y", s.divider)}>
              {shown.map((item) => (
                <AlertRow
                  key={item.id}
                  item={item}
                  iconColor={s.iconFg}
                  hoverClass={s.rowHover}
                  onClick={onAlertClick ? () => onAlertClick(item) : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={clsx(
            "px-4 py-3 border-t flex items-center justify-end",
            s.shellBorder,
            s.footerBg,
          )}
        >
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {viewAllText}
              <ArrowRightIcon size={16} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AlertRow<T extends AlertItem>({
  item,
  iconColor,
  hoverClass,
  onClick,
}: {
  item: T;
  iconColor: string;
  hoverClass: string;
  onClick?: () => void;
}) {
  const content = (
    <div
      onClick={onClick}
      role="button"
      className={clsx(
        "flex items-start gap-3 px-3 py-3 rounded-lg",
        hoverClass,
      )}
    >
      <div className="mt-0.5 shrink-0">
        <WarningCircleIcon size={18} weight="fill" className={iconColor} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-slate-900 leading-6">{item.text}</p>
        {item.meta ? (
          <p className="text-xs text-slate-500 mt-1">{item.meta}</p>
        ) : null}
      </div>
    </div>
  );

  return content;
}

function EmptyState() {
  return (
    <div className="px-4 py-10">
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-slate-900">No alerts</p>
        <p className="text-sm text-slate-500">You’re all clear right now.</p>
      </div>
    </div>
  );
}

function toneStyles(tone: AlertPanelTone) {
  switch (tone) {
    case "warning":
      return {
        iconBg: "bg-amber-50",
        iconFg: "text-amber-700",
        iconRing: "ring-amber-100",
        shellBorder: "border-amber-200",
        shellBg: "bg-amber-50/40",
        shellHeaderBg: "bg-amber-50/70",
        divider: "divide-amber-100",
        rowHover: "hover:bg-amber-50/60 cursor-pointer",
        badgeBg: "bg-amber-100 text-amber-800",
        footerBg: "bg-white",
      };
    case "info":
      return {
        iconBg: "bg-sky-50",
        iconFg: "text-sky-700",
        iconRing: "ring-sky-100",
        shellBorder: "border-sky-200",
        shellBg: "bg-sky-50/40",
        shellHeaderBg: "bg-sky-50/70",
        divider: "divide-sky-100",
        rowHover: "hover:bg-sky-50/60 cursor-pointer",
        badgeBg: "bg-sky-100 text-sky-800",
        footerBg: "bg-white",
      };
    case "danger":
    default:
      return {
        iconBg: "bg-red-50",
        iconFg: "text-red-600",
        iconRing: "ring-red-100",
        shellBorder: "border-red-200",
        shellBg: "bg-red-50/40",
        shellHeaderBg: "bg-red-50/70",
        divider: "divide-red-100",
        rowHover: "hover:bg-red-50/60 cursor-pointer",
        badgeBg: "bg-red-100 text-red-700",
        footerBg: "bg-white",
      };
  }
}
