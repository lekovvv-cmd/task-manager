import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type TasksState, type Task, type SubTask } from "./types";
import { loadTasks, saveTasks } from "../../utils/localStorage";

const initialState: TasksState = {
  items: loadTasks(),
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Задачи
    addTask(state, action: PayloadAction<Task>) {
      state.items.push(action.payload);
      saveTasks(state.items);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      saveTasks(state.items);
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
      saveTasks(state.items);
    },
    reorderTasks(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
      saveTasks(state.items);
    },
    toggleComplete(state, action: PayloadAction<string>) {
      const t = state.items.find((x) => x.id === action.payload);
      if (t) t.completed = !t.completed;
      saveTasks(state.items);
    },

    // Подзадачи
    addSubTask(
      state,
      action: PayloadAction<{ taskId: string; sub: SubTask }>
    ) {
      const t = state.items.find((x) => x.id === action.payload.taskId);
      if (t) t.subTasks.push(action.payload.sub);
      saveTasks(state.items);
    },
    toggleSubTask(
      state,
      action: PayloadAction<{ taskId: string; subId: string }>
    ) {
      const t = state.items.find((x) => x.id === action.payload.taskId);
      if (t) {
        const s = t.subTasks.find((x) => x.id === action.payload.subId);
        if (s) s.completed = !s.completed;
      }
      saveTasks(state.items);
    },
    deleteSubTask(
      state,
      action: PayloadAction<{ taskId: string; subId: string }>
    ) {
      const t = state.items.find((x) => x.id === action.payload.taskId);
      if (t) {
        t.subTasks = t.subTasks.filter((s) => s.id !== action.payload.subId);
      }
      saveTasks(state.items);
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  toggleComplete,
  addSubTask,
  toggleSubTask,
  deleteSubTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
