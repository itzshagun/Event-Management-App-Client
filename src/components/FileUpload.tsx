import React, { useState } from "react";
import axios from "axios";

interface FileUploadProps {
  onUpload?: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<{ fileUrl: string }>("http://localhost:5000/api/upload", formData);
      setFileUrl(response.data.fileUrl);
      setLoading(false);

      if (onUpload) {
        onUpload(response.data.fileUrl);
      }
    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <div>
          <h4>Uploaded File:</h4>
          <img src={fileUrl} alt="Uploaded" style={{ width: "200px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
