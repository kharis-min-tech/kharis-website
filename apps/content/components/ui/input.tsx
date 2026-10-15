import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground outline-none ring-ring placeholder:font-medium placeholder:text-muted-foreground focus-visible:ring-2";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, "min-h-28 py-2", className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, "h-11", className)} {...props} />;
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-gold"
    >
      {children}
    </label>
  );
}
