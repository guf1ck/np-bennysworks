import { InitConfig } from "../../shared/config";
import { InitEvents } from "./events";

export async function Init(): Promise<void> {
    await InitConfig();
    await InitEvents();
}