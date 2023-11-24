import { availableMods, camera, categoryUI } from '../client';

let renderMode = 0;
const changedCameraData = new Map<string, any>([]);

export const FetchNodeData = (): any => {
    return categoryUI.getCurrentModCameraData();
};

export const ForceGotoNode = async (pDirection: string, pIsForce: boolean, pNode: string): Promise<void> => {
    if (pIsForce) {
        const node = availableMods.find((mod) => mod.mod === pNode);
        
        if (!node.cameraData) {
            return;
        }
    }

    const nodeNewCamData = await camera.getNextMod(pDirection, pIsForce, pNode);

    categoryUI.setCurrentMod(nodeNewCamData.currentMod);

    if (!nodeNewCamData.camData) {
        return;
    }

    await camera.gotoMod(nodeNewCamData.camData);
};

export const UpdateNodeData = async (pNode: string, pData: any): Promise<void> => {
    const modIndex = availableMods.findIndex((mod) => mod.mod === pNode);
    availableMods[modIndex].cameraData = pData;
    changedCameraData.set(pNode, pData);

    categoryUI.updateAvailableMods(availableMods);
    camera.updateAvailableMods(availableMods);

    const nodeNewCamData = await camera.getNextMod('', true, pNode);

    categoryUI.setCurrentMod(nodeNewCamData.currentMod);

    await camera.gotoMod(nodeNewCamData.camData);
};

export const CycleNodeRender = (): void => {
    renderMode++;

    if (renderMode > 2) {
        renderMode = 0;
    }


    categoryUI.setRenderMode(renderMode);
};

export const GetNewNodeData = (): Map<string, any> => {
    return changedCameraData;
};