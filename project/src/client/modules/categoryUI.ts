import { GetDistance } from '../../shared/utils/tools';
import { devMode } from '../client';
// import { isNodeEditorShowing } from '../helpers/ui';
import { CalculateModPos, MapRange } from '../helpers/utils'; 

export class CategoryUI {
    protected drawTick = 0;
    protected vehicle = 0;
    protected availableMods: AvailableVehicleMod[];
    protected currentMod = '';
    protected currentModCameraData: any;
    protected vehicleSize = [0, 0, 0];
    protected vehiclePos = [0, 0, 0] ;
    protected renderMode = 0;

    /*
     * PRIVATE METHODS
     */
    protected drawTextBox(
        pCoords: number[],
        pText: string,
        pColour: { r: number; g: number; b: number; a: number },
        pFont?: number,
        pDrawBg?: boolean,
    ): void {
        SetDrawOrigin(pCoords[0], pCoords[1], pCoords[2], 0);

        SetTextColour(pColour.r, pColour.g, pColour.b, pColour.a);
        SetTextScale(0, 0.4);
        SetTextFont(pFont ?? 0);
        SetTextCentre(true);

        SetTextEntry('STRING');
        AddTextComponentString(pText ?? 'Dummy text');
        EndTextCommandDisplayText(0, -0.065);

        if (pDrawBg) {
            DrawRect(0, -0.051, pText.length / 200, 0.025, 240.0, 242.0, 245.0, 220);
            DrawSprite('np_sprites', 'np_marker_icon', 0, -0.035, 0.015, 0.015, 0, 240.0, 242.0, 245.0, 255);
        }

        ClearDrawOrigin();
    }

    protected drawIcon(
        pCoords: number[],
        pIcon: { dict: string; txt: string },
        pIconSize: { width: number; height: number },
        pIconHeading: number,
        pColour: { r: number; g: number; b: number; a: number },
    ): void {
        SetDrawOrigin(pCoords[0], pCoords[1], pCoords[2], 0);
        DrawSprite(
            pIcon.dict,
            pIcon.txt,
            0,
            0,
            pIconSize.width,
            pIconSize.height,
            pIconHeading,
            pColour.r,
            pColour.g,
            pColour.b,
            pColour.a,
        );
        ClearDrawOrigin();
    }

    /*
     *
     */
    public init(pVehicle: number, pAvailableMods: AvailableVehicleMod[], pCurrentMod: string) {
        this.vehicle = pVehicle;
        this.availableMods = pAvailableMods;
        this.currentMod = pCurrentMod;
        this.currentModCameraData = this.availableMods.filter((mod) => mod.mod === this.currentMod)[0].cameraData;

        const [vehDimMin, vehDimMax] = GetModelDimensions(GetEntityModel(this.vehicle));
        this.vehiclePos = GetEntityCoords(this.vehicle, false);
        this.vehicleSize = [
            (vehDimMax[0] - vehDimMin[0]) / 2,
            (vehDimMax[1] - vehDimMin[1]) / 2,
            (vehDimMax[2] - vehDimMin[2]) / 2,
        ];

        let cogWheelIconHeading = 0;

        this.drawTick = setTick(() => {
            cogWheelIconHeading++;

            if (cogWheelIconHeading === 360) {
                cogWheelIconHeading = 0;
            }

            const textBoxPos = CalculateModPos(
                this.vehicle,
                this.currentModCameraData,
                this.vehiclePos,
                this.vehicleSize[0],
                this.vehicleSize[1],
                this.vehicleSize[2],
            );

            if (devMode /*&& isNodeEditorShowing*/ && this.renderMode > 0) {
                this.drawTextBox(
                    textBoxPos,
                    `${this.currentModCameraData.id} | ${this.currentModCameraData.text}`,
                    { r: 0, g: 0, b: 0, a: 255 },
                    4,
                    true,
                );
            } else {
                this.drawTextBox(textBoxPos, this.currentModCameraData.text, { r: 0, g: 0, b: 0, a: 255 }, 4, true);
            }

            this.drawIcon(
                textBoxPos,
                { dict: 'np_sprites', txt: 'np_cogwheel_icon' },
                { width: 0.03, height: 0.0525 },
                cogWheelIconHeading,
                { r: 240.0, g: 242.0, b: 245.0, a: 255 },
            );

            for (const mod of this.availableMods) {
                if (!mod.cameraData.enabled) {
                    continue;
                }

                const iconPos = CalculateModPos(
                    this.vehicle,
                    mod.cameraData,
                    this.vehiclePos,
                    this.vehicleSize[0],
                    this.vehicleSize[1],
                    this.vehicleSize[2],
                );

                const iconDist = GetDistance(iconPos, textBoxPos);
                const icon = { dict: 'np_sprites', txt: 'np_unselected_icon' };
                let iconOpacity = MapRange(iconDist, 0, 2.5, 100, 0);
                
                if (this.currentMod === mod.mod) {
                    icon.txt = 'np_selected_icon';
                    iconOpacity = 255;
                } else {
                    iconOpacity = devMode /*&& isNodeEditorShowing*/ && this.renderMode === 2 ? 255 : Math.round(iconOpacity);
                }

                const iconColour = { r: 240.0, g: 242.0, b: 245.0, a: iconOpacity };
                const iconSize = { width: 0.0145, height: 0.025 };

                this.drawIcon(iconPos, icon, iconSize, 0, iconColour);

                if (!devMode /*|| !isNodeEditorShowing*/) {
                    continue;
                }

                if (this.currentMod === mod.mod) {
                    continue;
                }

                if (this.renderMode !== 2) {
                    continue;
                }

                this.drawTextBox(iconPos, `${mod.cameraData.id} | ${mod.cameraData.text}`, { r: 0, g: 0, b: 0, a: 255 }, 4, true);
            }
        });
    }

    public destroy(): void {
        clearTick(this.drawTick);
    }

    public setCurrentMod(pCurrentMod): void {
        this.currentMod = pCurrentMod;
        this.currentModCameraData = this.availableMods.filter((mod) => mod.mod === this.currentMod)[0].cameraData;
    }

    public getCurrentMod(): string {
        return this.currentMod;
    }

    public getCurrentModCameraData(): any {
        return this.currentModCameraData;
    }

    public updateAvailableMods(pAvailableMods: AvailableVehicleMod[]): void {
        this.availableMods = pAvailableMods;
    }

    public setRenderMode(pMode: number): void {
        this.renderMode = pMode;
    }
}
