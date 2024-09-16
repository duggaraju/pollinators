// react component to get the geolocation and display
// the location on the screen
import React, { useState, useEffect } from 'react';

const Location: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition((position) => {
		setLocation({
		  latitude: position.coords.latitude,
		  longitude: position.coords.longitude,
		});
	  });
	} else {
	  alert('Geolocation is not supported by this browser.');
	}
  }, []);

  return (
	<div>
	  {location ? (
		<p>
		  Latitude: {location.latitude}, Longitude: {location.longitude}
		</p>
	  ) : (
		<p>Loading location...</p>
	  )}
	</div>
  );
};

export default Location;
