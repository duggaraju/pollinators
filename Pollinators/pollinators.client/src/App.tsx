import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import DesignerImage from './assets/Designer.png';

function App() {
  return (
    <div className="bg-yellow-100 dark:bg-black h-screen w-screen flex flex-col">
      <div className="flex justify-center items-center py-1 bg-yellow-100 dark:bg-black">
        <img
          src={DesignerImage}
          alt="Bee Icon"
          className="h-20 w-20 mr-2 opacity-80 rounded-lg object-cover"
        />
        <h1 className="text-5xl font-bold text-center text-yellow-500 p-2 rounded bg-white dark:bg-gray-700 leading-tight">
          BuzzMap
        </h1>
      </div>
      <h4 className="text-lg font-semibold text-center">
        Discover the World of Pollinators
      </h4>
      <Router>
        <ul
          className="flex mb-0 list-none flex-wrap pt-1 pb-4 flex-row justify-center"
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