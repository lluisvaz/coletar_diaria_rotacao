import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  mode?: "single" | "range";
  selected?: Date | { from?: Date; to?: Date } | null;
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  return (
    <DatePicker
      mode="single"
      selected={date}
      onSelect={setDate as any}
      placeholder="Escolha uma data"
    />
  );
}

function DatePicker({
  mode = "single",
  selected,
  onSelect,
  placeholder = "Escolha uma data",
  className,
  disabled,
}: DatePickerProps) {
  const formatDate = (date: Date | { from?: Date; to?: Date } | null | undefined) => {
    if (!date) return placeholder;
    
    if (date instanceof Date) {
      return date.toLocaleDateString('pt-BR');
    }
    
    if (typeof date === "object" && "from" in date) {
      const { from, to } = date;
      if (from && to) {
        return `${from.toLocaleDateString('pt-BR')} - ${to.toLocaleDateString('pt-BR')}`;
      } else if (from) {
        return from.toLocaleDateString('pt-BR');
      }
    }
    
    return placeholder;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal bg-[#151515]",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          data-testid="button-date-picker"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(selected)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode as any}
          selected={selected as any}
          onSelect={onSelect as any}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

const DatePickerTrigger = PopoverTrigger;
const DatePickerContent = PopoverContent;
const DatePickerCalendar = Calendar;

function DatePickerValue({ placeholder }: { placeholder?: string }) {
  return null;
}

export {
  DatePicker,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerCalendar,
  DatePickerValue,
};
