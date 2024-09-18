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
  const [buttonText, setButtonText] = useState<string>("Submit");

  const { executeRecaptcha } = useGoogleReCaptcha();
  const uploadPhoto = async (token: string) : Promise<boolean> => {
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

    let success: boolean;

    if (response.ok) {
      console.log("Photo uploaded");
      success = true;
    } else {
      console.error("Photo upload failed");
      success = false;
    }
    setUploading(false);

    return success;
  };

  const handleReCaptchaVerifyAndUpload = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("submit_photo");
    console.log(token);
    setButtonText("Uploading...")
    if (await uploadPhoto(token)) {
      setButtonText("Submitted")
    }
    else {
      setButtonText("Submission Error")
    }

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
        {buttonText}
      </button>
    </div>
  );
}

export default Form;
