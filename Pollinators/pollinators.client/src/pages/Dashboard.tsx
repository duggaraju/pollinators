// add a react component to display the map
import React from 'react';

const Dashboard: React.FC = () => {
  return (
	<div>
	  <h1>Map Display</h1>
	  <div id="map" style={{ width: '100%', height: '500px', backgroundColor: '#eaeaea' }}>
		{/* Map will be displayed here */}
	  </div>
	</div>
  );
};

export default Dashboard;
