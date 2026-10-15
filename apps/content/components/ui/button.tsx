import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "default" | "sm" | "icon";

const variants: Record<Variant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(99,14,212,0.28)] hover:bg-[#2a035c]",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
  outline: "border border-border bg-card hover:bg-accent",
  ghost: "hover:bg-accent",
  destructive: "bg-destructive text-white hover:bg-destructive/90",
};

const sizes: Record<Size, string> = {
  default: "h-9 px-3",
  sm: "h-8 px-2.5 text-xs",
  icon: "h-9 w-9",
};

export function buttonClasses(
  variant: Variant = "default",
  size: Size = "default",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-extrabold transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
