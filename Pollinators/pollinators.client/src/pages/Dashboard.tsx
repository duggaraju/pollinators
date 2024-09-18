import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Zoom from 'ol/control/Zoom';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

const Dashboard: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [vectorSource, setVectorSource] = useState<VectorSource>(new VectorSource());

  const initializeMap = (vectorSource: VectorSource) => {
    const initialMap = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: vectorSource
        })
      ],
      view: new View({
        center: fromLonLat([-122.2015, 47.6101]), // Default to Bellevue, WA
        zoom: 10
      }),
      controls: [new Zoom()] // Add default zoom controls
    });
    setMap(initialMap);
  };

  const fetchLocationsInRange = async (latitude = 47.6101, longitude = -122.2015, rangeInKm = 50) => {
    try {
      const response = await fetch(`/api/location/range?latitude=${latitude}&longitude=${longitude}&rangeInKm=${rangeInKm}`);
      if (response.ok) {
        const locations = await response.json();
        console.log('Fetched locations:', locations); // Debugging: Log the fetched locations

        const newVectorSource = new VectorSource();
        locations.forEach((location: { latitude: number; longitude: number; name: string; }) => {
          const marker = new Feature({
            geometry: new Point(fromLonLat([location.longitude, location.latitude])),
            name: location.name
          });
          marker.setStyle(new Style({
            image: new CircleStyle({
              radius: 10, // Increase the radius to make the marker larger
              fill: new Fill({ color: 'rgba(255, 0, 0, 0.6)' }), // Red color with some transparency
              stroke: new Stroke({ color: 'rgba(255, 0, 0, 1)', width: 2 }) // Red stroke
            })
          }));
          newVectorSource.addFeature(marker);
        });

        setVectorSource(newVectorSource);

        // Automatically zoom to show all points
        const extent = newVectorSource.getExtent();
        console.log('Extent:', extent); // Debugging: Log the extent
        if (extent && extent[0] !== Infinity) {
          map?.getView().fit(extent, { padding: [50, 50, 50, 50], duration: 1000 });
        } else {
          console.warn('No valid extent found for the features.');
        }

        map?.render(); // Refresh the map

        // Initialize the map after fetching locations
        initializeMap(newVectorSource);
      } else {
        console.error('Failed to fetch locations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocationsInRange();
  }, []);

  return (
    <div id="map" style={{ height: '100vh', width: '100%' }}></div>
  );
};

export default Dashboard;