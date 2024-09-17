// add a react component to display the map
import React from 'react';

const Dashboard: React.FC = () => {
  return (
	<div className="min-h-fit">
	  <div id="map" style={{ width: '100%', backgroundColor: '#eaeaea' }}>
		{/* Map will be displayed here */}
	  </div>
	</div>
  );
};

export default Dashboard;
