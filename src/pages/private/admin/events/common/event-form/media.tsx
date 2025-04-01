import { Upload } from "antd";
import { EventFormStepProps } from ".";

const Media = ({
  // currentStep,
  // setCurrentStep,
  selectedMediaFiles,
  setSelectedMediaFiles,
  eventData,
  setEventData,
}: EventFormStepProps) => {

  const onSelectedMediaRemove = (index: number) => {
    const existingSelectedMediaFiles = [...selectedMediaFiles];
    const newSelectedMediaFiles = existingSelectedMediaFiles.filter(
      (_, i) => i !== index
    );
    setSelectedMediaFiles(newSelectedMediaFiles);
  };

  const onAlreadyUploadedMediaRemove = (index: number) => {

    const existingMediaFiles = [...(eventData.images || [])];

    const newMediaFiles = existingMediaFiles.filter((_,i) => i !== index);
    setEventData({...eventData, images: newMediaFiles });
  }

  return (
    <div>
      <Upload
        listType="picture-card"
        beforeUpload={async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "eventopia_upload_preset");

          try {
            const response = await fetch(
              "https://api.cloudinary.com/v1_1/dbrsr7s4p/image/upload",
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            if (data.secure_url) {
              setSelectedMediaFiles((prev: any) => [...prev, data.secure_url]);
            }
          } catch (error) {
            console.error("Upload Failed! : ", error);
            alert("File upload failed. Please try again!");
          }
          return false;
        }}
        multiple
        showUploadList={false}
      >
        <span className="text-gray-500 text-xs">Click here to Upload!</span>
      </Upload>
      <div className="flex flex-wrap gap-5 !mt-5">
        {selectedMediaFiles.map((file: string, index: number) => (
          <div
            className="border !p-3 border-solid border-gray-400 flex flex-col gap-5"
            key={index}
          >
            <img src={file} alt="media" className="w-40 h-40" />
            <span
              className="underline text-sm text-center cursor-pointer"
              onClick={() => onSelectedMediaRemove(index)}
            >
              Remove
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-5 !mt-5">
        {(eventData.images || []).map((url: any, index: number) => (
          <div
            className="border !p-3 border-solid border-gray-400 flex flex-col gap-5"
            key={url}
          >
            <img src={url} alt="media" className="w-40 h-40" />
            <span
              className="underline text-sm text-center cursor-pointer"
              onClick={() => onAlreadyUploadedMediaRemove(index)}
            >
              Remove
            </span>
          </div>
        ))}
      </div>

      {/* <div className="flex justify-between col-span-3">
        <Button onClick={() => setCurrentStep(currentStep - 1)}> Back </Button>
        <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
       
          Next
        </Button>
      </div> */}
    </div>
  );
};

export default Media;
