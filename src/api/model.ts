type Network = {
	networks: Vendor[];
};

type Vendor = {
	id: string;
	name: string;
	company: string[];
	location: {
		city: string;
		country: string;
		latitude: number;
		longitude: number;
	};
};

type Station = {
	id: string;
	name: string;
	free_bikes: number;
	empty_slots: number;
	longitude: number;
	latitude: number;
};

export type { Network, Vendor, Station };