import React, { useEffect, useState } from "react";
import "./Gallery.css";

function Gallery() {

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


  const fetchGallery = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/media`
      );

      const data = await response.json();

      setMedia(data);

    } catch (error) {

      console.error(
        "Gallery error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchGallery();
  }, []);


  if (loading) {
    return (
      <div className="gallery-page">
        <h2>Loading Gallery...</h2>
      </div>
    );
  }


  return (
    <div className="gallery-page">

      <div className="gallery-header">

        <h1>📸 Ganpati Memories</h1>

        <p>
          Memories shared by our members
        </p>

      </div>


      {media.length === 0 ? (

        <div className="empty-gallery">

          <h2>No memories yet</h2>

          <p>
            Be the first member to upload
            a Ganpati memory.
          </p>

        </div>

      ) : (

        <div className="gallery-grid">

          {media.map((item) => (

            <div
              className="media-card"
              key={item._id}
            >

              {item.mediaType === "image" ? (

                <img
                  src={item.mediaUrl}
                  alt={item.caption || "Ganpati memory"}
                />

              ) : (

                <video
                  src={item.mediaUrl}
                  controls
                />

              )}


              <div className="media-content">

                <h3>
                  {item.uploaderName}
                </h3>

                {item.caption && (
                  <p>
                    {item.caption}
                  </p>
                )}

                <small>
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </small>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Gallery;