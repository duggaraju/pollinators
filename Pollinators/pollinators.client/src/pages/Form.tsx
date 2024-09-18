import { useCallback, useState } from "react";
import Location from "../components/Location";
import CameraComponent from "../components/Camera";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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

function Form() {
  const [image, setImage] = useState<string>();
  const [notes, setNotes] = useState<string>("");
  const [plantType, setPlantType] = useState("Other");
  const [location, setLocation] = useState<GeolocationPosition>();
  const [uploading, setUploading] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const uploadPhoto = async (token: string) => {
    setUploading(true);
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
        RecaptchaToken: token,
      },
      body: JSON.stringify(imageData),
    });
    if (response.ok) {
      console.log("Photo uploaded");
    } else {
      console.error("Photo upload failed");
    }
    setUploading(false);
  };

  const handleReCaptchaVerifyAndUpload = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("submit_photo");
    console.log(token);
    await uploadPhoto(token);
  }, [executeRecaptcha]);

  return (
    <div className="w-screen h-full">
      <h2>Report a pollinator plant</h2>
      <Location onLocation={setLocation} />
      <CameraComponent onCapture={setImage} />
      <div className="flex flex-col">
        <div className="flex flex-row justify-center p-1">
          <span>Plant Type:</span>
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
        </div>
      </div>
      <div className="flex flex-row justify-center p-1">
        <span>Notes:</span>
        <input
          type="text"
          className="min-w-fit"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any additional notes here..."
        />
      </div>
      <button
        disabled={!location || !image || uploading}
        onClick={handleReCaptchaVerifyAndUpload}
        className="bg-blue-500 disabled:bg-zinc-700 px-4 text-white ml-4 rounded-full" 
      >
        Submit
      </button>
    </div>
  );
}

export default Form;
