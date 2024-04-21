import React from 'react';
import { useEffect, useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
const MapWithOpenStreetMapProvider = ({ selectedDestinations, routeData }) => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map').setView([41.7339, 24.4858], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
      language: 'en' // Specify the language option for English
    }).addTo(map);

    // Define custom marker icon
    const customIcon = L.icon({
      iconUrl: process.env.PUBLIC_URL + "/map-pin.png", // Customize with your marker icon URL
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    // Add markers for selected destinations
    selectedDestinations.forEach(destination => {
      L.marker([destination.latitude, destination.longitude], { icon: customIcon }).addTo(map)
        .bindPopup(destination.name);
    });

    // Cleanup function to remove the map when the component unmounts
    return () => {
      map.remove();
    };
  }, [selectedDestinations]);





  return (
    <div id="map" style={{ height: '650px', width: '100%' }}></div>
  );
};

export default MapWithOpenStreetMapProvider;








/// route draw (route is good but gets positioned wrong (in africa))
    // // Draw the route polyline if route data is available
    // // if (routeData) {
    // //   const routeCoordinates = routeData.geometry.coordinates.map(coord => [coord[1], coord[0]]);
    // //   L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);
    // // }


    //   // Parse the coordinates from the encoded polyline
    //   const coordinates = decodePolyline(routeData.geometry);

    //         // Create polyline using the parsed coordinates
    //         const polyline = L.polyline(coordinates, { color: 'red' }).addTo(map);

    //   // Fit the map to the bounds of the polyline and selected destinations
    //   const bounds = L.latLngBounds(coordinates.concat(selectedDestinations.map(dest => [dest.latitude, dest.longitude])));
    //   map.fitBounds(bounds);



      

    //  // Function to decode polyline
    //  const decodePolyline = (encoded) => {
    //   const precision = 5 / Math.pow(10, 6);
    //   let index = 0;
    //   let lat = 0;
    //   let lng = 0;
    //   const coordinates = [];
    //   let shift = 0;
    //   let result = 0;
    //   let byte = null;
  
    //   while (index < encoded.length) {
    //     byte = null;
    //     shift = 0;
    //     result = 0;
    //     do {
    //       byte = encoded.charCodeAt(index++) - 63;
    //       result |= (byte & 0x1f) << shift;
    //       shift += 5;
    //     } while (byte >= 0x20);
  
    //     const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    //     lat += dlat;
  
    //     shift = 0;
    //     result = 0;
    //     do {
    //       byte = encoded.charCodeAt(index++) - 63;
    //       result |= (byte & 0x1f) << shift;
    //       shift += 5;
    //     } while (byte >= 0x20);
  
    //     const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    //     lng += dlng;
  
    //     coordinates.push([lat * precision, lng * precision]);
    //   }
    //   return coordinates;
    // };







    //other map component:
      // const MapComponent = () => {
  //   return (
  //     <div className="map-container">
  //       <MapContainer
  //         center={[51.505, -0.09]}
  //         zoom={13}
  //         style={{ height: "400px", width: "100%" }}
  //         scrollWheelZoom={false}
  //       >
  //         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  //         {/* Add markers for each location */}
  //         {/* {selectedDestinations.map(location => (
  //             <Marker key={location.id} position={[location.latitude, location.longitude]}>
  //               <Popup>{location.name}</Popup>
  //             </Marker>
  //           ))} */}
  //         {/* Display the route */}
  //         {/* <Polyline positions={routeCoordinates} color="blue" /> */}
  //         <Marker position={[51.505, -0.09]}>
  //           <Popup>
  //             A pretty CSS3 popup. <br /> Easily customizable.
  //           </Popup>
  //         </Marker>
  //       </MapContainer>
  //     </div>
  //   );
  // };