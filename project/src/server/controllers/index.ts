import { InitEvents } from "./events";

export async function Init(): Promise<void> {
    await InitEvents();
}