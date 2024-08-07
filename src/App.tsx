import { Table, TableColumn, TableRow, TableCell, Button, Bar, Title } from '@ui5/webcomponents-react';
import './App.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Label } from '@ui5/webcomponents-react';
import { useEffect, useState } from 'react';
import API from './api/api';
import { Vendor } from './api/model';
import { LatLngTuple, Map } from 'leaflet';
import { CurrentPlace, MarkedPlace } from './components/Markers';
import "@ui5/webcomponents-icons/dist/globe";
import "@ui5/webcomponents-icons/dist/reset";
import "@ui5/webcomponents-icons/dist/sort-ascending";
import "@ui5/webcomponents-icons/dist/sort-descending";

type MarkerInfo = {
  id: string;
  position: LatLngTuple;
  city: string;
  name: string;
};

function App({api}: { api: API}) {
  const threshold = 20;
  const [vendors ,setVendors] = useState([] as Vendor[]);
  const [count, setCount] = useState(0);
  const [markers, setMarkers] = useState([] as MarkerInfo[]);
  const [current, setCurrent] = useState(null as MarkerInfo | null);
  const [map, setMap] = useState(null as Map | null);

  useEffect(() => {
    Promise.all([api.getBikeVendors(threshold), api.getCount()]).then(([data, count]) => {
      setVendors(data);
      setCount(count);
    });
  }, [api]);

  function onRowClick(event: CustomEvent) {
    const vendor = vendors.find((vendor: Vendor) => vendor.id === event.detail.row.id);
    if (vendor) {
      map?.flyTo([vendor.location.latitude, vendor.location.longitude], 13);
      
      if (markers.find((marker: any) => marker.id === event.detail.row.id)) {
        setCurrent(null);
      } else {
        setCurrent({ id: vendor.id, position: [vendor.location.latitude, vendor.location.longitude], city: vendor.location.city, name: vendor.name });
      }
    }
  }

  function onSelectionChange(event: CustomEvent) {
    const selected = event.detail.selectedRows;
    const newMarkers = selected.reduce((acc: MarkerInfo[], row: any) => {
      const vendor = vendors.find((vendor: Vendor) => vendor.id === row.id);
      if (vendor) {
        acc.push({ id: vendor.id, position: [vendor.location.latitude, vendor.location.longitude], city: vendor.location.city, name: vendor.name });
      }
      return acc;
    }, []);
    setMarkers(newMarkers);

    if (current !== null && selected.find((row: any) => row.id === current.id)) {
      setCurrent(null);
    }
  }

  function onLoadMore(event: CustomEvent) {
    api.getBikeVendors(vendors.length + threshold, vendors.length).then((data: Vendor[]) => {
      setVendors(vendors.concat(data));
    });
  }

  return (
    <div className="App">
      <div id="topBar">
        <Bar startContent={<>
          <Button icon="sap-icon://globe" onClick={() => {map?.flyTo([0, 0], 0)}}>World View</Button>
          <Button icon="sap-icon://reset" onClick={() => {setMarkers([]); setCurrent(null);}}>Clear</Button>
        </>}>
        </Bar>
        <MapContainer id="map" ref={setMap} zoom={0} center={[0, 0]} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
          />
          {current !== null ? <CurrentPlace position={current.position} city={current.city} name={current.name} /> : <></>}
          {markers.map((marker: MarkerInfo) => {
            return <MarkedPlace key={marker.id} position={marker.position} city={marker.city} name={marker.name} />;
          })}
        </MapContainer>
      </div>

      <Bar 
        startContent={<>
          <Title level="H4">City Bike Vendors ({count})</Title>
        </>}
      ></Bar>

      <Table
        growing='Button'
        onLoadMore={onLoadMore}
        growingButtonSubtext={`[${vendors.length} of ${count}]`}
        mode="MultiSelect"
        onSelectionChange={onSelectionChange}
        onRowClick={onRowClick}
        columns={<>
          <TableColumn style={{width: `12rem`}}><Label>Name</Label></TableColumn>
          <TableColumn minWidth={600} demandPopin popinText='City'><Label>City</Label></TableColumn>
          <TableColumn minWidth={600} demandPopin popinText='Company'><Label>Company</Label></TableColumn>
          <TableColumn minWidth={800} demandPopin popinText='Country'><Label>Country</Label></TableColumn></>}>
          {vendors.map((vendor: Vendor) => {
            return (
              <TableRow id={vendor.id} key={vendor.id} type='Active'>
                <TableCell><Label>{vendor.name}</Label></TableCell>
                <TableCell><Label>{vendor.location.city}</Label></TableCell>
                <TableCell><Label wrappingType='Normal'>{vendor.company.join(", ")}</Label></TableCell>
                <TableCell><Label>{vendor.location.country}</Label></TableCell>
              </TableRow>
            );
          })}
      </Table>
    </div>
  );
}

export default App;
