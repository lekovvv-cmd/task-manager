import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateTask, deleteTask } from "../../features/tasks/tasksSlice";
import { type Task, type FileData } from "../../features/tasks/types";

type Props = {
  task: Task;
  onClose: () => void;
};

export function TaskModal({ task, onClose }: Props) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [deadline, setDeadline] = useState(task.deadline || "");
  const [files, setFiles] = useState<FileData[]>([...task.files]);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [completed, setCompleted] = useState(task.completed);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const fileToData = (file: File): Promise<FileData> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          name: file.name,
          type: file.type,
          dataUrl: reader.result as string,
        });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewFile(file);
  };

  const handleDeleteFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedFiles = files;
    if (newFile) {
      const fileData = await fileToData(newFile);
      updatedFiles = [...files, fileData];
    }

    dispatch(
      updateTask({
        ...task,
        title,
        description,
        deadline,
        files: updatedFiles,
        completed,
      })
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-6 sm:p-8
                    transform transition-transform duration-300 ${
                      visible ? "translate-y-0" : "translate-y-full"
                    }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              id="completed"
              type="checkbox"
              checked={completed}
              onChange={() => setCompleted((c) => !c)}
              className="mr-2 accent-green-500 cursor-pointer"
            />
            <label htmlFor="completed" className="select-none dark:text-white">
              {completed ? "Completed" : "In progress"}
            </label>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
          />

          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y transition-colors max-h-80"
          />

          <input
            name="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors"
          />

          {files.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Attached files:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-gray-900 dark:text-white"
                  >
                    <div className="flex-1 min-w-0">
                      <a
                        href={file.dataUrl}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline mr-2 truncate"
                      >
                        {file.name}
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteFile(i)}
                      className="text-red-500 hover:underline text-sm flex-shrink-0"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label
              htmlFor="taskFileInput"
              className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm rounded dark:text-white"
            >
              📎 Attach file
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {newFile?.name ?? "New file not selected"}
            </span>
            <input
              id="taskFileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="w-full mr-2 py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-md shadow-md transition-colors cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(deleteTask(task.id));
              onClose();
            }}
            className="w-full ml-2 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md shadow-md transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
