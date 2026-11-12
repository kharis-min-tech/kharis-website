import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
  back,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      {back ? (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {icon}
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold tracking-tight md:text-[1.75rem]">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
      </div>
    </div>
  );
}
