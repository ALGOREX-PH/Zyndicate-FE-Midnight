import { create } from "zustand";

export type ToastTone = "info" | "success" | "danger";

export interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }].slice(-4) }));
    window.setTimeout(() => {
      useToastStore.getState().dismiss(id);
    }, 6000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Imperative helpers usable outside components. */
export const toast = {
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ tone: "info", title, ...(description ? { description } : {}) }),
  success: (title: string, description?: string) =>
    useToastStore
      .getState()
      .push({ tone: "success", title, ...(description ? { description } : {}) }),
  error: (title: string, description?: string) =>
    useToastStore
      .getState()
      .push({ tone: "danger", title, ...(description ? { description } : {}) }),
};
