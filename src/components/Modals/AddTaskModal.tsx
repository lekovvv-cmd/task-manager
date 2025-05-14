import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addTask } from "../../features/tasks/tasksSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Priority, FileData } from "../../features/tasks/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      setFiles([]);
    }
  }, [isOpen]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const fd = await fileToData(file);
    setFiles((prev) => [...prev, fd]);
    e.target.value = "";
  };

  const handleDeleteFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const deadline = (form.elements.namedItem("deadline") as HTMLInputElement)
      .value;
    const priority = (form.elements.namedItem("priority") as HTMLSelectElement)
      .value as Priority;

    dispatch(
      addTask({
        id: uuidv4(),
        title,
        description,
        deadline,
        priority,
        files,
        completed: false,
        subTasks: [],
      })
    );

    form.reset();
    onClose();
  };

  if (!isOpen) return null;

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
        className={`bg-white dark:bg-gray-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-xl
                    p-6 sm:p-8 transform transition-transform duration-300 ${
                      visible ? "translate-y-0" : "translate-y-full"
                    }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            New Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
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
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
             bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y transition-colors duration-200
             max-h-80"
          />

          <input
            name="deadline"
            type="date"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
          <select
            name="priority"
            defaultValue="medium"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

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
                    <a
                      href={file.dataUrl}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mr-2"
                    >
                      {file.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(i)}
                      className="text-red-500 hover:underline text-sm cursor-pointer"
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
              htmlFor="addTaskFileInput"
              className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm rounded dark:text-white"
            >
              📎 Attach file
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {files.length > 0
                ? files[files.length - 1].name
                : "No file selected"}
            </span>
            <input
              id="addTaskFileInput"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700
                     text-white font-medium rounded-md shadow-md transition-colors duration-200 cursor-pointer"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
