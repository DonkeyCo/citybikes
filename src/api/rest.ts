import API from "./api";
import { Network, Station, Vendor } from "./model";
import { BASE_URL } from "../constants";

export default class RestAPI implements API {
	data: Vendor[] = [];

	async getData(): Promise<void> {
		if (this.data.length === 0) {
			const response = await window.fetch(`${BASE_URL}?fields=id,name,company,location`, { method: "GET" });
			const data: Network = await response.json();
			// Sorting vendors by country for demo purposes
			this.data = data.networks.sort((a, b) => a.location.country.localeCompare(b.location.country)) || [];
		}
	}

	async getBikeVendors(top: number, skip: number = 0): Promise<Vendor[]> {
		await this.getData();
		return Promise.resolve(this.data.slice(skip, top));
	}

	async getCount(): Promise<number> {
		await this.getData();
		return Promise.resolve(this.data.length);
	}

	async getStations(vendor: string): Promise<Station[]> {
		return Promise.resolve([]);
	}
}