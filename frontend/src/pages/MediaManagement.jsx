import React, { useEffect, useState } from "react";

function MediaManagement() {

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


  const getHeaders = () => ({
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  });


  const fetchMedia = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/media/admin`,
        {
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      setMedia(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchMedia();
  }, []);


  const updateStatus = async (
    id,
    status
  ) => {

    try {

      await fetch(
        `${API_URL}/api/media/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      fetchMedia();

    } catch (error) {

      console.error(error);

    }
  };


  const deleteMedia = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this media?"
      );

    if (!confirmDelete) return;


    try {

      await fetch(
        `${API_URL}/api/media/${id}`,
        {
          method: "DELETE",

          headers: getHeaders(),
        }
      );

      fetchMedia();

    } catch (error) {

      console.error(error);

    }
  };


  if (loading) {
    return <h2>Loading...</h2>;
  }


  return (
    <div style={{ padding: "30px" }}>

      <h1>Media Management</h1>

      {media.length === 0 && (
        <p>No uploaded memories.</p>
      )}


      {media.map((item) => (

        <div
          key={item._id}
          style={{
            margin: "20px 0",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >

          <h3>
            {item.uploaderName}
          </h3>

          <p>
            {item.caption}
          </p>


          {item.mediaType === "image" ? (

            <img
              src={item.mediaUrl}
              alt={item.caption}
              style={{
                width: "300px",
                maxHeight: "250px",
                objectFit: "cover",
              }}
            />

          ) : (

            <video
              src={item.mediaUrl}
              controls
              style={{
                width: "300px",
              }}
            />

          )}


          <p>
            Status:
            <strong>
              {" "}{item.status}
            </strong>
          </p>


          {item.status !== "Approved" && (

            <button
              onClick={() =>
                updateStatus(
                  item._id,
                  "Approved"
                )
              }
            >
              Approve
            </button>

          )}


          {item.status !== "Rejected" && (

            <button
              onClick={() =>
                updateStatus(
                  item._id,
                  "Rejected"
                )
              }
            >
              Reject
            </button>

          )}


          <button
            onClick={() =>
              deleteMedia(item._id)
            }
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default MediaManagement;