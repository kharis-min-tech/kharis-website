import { cn } from "@/lib/utils";

type NewsletterSignupProps = {
  title: string;
  copy: string;
  placeholder?: string;
  cta?: string;
  className?: string;
  copyClassName?: string;
  buttonClassName?: string;
};

export function NewsletterSignup({
  title,
  copy,
  placeholder = "YOUR EMAIL ADDRESS",
  cta = "Subscribe",
  className,
  copyClassName,
  buttonClassName,
}: NewsletterSignupProps) {
  return (
    <section className="relative z-10 py-stack-lg">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div
          className={cn(
            "relative overflow-hidden rounded-none border-2 border-black neo-shadow p-stack-md",
            className,
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 halftone-pattern opacity-10"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-headline-lg text-headline-lg uppercase leading-tight">
              {title}
            </h2>
            <p className={cn("mb-stack-md font-body-lg text-body-lg", copyClassName)}>
              {copy}
            </p>
            <form
              className="flex flex-col gap-4 md:flex-row"
              data-newsletter="true"
              method="post"
              action="#"
            >
              <label className="flex-grow">
                <span className="sr-only">Email address</span>
                <input
                  className="w-full rounded-none border-2 border-black bg-surface p-4 font-label-md text-on-background outline-none focus:ring-4 focus:ring-primary"
                  placeholder={placeholder}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </label>
              <button
                type="submit"
                className={cn(
                  "shrink-0 rounded-none border-2 border-black bg-on-background px-8 py-4 font-headline-md uppercase text-surface neo-shadow transition-all hover-press",
                  buttonClassName,
                )}
              >
                {cta}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
