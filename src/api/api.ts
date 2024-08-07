import { Station, Vendor } from "./model";

export default interface API {
	getBikeVendors(top: number, skip?: number): Promise<Vendor[]>;
	getCount(): Promise<number>;
	getStations(vendor: string): Promise<Station[]>;
}