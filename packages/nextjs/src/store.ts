import { create } from "zustand";

const createEventStoreInit = {
  title: "",
  description: "",
  imageUrl: "",
  imageFile: null,
  location: null,
  startAt: null,
  endAt: null,
};

export type TCreateEventStore = {
  title: string;
  description: string;
  location: { lat: number; lng: number } | null;
  imageFile: File | null;
  startAt: number | "now" | null;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: { lat: number; lng: number }) => void;
  setImageFile: (imageFile: File | null) => void;
  setStartAt: (startAt: number | "now") => void;
  flush: () => void;
};

export const useCreateEventStore = create<TCreateEventStore>(set => ({
  ...createEventStoreInit,

  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setLocation: (location: { lat: number; lng: number }) => set({ location }),
  setImageFile: (imageFile: File | null) => set({ imageFile }),
  setStartAt: (startAt: number | "now") => set({ startAt }),
  flush: () => set({ ...createEventStoreInit }),
}));
