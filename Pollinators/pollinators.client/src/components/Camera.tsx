// Capture a photo from the camera and display it on the screen
import React, { useRef } from "react";
import { Camera, CameraElement } from "react-use-camera";

export type CameraProps = {
  onCapture: (imgSrc?: string) => void;
};

const CameraComponent: React.FC<CameraProps> = ({ onCapture }) => {
  const cameraRef = useRef<CameraElement>(null);

  const handleCapture = async () => {
    const imageData = await cameraRef.current?.capture();
    console.log("imageData", imageData);
    // Camera view will pause after capture
    // imageData.url is a base64 string that can also be used as src for an <img/> tag
    // imageData.blob is a blob string to send to your server

    // NOTES:
    // (i) Use `cameraRef.current?.capture({ mirror: true });` to flip the captured image (will be enabled by default on front camera)
    // (ii) Use `cameraRef.current?.capture({ width: 512 });` to capture image in 512px width (height will be auto calculated)
    // (iii) Use `cameraRef.current?.capture({ height: 512 });` to capture image in 512px height (width will be auto calculated)
    // (iv) If width or height is not specified, your captured image will be of the same size as the camera resolution
    if (imageData) onCapture(imageData.url);
  };

  const handleClear = () => {
    cameraRef.current?.clear(); // Discards the captured photo and resumes the camera view
    onCapture(undefined);
  };

  const onReady = () => {
    console.log("Camera is now visibile to the user");
  };

  return (
    <div>
      <Camera
        ref={cameraRef}
        className="camera"
        style={{ width: 480, height: 480 }}
        errorLayout={<div>Oops!</div>}
        onReady={onReady}
        onError={(e) => console.error("Camera couldn't load :(")}
      />
      {/* Add your own UI here... */}
      <button onClick={handleCapture}>Capture</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default CameraComponent;
