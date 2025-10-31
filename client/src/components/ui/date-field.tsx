import * as React from "react";
import { cn } from "@/lib/utils";

const DateFieldYears = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "inline-flex w-[2.5em] appearance-none bg-transparent text-center tabular-nums outline-none placeholder:text-muted-foreground/40",
        className
      )}
      placeholder="AAAA"
      {...props}
    />
  );
});
DateFieldYears.displayName = "DateFieldYears";

const DateFieldMonths = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "inline-flex w-[1.5em] appearance-none bg-transparent text-center tabular-nums outline-none placeholder:text-muted-foreground/40",
        className
      )}
      placeholder="MM"
      {...props}
    />
  );
});
DateFieldMonths.displayName = "DateFieldMonths";

const DateFieldDays = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "inline-flex w-[1.5em] appearance-none bg-transparent text-center tabular-nums outline-none placeholder:text-muted-foreground/40",
        className
      )}
      placeholder="DD"
      {...props}
    />
  );
});
DateFieldDays.displayName = "DateFieldDays";

const DateFieldSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children = "/", ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-muted-foreground/40", className)}
      {...props}
    >
      {children}
    </span>
  );
});
DateFieldSeparator.displayName = "DateFieldSeparator";

export {
  DateFieldYears,
  DateFieldMonths,
  DateFieldDays,
  DateFieldSeparator,
};
