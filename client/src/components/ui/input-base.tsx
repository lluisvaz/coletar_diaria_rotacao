import * as React from "react";
import { cn } from "@/lib/utils";

const InputBase = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild, children, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "div";
  const wrapperProps = asChild ? {} : { ref, ...props };

  return (
    <Comp {...wrapperProps}>
      <div
        className={cn(
          "flex h-9 w-full items-center gap-1 rounded-md border border-[#E5E5E5] bg-[#151515] px-3 py-2 text-base ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...(asChild ? { ref, ...props } : {})}
      >
        {children}
      </div>
    </Comp>
  );
});
InputBase.displayName = "InputBase";

const InputBaseFlexWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 items-center gap-1", className)}
      {...props}
    />
  );
});
InputBaseFlexWrapper.displayName = "InputBaseFlexWrapper";

const InputBaseAdornment = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center", className)}
      {...props}
    />
  );
});
InputBaseAdornment.displayName = "InputBaseAdornment";

const InputBaseAdornmentButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  const buttonProps = asChild
    ? {}
    : {
        ref,
        type: "button" as const,
        className: cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground/70 hover:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          className
        ),
        ...props,
      };

  return asChild ? (
    <div className={cn(
      "inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground/70 hover:text-foreground",
      className
    )}>
      {props.children}
    </div>
  ) : (
    <Comp {...buttonProps} />
  );
});
InputBaseAdornmentButton.displayName = "InputBaseAdornmentButton";

export {
  InputBase,
  InputBaseFlexWrapper,
  InputBaseAdornment,
  InputBaseAdornmentButton,
};
