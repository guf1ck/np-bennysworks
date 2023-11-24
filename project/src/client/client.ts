import * as Controllers from './controllers';
// import { EndKeyInput, StartKeyInput } from './helpers/keyInput';
import { GetNewNodeData } from './helpers/nodeEditor';
// import { GeneratePartPrices } from './helpers/partPrices';
// import { ToggleApp } from './helpers/ui';
// import { Camera } from './modules/camera';
import { CategoryUI } from './modules/categoryUI';
// import { Vehicle } from './modules/vehicle';

export let devMode = true;
export let vehicle: Vehicle = null;
export let camera: Camera = null;
export let categoryUI: CategoryUI = null;
export let availableMods: AvailableVehicleMod[] = null;
export let availableWheelTypes: AvailableVehicleWheelType = null;
export let availableWheels: AvailableVehicleWheelType[] = null;

(async () => {
    await Controllers.Init();

    // GeneratePartPrices();

    RequestStreamedTextureDict('np_sprites', false);
})();

export const PreviewPart = (
    pSetDefault: boolean,
    pIsWheelCategory: boolean,
    pIsWheel: boolean,
    pCategory?: string,
    pPart?: number,
): void => {
    if (pSetDefault) {
        vehicle.previewMod(pSetDefault, pIsWheelCategory, pIsWheel);

        return;
    }

    let mod = null;
    let part = null;

    if (pIsWheelCategory) {
        mod = availableWheelTypes;
        part = availableWheelTypes.parts.find((category) => category.index === pPart).id;
    } else if (pIsWheel) {
        mod = availableWheels.find((wheel) => wheel.mod === pCategory);
        part = mod.parts[pPart].id;
    } else {
        mod = availableMods.find((mod) => mod.mod === pCategory);
        part = mod.parts[pPart].id;
    }

    vehicle.previewMod(pSetDefault, pIsWheelCategory, pIsWheel, mod.mod, part);
};

export const DestroyVehicle = (): void => {
    vehicle = null;
};

export const EnterCustomizationCamera = (): void => {
    camera.EnterCustomization;
};

export const HandleCamera = async (pDirections: string): Promise<void> => {
    const data = await camera.getNextMod(pDirections);
    categoryUI.setCurrentMod(data.currentMod);

    if (!data.camData) {
        return;
    }

    await camera.gotoMod(data.camData);
};

export const ToggleCameraFreecam = async (): Promise<void> => {
    await camera.toggleFreecam();
};

export const ExitCustomizationCamera = (): void => {
    camera.exitCustomization();
};

export const DestroyCamera = (): void => {
    camera.destroy();
    camera = null;
};

export const EnableCategoryUI = (): void => {
    categoryUI.init(vehicle.getVeh(), availableMods, camera.getCurrentMod());
};

export const DisableCategoryUI = (): void => {
    categoryUI.destroy();
};

export const DestroyCategoryUI = (): void => {
    categoryUI = null;
};

export const HandleDevMode = (pDevMode: boolean): void => {
    devMode = pDevMode;
};

RegisterCommand(
    'bennys:enter',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (src: number, args: string[]) => {
        const veh = GetVehiclePedIsIn(PlayerPedId(), false);

        if (veh === 0) {
            console.log('Not in a vehicle.');

            return;
        }

        if (vehicle) {
            console.log("Already in Benny's");

            return;
        }

        vehicle = new Vehicle(veh);

        availableMods = vehicle.getAvailableMods();
        availableWheelTypes = vehicle.getAvailableWheelTypes();
        availableWheels = vehicle.getAvailableWheels();

        camera = new Camera(veh, availableMods);
        categoryUI = new CategoryUI();

        ToggleApp(true);
        StartKeyInput();
    },
    false,
);

RegisterCommand(
    'bennys:exit',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (src: number, args: string[]) => {
        if (!vehicle) {
            console.log("Not in Benny's.");

            return;
        }

        ToggleApp(false);
        EndKeyInput();

        if (camera) {
            camera.destroy();
        }

        if (categoryUI) {
            categoryUI.destroy();
        }

        vehicle = null;
        camera = null;
    },
    false,
);

RegisterCommand(
    'bennys:node:newdata',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (src: number, args: string[]) => {
        const newData = GetNewNodeData();

        console.log('New node data:', newData);
    },
    false,
);