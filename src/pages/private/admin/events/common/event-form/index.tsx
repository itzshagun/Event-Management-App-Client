import { Form, message, Steps, Button } from "antd";
import General from "./general";
import Media from "./media";
import LocationAndDate from "./location-and-date";
import Tickets from "./tickets";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export interface EventFormStepProps {
  eventData: any;
  setEventData: any;
  currentStep: number;
  setCurrentStep: any;
  selectedMediaFiles?: any;
  setSelectedMediaFiles?: any;
  loading?: boolean;
  onFinish?: any;
}

const EventForm = ({
  initialData = {},
  type = "create",
}: {
  initialData?: any;
  type?: "create" | "edit";
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [eventData, setEventData] = useState<any>(initialData || {});
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params: any = useParams();

  useEffect(() => {
    if (initialData && initialData._id) {
      setEventData(initialData);
      console.log("✅ Loaded Event Data:", initialData);
    }
  }, [initialData]);

  // 🔥 Upload Image to Cloudinary & Return URL
  const uploadFileToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "eventopia_upload_preset"); // Cloudinary preset
    formData.append("cloud_name", "your_cloudinary_name");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dbrsr7s4p/image/upload`,
        formData
      );

      console.log("✅ Uploaded Image URL:", response.data.secure_url); // Debugging log
      return response.data.secure_url;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      message.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  const onFinish = async () => {
    try {
      setLoading(true);

      // 🔥 Upload all selected images and get their URLs
      const uploadedUrls = await Promise.all(
        selectedMediaFiles.map(async (file) => {
          return await uploadFileToCloudinary(file);
        })
      );

      // 🔥 Remove failed uploads (null values)
      const validUrls = uploadedUrls.filter((url) => url !== null);

      console.log("✅ Final Uploaded Image URLs:", validUrls);

      // 🔥 Append uploaded URLs to `eventData.images`
      eventData.images = [...(eventData?.images || []), ...validUrls];

      const token = localStorage.getItem("token");

      let response;
      if (type === "edit") {
        console.log("🛠 Updating existing event...");
        response = await axios.put(
          `/api/events/edit-event/${params.id}`,
          eventData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.log("🆕 Creating a new event...");
        response = await axios.post(
          `/api/events/create-event`,
          eventData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data) {
        message.success(` Event ${type === "edit" ? "Updated" : "Created"} Successfully!`);
        navigate("/admin/events");
      }
    } catch (error: any) {
      console.error("❌ Error saving event:", error.response?.data || error.message);
      message.error(error.response?.data?.message || "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  const commonProps = {
    eventData,
    setEventData,
    currentStep,
    setCurrentStep,
    selectedMediaFiles,
    setSelectedMediaFiles,
    loading,
    setLoading,
    onFinish,
  };

  const stepsData = [
    { name: "General", component: <General {...commonProps} /> },
    { name: "Location And Date", component: <LocationAndDate {...commonProps} /> },
    { name: "Media", component: <Media {...commonProps} /> },
    { name: "Tickets", component: <Tickets {...commonProps} /> },
  ];

  return (
    <Form layout="vertical">
      <Steps current={currentStep} onChange={(step) => setCurrentStep(step)}>
        {stepsData.map((step, index) => (
          <Steps.Step key={index} title={step.name} disabled={index > currentStep} />
        ))}
      </Steps>

      <div className="!mt-5">{stepsData[currentStep].component}</div>

      <div className={`flex !mt-5 ${currentStep === 0 ? "justify-end" : "justify-between"}`}>
        {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>}

        {currentStep < stepsData.length - 1 && (
          <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </Button>
        )}

        {currentStep === stepsData.length - 1 && (
          <Button type="primary" onClick={onFinish} loading={loading}>
            Save & Finish
          </Button>
        )}
      </div>
    </Form>
  );
};

export default EventForm;
