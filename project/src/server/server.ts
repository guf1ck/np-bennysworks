import * as Controllers from './controllers';

async function Init(): Promise<void> {
    await Controllers.Init();
}

Init();