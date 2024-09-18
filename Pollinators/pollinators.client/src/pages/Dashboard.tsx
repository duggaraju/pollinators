// add a react component to display the map
import { useMsal, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import React, { useEffect, useRef } from "react";

const queryRequest = {
  scopes: ["https://pollinator.westus3.kusto.windows.net/.default"],
};

const dashboardRequest = {
  scopes: ["https://rtd-metadata.azurewebsites.net/user_impersonation"],
};

const Dashboard: React.FC = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { login, result, error } = useMsalAuthentication(
    InteractionType.Silent,
    queryRequest
  );
  console.log("Login", result, error);
  useEffect(() => {
    if (error) {
      login(InteractionType.Redirect, queryRequest);
    }
  }, [error, login, result]);

  useEffect(() => {
    const eventHandler = async (e: MessageEvent) => {
      if (e.data.signature === "queryExplorer" && e.data.type === "getToken") {
        console.log("iframe event", e, result);
		if (result) {

		} else {

		}
        frameRef.current?.contentWindow?.postMessage(
          {
            type: "postToken",
            message: result?.accessToken,
            scope: e.data.scope,
          },
          "*"
        );
      }
    };

    window.addEventListener("message", eventHandler);
    return () => window.removeEventListener("message", eventHandler);
  }, [result]);

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
