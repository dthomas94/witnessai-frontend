type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  /** Alert content */
  children: React.ReactNode;
  /** Visual style */
  variant?: AlertVariant;
  /** Optional title above the content */
  title?: string;
  /** Additional class names */
  className?: string;
};

const variantStyles: Record<
  AlertVariant,
  { container: string; title: string }
> = {
  info: {
    container:
      "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-100",
    title: "text-blue-800 dark:text-blue-200",
  },
  success: {
    container:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
    title: "text-emerald-800 dark:text-emerald-200",
  },
  warning: {
    container:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
    title: "text-amber-800 dark:text-amber-200",
  },
  error: {
    container:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100",
    title: "text-red-800 dark:text-red-200",
  },
};

export function Alert({
  children,
  variant = "info",
  title,
  className = "",
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 ${styles.container} ${className}`}
    >
      {title && <p className={`mb-1 font-semibold ${styles.title}`}>{title}</p>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
