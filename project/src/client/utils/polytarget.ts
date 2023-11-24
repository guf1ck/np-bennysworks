export abstract class PolyTarget {
    static addBoxZone(pId: string, pCenter: any, pLength: number, pWidth: number, pOptions: any): void {
        globalThis.exports["np-polytarget"].AddBoxZone(pId, pCenter, pLength, pWidth, pOptions);
    }

    static addCircleZone(pId: string, pCenter: any, pRadius: number, pOptions: any): void {
        globalThis.exports["np-polytarget"].AddCircleZone(pId, pCenter, pRadius, pOptions);
    }
}