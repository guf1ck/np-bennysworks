interface AvailableVehicleMod {
    cameraData: any;
    mod: string;
    parts: AvailableVehiclePart[];
}

interface AvailableVehiclePart {
    index: number;
    id: number;
    name: string;
    price: number;
}

interface AvailableVehicleWheelType {
    mod: string;
    parts: AvailableVehiclePart[];
}