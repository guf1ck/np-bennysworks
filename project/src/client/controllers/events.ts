import { HandleDevMode } from '../client';

export async function InitEvents(): Promise<void> {
    onNet('np-admin:currentDevMode', HandleDevMode);
}