let GlobalConfig = exports['np-config'].GetModuleConfig('main');

const TrackedModules = new Map();

const ResourceName = GetCurrentResourceName();

export async function InitConfig() {}

on('np-config:configLoaded', (pModule, pConfig) => {
    if (pModule === 'main') {
        GlobalConfig = pConfig;
    }
    else if (TrackedModules.has(pModule)) {
        TrackedModules.set(pModule, pConfig);
    }
});

export function GetConfig(pKey) {
    return GlobalConfig[pKey];
}

export function GetModuleConfig(pModule, pKey) {
    if (!TrackedModules.has(pModule)) {
        const config = exports['np-config'].GetModuleConfig(pModule);
        if (config == undefined)
            return;
        TrackedModules.set(pModule, config);
    }
    const config = TrackedModules.get(pModule);
    return pKey ? config === null || config === void 0 ? void 0 : config[pKey] : config;
}

export function GetResourceConfig(pKey) {
    return GetModuleConfig(ResourceName, pKey);
}