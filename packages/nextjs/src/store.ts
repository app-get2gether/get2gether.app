import { create } from "zustand";

const createEventStoreInit = {
  title: "",
  description: "",
  imageUrl: "",
  location: null,
  startAt: null,
  endAt: null,
};

export type TCreateEventStore = {
  title: string;
  description: string;
  location: { lat: number; lng: number } | null;
  imageUrl: string;
  startAt: Date | null;
  endAt: Date | null;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
  setStartAt: (startAt: Date) => void;
  setEndAt: (endAt: Date) => void;
  setImageUrl: (imageUrl: string) => void;
  flush: () => void;
};

export const useCreateEventStore = create<TCreateEventStore>(set => ({
  ...createEventStoreInit,

  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setLocation: (location: { lat: number; lng: number }) => set({ location }),
  setStartAt: (startAt: Date) => set({ startAt }),
  setEndAt: (endAt: Date) => set({ endAt }),
  setImageUrl: (imageUrl: string) => set({ imageUrl }),
  flush: () => set({ ...createEventStoreInit }),
}));
