import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

type DatePickerMode = "single" | "range";

interface DatePickerContextValue {
  mode: DatePickerMode;
  disabled?: boolean;
  selected?: Date | { from?: Date; to?: Date } | null;
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error("Date picker components must be used within DatePicker");
  }
  return context;
}

interface RootProps {
  mode?: DatePickerMode;
  selected?: Date | { from?: Date; to?: Date } | null;
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

function Root({ mode = "single", selected, onSelect, disabled, children }: RootProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePickerContext.Provider
      value={{
        mode,
        disabled,
        selected,
        onSelect,
      }}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
    </DatePickerContext.Provider>
  );
}

const Anchor = PopoverPrimitive.Anchor;
const Trigger = PopoverPrimitive.Trigger;
const Portal = PopoverPrimitive.Portal;
const Content = PopoverPrimitive.Content;

function Clear({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onSelect } = useDatePickerContext();
  
  return (
    <button
      type="button"
      onClick={() => onSelect?.(undefined)}
      {...props}
    >
      {children}
    </button>
  );
}

interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

function Value({ placeholder = "Selecione uma data", ...props }: ValueProps) {
  const { selected, mode } = useDatePickerContext();
  
  let displayValue = placeholder;
  
  if (selected) {
    if (mode === "range" && typeof selected === "object" && "from" in selected) {
      const { from, to } = selected;
      if (from && to) {
        displayValue = `${from.toLocaleDateString('pt-BR')} - ${to.toLocaleDateString('pt-BR')}`;
      } else if (from) {
        displayValue = from.toLocaleDateString('pt-BR');
      }
    } else if (mode === "single" && selected instanceof Date) {
      displayValue = selected.toLocaleDateString('pt-BR');
    }
  }
  
  return (
    <span data-placeholder={!selected} {...props}>
      {displayValue}
    </span>
  );
}

interface DateFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

function DateField({ ...props }: DateFieldProps) {
  return <div {...props} />;
}

const DateFieldYears = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateFieldYears.displayName = "DateFieldYears";

const DateFieldMonths = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateFieldMonths.displayName = "DateFieldMonths";

const DateFieldDays = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateFieldDays.displayName = "DateFieldDays";

const DateFieldSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateFieldSeparator.displayName = "DateFieldSeparator";

function DateRangeField(props: React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }) {
  return <div {...props} />;
}

const DateRangeFieldFrom = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateRangeFieldFrom.displayName = "DateRangeFieldFrom";

const DateRangeFieldTo = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateRangeFieldTo.displayName = "DateRangeFieldTo";

const DateRangeFieldSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
DateRangeFieldSeparator.displayName = "DateRangeFieldSeparator";

const DateRangeFieldYears = DateFieldYears;
const DateRangeFieldMonths = DateFieldMonths;
const DateRangeFieldDays = DateFieldDays;

interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function Calendar({ asChild, children, ...props }: CalendarProps) {
  const { mode, selected, onSelect } = useDatePickerContext();
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      mode: mode === "range" ? "range" : "single",
      selected: selected,
      onSelect: onSelect,
      ...props,
    });
  }
  
  return <div {...props}>{children}</div>;
}

export {
  Root,
  Anchor,
  Trigger,
  Clear,
  Value,
  Portal,
  Content,
  Calendar,
  DateField,
  DateFieldYears,
  DateFieldMonths,
  DateFieldDays,
  DateFieldSeparator,
  DateRangeField,
  DateRangeFieldFrom,
  DateRangeFieldTo,
  DateRangeFieldSeparator,
  DateRangeFieldYears,
  DateRangeFieldMonths,
  DateRangeFieldDays,
  useDatePickerContext as useDatePicker,
};
