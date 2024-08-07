import { Marker, Popup } from "react-leaflet";
import map_blue from '../assets/map_blue.png';
import flag_blue from '../assets/flag_blue.png';
import Leaflet, { LatLngTuple } from 'leaflet';

const mapIcon = Leaflet.icon({
	iconUrl: map_blue,
	iconSize: [40, 40],
	iconAnchor: [20, 40],
	popupAnchor: [0, -25],
	shadowSize: [0, 0]
});

const flagIcon = Leaflet.icon({
	iconUrl: flag_blue,
	iconSize: [40, 40],
	iconAnchor: [10, 40],
	popupAnchor: [0, -25],
	shadowSize: [0, 0]
});

function CurrentPlace({ position, city, name }: { position: LatLngTuple, city: string, name: string }) {
	return (
		<Marker icon={mapIcon} position={position} >
			<Popup>
				<div>
					<h3>{name}</h3>
					<p>{city}</p>
				</div>
			</Popup>
		</Marker>
	);
}

function MarkedPlace({ position, city, name }: { position: LatLngTuple, city: string, name: string }) {
	return (
		<Marker icon={flagIcon} position={position} >
			<Popup>
				<div>
					<h3>{name}</h3>
					<p>{city}</p>
				</div>
			</Popup>
		</Marker>
	);
}

export { CurrentPlace, MarkedPlace };