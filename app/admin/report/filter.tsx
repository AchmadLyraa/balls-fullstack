"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn, formatDateYMD } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Matcher, SelectSingleEventHandler } from "react-day-picker";
import type { getAllFields } from "./page";

interface FilterProps {
  from: Date | undefined;
  to: Date | undefined;
  allFields: Awaited<ReturnType<typeof getAllFields>>;
}

export default function Filter({ from, to, allFields }: FilterProps) {
  const router = useRouter();
  const [fromValue, setFromValue] = useState(from);
  const [toValue, setToValue] = useState(to);
  const [fieldId, setFieldId] = useState("_");

  const updateReport = () => {
    const query = [];

    if (fromValue) {
      query.push("from=" + formatDateYMD(fromValue));
    }
    if (toValue) {
      query.push("to=" + formatDateYMD(toValue));
    }
    if (fieldId !== "_") {
      query.push("field=" + fieldId);
    }

    router.push("/admin/report?" + query.join("&"));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Report Filter</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="from-date">
              From <span className="text-red-600">*</span>
            </Label>
            <DateInput
              date={fromValue}
              disabled={(date) => date >= new Date()}
              onSelect={setFromValue}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="to-date">
              To <span className="text-red-600">*</span>
            </Label>
            <DateInput
              date={toValue}
              disabled={(date) =>
                (fromValue ? date < fromValue : false) || date >= new Date()
              }
              onSelect={setToValue}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Field</Label>
            <Select onValueChange={setFieldId} defaultValue="_">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_">All Fields</SelectItem>
                {allFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={updateReport} className="mt-4">
          Show Report
        </Button>
      </CardContent>
    </Card>
  );
}

type DateInputProps = {
  date: Date | undefined;
  disabled: Matcher | Matcher[];
  onSelect: SelectSingleEventHandler;
};

function DateInput({ date, disabled, onSelect }: DateInputProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {date ? formatDateYMD(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
