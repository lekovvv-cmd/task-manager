import { FilterControl } from "../Control/FilterControl";
import { SortControl } from "../Control/SortControl";

type Props = {
  filter: "all" | "done" | "undone";
  onFilterChange: (v: "all" | "done" | "undone") => void;
  sortBy: "priority" | "deadline" | "alphabet";
  onSortChange: (v: "priority" | "deadline" | "alphabet") => void;
  onAdd: () => void;
};

export function Header({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  onAdd,
}: Props) {
  return (
    <header className="w-full px-4 pt-6 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <FilterControl active={filter} onChange={onFilterChange} />
        <SortControl active={sortBy} onChange={onSortChange} />
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition w-full sm:w-auto cursor-pointer"
      >
        New Task
      </button>
    </header>
  );
}
