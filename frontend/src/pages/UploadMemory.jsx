import React, { useState } from "react";
import "./UploadMemory.css";

function UploadMemory() {
  const [formData, setFormData] = useState({
    uploaderName: "",
    caption: "",
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.uploaderName.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!file) {
      setMessage("Please select a photo or video.");
      return;
    }

    const data = new FormData();

    data.append("uploaderName", formData.uploaderName);
    data.append("caption", formData.caption);
    data.append("media", file);

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/media`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Upload failed"
        );
      }

      setMessage(
        "✅ Memory uploaded successfully! It will appear in Gallery after admin approval."
      );

      setFormData({
        uploaderName: "",
        caption: "",
      });

      setFile(null);

      document.getElementById("mediaFile").value = "";

    } catch (error) {
      setMessage(`❌ ${error.message}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      <div className="upload-card">

        <h1>📸 Upload Memory</h1>

        <p>
          Share your Ganpati memories with
          Jay Bhagvan Ganesh Mitra Mandal.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Your Name</label>

          <input
            type="text"
            name="uploaderName"
            placeholder="Enter your name"
            value={formData.uploaderName}
            onChange={handleChange}
          />


          <label>Caption</label>

          <textarea
            name="caption"
            placeholder="Write something about this memory..."
            value={formData.caption}
            onChange={handleChange}
          />


          <label>Photo / Video</label>

          <input
            id="mediaFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
          />


          <p className="file-info">
            JPG, PNG, WEBP, MP4, WEBM or MOV
            <br />
            Maximum size: 50 MB
          </p>


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Memory"}
          </button>

        </form>


        {message && (
          <div className="upload-message">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default UploadMemory;