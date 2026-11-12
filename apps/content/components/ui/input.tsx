import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-lg border border-border bg-input px-3.5 text-sm font-medium text-foreground outline-none transition-colors placeholder:font-normal placeholder:text-muted-foreground hover:border-brand-line focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand-soft disabled:cursor-not-allowed disabled:opacity-60";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, "h-10", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, "min-h-28 py-2.5", className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClass, "h-10 pr-8", className)} {...props} />;
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-foreground/85">
      {children}
    </label>
  );
}
