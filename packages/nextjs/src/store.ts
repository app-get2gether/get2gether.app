import { create } from "zustand";

const createEventStoreInit = {
  title: "",
  description: "",
  imageUrl: "",
  startAt: null,
  endAt: null,
};

export type TCreateEventStore = {
  title: string;
  description: string;
  imageUrl: string;
  startAt: Date | null;
  endAt: Date | null;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartAt: (startAt: Date) => void;
  setEndAt: (endAt: Date) => void;
  setImageUrl: (imageUrl: string) => void;
  flush: () => void;
};

export const useCreateEventStore = create<TCreateEventStore>(set => ({
  ...createEventStoreInit,

  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setStartAt: (startAt: Date) => set({ startAt }),
  setEndAt: (endAt: Date) => set({ endAt }),
  setImageUrl: (imageUrl: string) => set({ imageUrl }),
  flush: () => set({ ...createEventStoreInit }),
}));
