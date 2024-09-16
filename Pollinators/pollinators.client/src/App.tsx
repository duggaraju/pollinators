import { useState } from "react";
import "./App.css";
import Location from "./components/Location";
import CameraComponent from "./components/Camera";

type ImageData = {
  id: string;
  typeofPlant: string;
  latitude: number;
  longitude: number;
  notes: string;
  dateOfEntry: string;
};

const PlantTypes = [
  "Lavender",
  "Sunflower",
  "Bee Balm",
  "Coneflower",
  "Black-eyed Susan",
  "Milkweed",
  "Salvia",
  "Zinnia",
  "Aster",
  "Marigold",
  "Other",
];

function App() {
  const [image, setImage] = useState<string>();
  const [notes, setNotes] = useState<string>('');
  const [plantType, setPlantType] = useState('Other');
  const [location, setLocation] = useState<GeolocationPosition>();

  return (
    <div>
      <h1 id="tableLabel">People + Pollinators</h1>
      <h2>Report a pollinator plant</h2>
      <CameraComponent onCapture={setImage} />
      <p>Current Location:</p> <Location onLocation={setLocation} />
      <p>Plant Type:
      <select
        onChange={(e) => setPlantType(e.target.value)}
        value={plantType}
      >
        {PlantTypes.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>
      </p>
      <p>Notes: <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} /></p>
      <button disabled={!location || !image} onClick={uploadPhoto}>
        Submit
      </button>
    </div>
  );

  async function uploadPhoto() {
    console.log(image);
    const imageData: ImageData = {
      id: crypto.randomUUID(),
      typeofPlant: plantType,
      latitude: location!.coords.latitude,
      longitude: location!.coords.longitude,
      notes,
      dateOfEntry: new Date().toISOString(),
    };
    const response = await fetch("api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageData),
    });
    if (response.ok) {
      console.log("Photo uploaded");
    } else {
      console.error("Photo upload failed");
    }
  }
}

export default App;
