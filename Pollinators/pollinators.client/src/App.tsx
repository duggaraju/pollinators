import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import { InteractionType } from "@azure/msal-browser";
import {
  MsalAuthenticationTemplate,
  useMsal,
} from "@azure/msal-react";

function App() {
  const { accounts, instance } = useMsal();
  return (
    <div className="bg-white dark:bg-black h-screen w-screen flex flex-col">
      <h1 className="text-3xl justify-center">People + Pollinators</h1>
      <Router>
        <ul
          className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row justify-center"
          role="tablist"
        >
          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <Link to="/dashboard">
              <button className="bg-blue-500 px-4 text-white ml-4 rounded-full">
                Dashboard
              </button>
            </Link>
          </li>
          <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <Link to="/report">
              <button className="bg-blue-500 px-4 text-white ml-4 rounded-full">
                Report
              </button>
            </Link>
          </li>
          {accounts.length == 0 && (
            <button
              className="bg-blue-500 px-4 text-white ml-4 rounded-full"
              onClick={() => instance.loginRedirect()}
            >
              Login
            </button>
          )}
          {accounts.length > 0 && (
            <button className="bg-blue-500 px-4 text-white ml-4 rounded-full">
              Logout {accounts[0].username}
            </button>
          )}
          <li></li>
        </ul>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <MsalAuthenticationTemplate
                interactionType={InteractionType.Redirect}
              >
                <Dashboard />
              </MsalAuthenticationTemplate>
            }
          />
          <Route path="/report" element={<Form />} />
          <Route path="*" element={<Navigate to="/report" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
