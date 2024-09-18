// add a react component to display the map
import React, { useEffect, useRef } from "react";

type Token = {
	token: string;
	expiresOn: string;
};

async function getToken(scope: string) {
	const response = await fetch(`/api/location/token?scope=${scope}`);
	if (response.ok)
	{
		const data = await response.json() as Token;
		return data.token;	
	}
}

function mapScope(scope:string) {
	switch(scope) {
		case 'https://rtd-metadata.azurewebsites.net/user_impersonation':
			return 'Dashboard';
		default:
			return scope;
	}
}

const Dashboard: React.FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const eventHandler = async (e: MessageEvent) => {
		if (e.data.signature === 'queryExplorer' && e.data.type === 'getToken') {
			console.log('iframe event', e);
			const token = await getToken(mapScope(e.data.scope));
			frameRef.current?.contentWindow?.postMessage({
				type: "postToken",
				message: token,
				scope: e.data.scope 
			}, "*");
		};
	};

    window.addEventListener("message", eventHandler);
    return () => window.removeEventListener("message", eventHandler);
  });

  return (
    <div className="w-screen h-full flex-auto">
      <iframe
        className="w-screen flex-auto h-full"
        ref={frameRef}
        title="Dashboard"
        src="https://dataexplorer.azure.com/dashboards/868fbe2f-5c45-421c-b0f2-de6bbcbd7fbf?f-IFrameAuth=true&f-UseMeControl=false&f-ShowPageHeader=false&f-ShowNavigation=false&p-_startTime=1hours&p-_endTime=now#55a9579d-dcc8-4b0d-8241-4eeed23e2ebe"
      ></iframe>
    </div>
  );
};

export default Dashboard;
