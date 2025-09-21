import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RotateCcw, ArrowLeft, CheckCircle } from "lucide-react";

export default function Scan() {
  const webcamRef = useRef<Webcam>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    if (step === 1) {
      setFaceImage(imageSrc);
      setStatusMessage("ถ่ายใบหน้าเรียบร้อย! โปรดถ่ายบัตรประชาชน");
      setStep(2);
    } else if (step === 2) {
      setIdCardImage(imageSrc);
      setStatusMessage("ถ่ายบัตรประชาชนเรียบร้อย!");
    }
  }, [step]);

  const retakeImage = () => {
    if (step === 1) {
      setFaceImage(null);
      setStatusMessage("กรุณาถ่ายใบหน้าใหม่");
    } else if (step === 2) {
      setIdCardImage(null);
      setStatusMessage("กรุณาถ่ายบัตรประชาชนใหม่");
    }
  };

  const handleConfirm = () => {
    if (faceImage && idCardImage) {
      setStatusMessage("ยืนยันตัวตนสำเร็จ!");
      setTimeout(() => {
        setFaceImage(null);
        setIdCardImage(null);
        setStep(1);
        setStatusMessage("");
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setIdCardImage(null);
      setStatusMessage("กลับไปถ่ายใบหน้าใหม่");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">
        {step === 1 ? "สแกนใบหน้า" : "สแกนบัตรประชาชน"}
      </h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-md shadow-lg w-full max-w-md"
      />

      {statusMessage && (
        <p className="text-green-400 font-medium mt-2 flex items-center gap-2">
          <CheckCircle size={18} /> {statusMessage}
        </p>
      )}

      <div className="flex space-x-4 mt-4">
        <button
          onClick={captureImage}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
        >
          <Camera size={18} /> ถ่ายรูป
        </button>

        <button
          onClick={retakeImage}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
        >
          <RotateCcw size={18} /> ถ่ายใหม่
        </button>

        {step === 2 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full"
          >
            <ArrowLeft size={18} /> ย้อนกลับ
          </button>
        )}
      </div>

      {faceImage && idCardImage && (
        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full mt-4"
        >
          ยืนยันข้อมูล
        </button>
      )}

      <div className="flex space-x-4 mt-4">
        {faceImage && (
          <div>
            <p className="text-sm text-gray-400 text-center">ภาพใบหน้า</p>
            <img src={faceImage} alt="ใบหน้า" className="w-32 rounded-md" />
          </div>
        )}
        {idCardImage && (
          <div>
            <p className="text-sm text-gray-400 text-center">ภาพบัตร</p>
            <img src={idCardImage} alt="บัตรประชาชน" className="w-32 rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
}
