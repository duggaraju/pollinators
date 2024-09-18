import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import Zoom from 'ol/control/Zoom';

const Dashboard = () => {
    useEffect(() => {
        // Initialize the map
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: new VectorSource()
                })
            ],
            view: new View({
                center: fromLonLat([-122.2015, 47.6101]), // Bellevue coordinates
                zoom: 12 // Adjust zoom level as needed
            }),
            controls: [
                new Zoom()
            ]
        });

        // Function to fetch and display locations within the current map view
        const fetchLocationsInRange = async (latitude: number, longitude: number, rangeInKm: number) => {
            console.log(`Fetching locations in range: ${rangeInKm} km around (${latitude}, ${longitude})`);
            try {
                const response = await fetch(`/api/location/range?latitude=${latitude}&longitude=${longitude}&rangeInKm=${rangeInKm}`);
                if (response.ok) {
                    const locations = await response.json();
                    const newVectorSource = new VectorSource();

                    locations.forEach((location: { latitude: number; longitude: number; name: string; }) => {
                        const marker = new Feature({
                            geometry: new Point(fromLonLat([location.longitude, location.latitude])),
                            name: location.name
                        });
                        marker.setStyle(new Style({
                            image: new CircleStyle({
                                radius: 7,
                                fill: new Fill({ color: 'rgba(255, 0, 0, 0.6)' }), // Red color with some transparency
                                stroke: new Stroke({ color: 'rgba(255, 0, 0, 1)', width: 2 }) // Red stroke
                            })
                        }));
                        newVectorSource.addFeature(marker);
                    });

                    // Clear existing features and add new ones
                    map.getLayers().getArray().forEach(layer => {
                        if (layer instanceof VectorLayer) {
                            layer.setSource(newVectorSource);
                        }
                    });

                    map?.render(); // Refresh the map
                } else {
                    console.error('Failed to fetch locations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        // Function to handle map view changes
        const handleMapViewChange = async () => {
            console.log('Map view changed');
            const view = map.getView();
            const center = view.getCenter();
            const extent = view.calculateExtent(map.getSize());
            const [minX, minY, maxX, maxY] = extent;
            const [minLon, minLat] = toLonLat([minX, minY]);
            const [maxLon, maxLat] = toLonLat([maxX, maxY]);

            // Calculate the center coordinates in longitude and latitude
            const [longitude, latitude] = toLonLat(center);

            // Calculate the range in kilometers (approximation)
            const rangeInKm = Math.sqrt(Math.pow(maxLon - minLon, 2) + Math.pow(maxLat - minLat, 2)) * 111; // 1 degree ~ 111 km

            console.log(`Center: (${latitude}, ${longitude}), Range: ${rangeInKm} km`);

            // Reuse the fetchLocationsInRange function
            await fetchLocationsInRange(latitude, longitude, rangeInKm);
        };

        // Add event listener for map moveend event
        map.on('moveend', handleMapViewChange);

        // Fetch and display locations initially
        handleMapViewChange();

    }, []);

    return (
        <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    );
};

export default Dashboard;