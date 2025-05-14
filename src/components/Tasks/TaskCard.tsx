import { useDispatch } from "react-redux";
import clsx from "clsx";
import { type Task } from "../../features/tasks/types";
import { toggleComplete } from "../../features/tasks/tasksSlice";

type Props = {
  task: Task;
  onClick: () => void;
};

export const TaskCard = ({ task, onClick }: Props) => {
  const dispatch = useDispatch();

  const totalSubs = task.subTasks?.length || 0;
  const incompleteSubs = task.subTasks?.filter((s) => !s.completed).length;

  const priorityStyles = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  } as const;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-2xl shadow-sm",
        "transition-transform duration-150 hover:scale-[1.01] hover:shadow",
        "min-h-[7.5rem] cursor-pointer",
        task.completed && "opacity-50",
        "bg-gray-100 dark:bg-gray-700",
        task.completed && "bg-gray-200 dark:bg-gray-600"
      )}
    >
      <div className="flex items-start sm:items-center w-full sm:w-auto">
        <input
          type="checkbox"
          checked={task.completed}
          onClick={(e) => e.stopPropagation()}
          onChange={() => dispatch(toggleComplete(task.id))}
          className="mt-1 h-5 w-5 accent-green-500 cursor-pointer"
        />
        <div className="ml-3 flex-1">
          <h3
            className={clsx(
              "text-base sm:text-lg font-semibold truncate",
              task.completed && "line-through",
              "text-gray-900 dark:text-white"
            )}
          >
            {task.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-[20ch] overflow-hidden text-ellipsis whitespace-nowrap">
            {task.description || ""}
          </p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span
              className={clsx(
                "px-2 py-0.5 rounded-full font-medium",
                priorityStyles[task.priority]
              )}
            >
              {task.priority[0].toUpperCase() + task.priority.slice(1)}
            </span>

            {task.deadline && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {new Date(task.deadline).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {totalSubs > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                {incompleteSubs}/{totalSubs} subtasks
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onClick}
        className="mt-3 sm:mt-0 sm:ml-auto flex-shrink-0 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        aria-label="Open task"
      />
    </div>
  );
};
