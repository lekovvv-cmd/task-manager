export type Priority = "high" | "medium" | "low";

export type SubTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type FileData = {
  name: string;
  type: string;
  dataUrl: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  priority: Priority;
  completed: boolean;
  files: FileData[];
  subTasks: SubTask[];
};

export type TasksState = {
  items: Task[];
};
