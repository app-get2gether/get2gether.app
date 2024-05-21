import { createContext } from "react";
import type { WebApp } from "telegram";

export const WebAppContext = createContext<WebApp | null>(null);
