export const registered = [];

export function RegisterUICallback(pName: string, cb) {
    AddEventHandler(`_npx_uiReq:${pName}`, cb);

    if (GetResourceState('np-ui') === 'started') exports['np-ui'].RegisterUIEvent(pName);

    registered.push(pName);
}

export function SendUIMessage(pData: any) {
    exports['np-ui'].SendUIMessage(pData);
}

export function SetUIFocus(hasFocus, hasCursor) {
    exports['np-ui'].SetUIFocus(hasFocus, hasCursor);
}

export function GetUIFocus() {
    return exports['np-ui'].GetUIFocus();
}

AddEventHandler('_npx_uiReady', () => {
    registered.forEach((pName) => exports['np-ui'].RegisterUIEvent(pName));
});