import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function App() {
  return (
    <div className="bg-white dark:bg-black h-screen w-screen flex flex-col">
      <h1 className="text-3xl justify-center">People + Pollinators</h1>
      <h2> Where are the Bees?</h2>
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
        </ul>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/report"
            element={
              <GoogleReCaptchaProvider reCaptchaKey="6LdCg0cqAAAAANKL1gXcexNG1jK1Uw-ChTho6LuP">
                <Form />
              </GoogleReCaptchaProvider>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
