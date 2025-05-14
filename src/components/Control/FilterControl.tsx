import clsx from "clsx";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export type FilterOption = "all" | "done" | "undone";

interface Props {
  active: FilterOption;
  onChange: (value: FilterOption) => void;
}

const OPTIONS: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "Done", value: "done" },
  { label: "Undone", value: "undone" },
];

export function FilterControl({ active, onChange }: Props) {
  return (
    <div
      className={clsx(
        "flex w-full sm:w-auto justify-around sm:justify-start gap-1",
        "bg-gray-100 dark:bg-gray-700 rounded-lg p-1",
        "transition-colors duration-200"
      )}
    >
      {OPTIONS.map(({ label, value }) => {
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
            <AdjustmentsHorizontalIcon
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
