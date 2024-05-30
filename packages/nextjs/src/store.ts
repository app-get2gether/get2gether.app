import { create } from "zustand";

const createEventStoreInit = {
  title: "",
  description: "",
  imageUrl: "",
  imageFile: null,
  startAt: null,
  endAt: null,

  address: "",
  addressInfo: "",
  location: null,
};

export type TCreateEventStore = {
  title: string;
  description: string;
  imageFile: File | null;
  startAt: number | "now" | null;

  address: string;
  addressInfo: string;
  location: { lat: number; lng: number } | null;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: { lat: number; lng: number } | null) => void;
  setAddress: (address: string) => void;
  setAddressInfo: (addressInfo: string) => void;
  setImageFile: (imageFile: File | null) => void;
  setStartAt: (startAt: number | "now") => void;
  flush: () => void;
};

export const useCreateEventStore = create<TCreateEventStore>(set => ({
  ...createEventStoreInit,

  setTitle: (title: string) => set({ title }),
  setDescription: (description: string) => set({ description }),
  setLocation: (location: { lat: number; lng: number } | null) => set({ location }),
  setAddress: (address: string) => set({ address }),
  setAddressInfo: (addressInfo: string) => set({ addressInfo }),
  setImageFile: (imageFile: File | null) => set({ imageFile }),
  setStartAt: (startAt: number | "now") => set({ startAt }),
  flush: () => set({ ...createEventStoreInit }),
}));
