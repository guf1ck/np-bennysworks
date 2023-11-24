export function progressBar(pLength: number, pName: string, pRunCheck = false): Promise<number> {
    return new Promise((resolve) => {
        if (pName) {
            exports['np-taskbar'].taskbar(pLength, pName, pRunCheck, true, null, false, resolve);
        } else {
            setTimeout(() => resolve(100), pLength);
        }
    });
}

export const loadAnimDict = (dict: string): Promise<boolean> => {
    return new Promise((resolve) => {
        RequestAnimDict(dict);

        const loaded = setInterval(() => {
            if (HasAnimDictLoaded(dict)) {
                clearInterval(loaded);

                resolve(true);
            }
        }, 200);

        setTimeout(() => {
            clearInterval(loaded);
            resolve(false);
        }, 5000)
    });
};