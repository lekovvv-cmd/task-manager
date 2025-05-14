import React from "react";
import clsx from "clsx";
import {
  ArrowsUpDownIcon,
  CalendarDaysIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

export type SortOption = "priority" | "deadline" | "alphabet";

interface Props {
  active: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: {
  label: string;
  value: SortOption;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { label: "Priority", value: "priority", Icon: ArrowsUpDownIcon },
  { label: "Deadline", value: "deadline", Icon: CalendarDaysIcon },
  { label: "A→Z", value: "alphabet", Icon: ChevronUpDownIcon },
];

export function SortControl({ active, onChange }: Props) {
  return (
    <div
      className={clsx(
        "flex w-full sm:w-auto justify-around sm:justify-start gap-1",
        "bg-gray-100 dark:bg-gray-700 rounded-lg p-1",
        "transition-colors duration-200"
      )}
    >
      {OPTIONS.map(({ label, value, Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={clsx(
              "flex items-center justify-center",
              "px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium cursor-pointer",
              isActive
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:bg-white hover:dark:bg-gray-800",
              "rounded-md",
              "transition-all duration-200",
              "active:scale-95"
            )}
          >
            <Icon
              className={clsx(
                "h-5 w-5 mr-1",
                isActive ? "text-green-500" : "text-gray-400 dark:text-gray-500"
              )}
            />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
