import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store/store";
import type { Task, Priority } from "./features/tasks/types";
import { TaskCard } from "./components/Tasks/TaskCard";
import { TaskModal } from "./components/Modals/TaskModal";
import { AddTaskModal } from "./components/Modals/AddTaskModal";
import { Header } from "./components/Layout/Header";
import { EmptyState } from "./components/Layout/EmptyState";

export default function App() {
  const { items: tasks } = useSelector((s: RootState) => s.tasks);

  const [isAddOpen, setAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "alphabet">(
    "priority"
  );

  // Фильтрация задач
  let visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed
  );

  // Сортировка с учётом статуса
  visible = [...visible].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (sortBy === "priority") {
      const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === "deadline") {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Вынесённая шапка с фильтрами, сортировкой и кнопкой */}
      <Header
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAdd={() => setAddOpen(true)}
      />

      {/* Основной контент */}
      <main className="flex-1 p-4 sm:pt-4 w-full max-w-6xl mx-auto">
        {tasks.length === 0 ? (
          <EmptyState
            message="There are no tasks yet."
            submessage={
              <>
                Click on{" "}
                <span className="text-green-600 font-medium">"New Task"</span>, to
                create the first one.
              </>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState message="There are no tasks matching the filter." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            {visible.map((task) => (
              <div key={task.id} className="w-full max-w-sm">
                <TaskCard task={task} onClick={() => setSelectedTask(task)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Модальные окна */}
      <AddTaskModal isOpen={isAddOpen} onClose={() => setAddOpen(false)} />
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
