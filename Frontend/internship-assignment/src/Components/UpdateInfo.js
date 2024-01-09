import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { uploadImageToFirebase } from "../config/uploadFunction";
import { useNavigate } from "react-router-dom";

const UpdateInfo = () => {
  let { state } = useLocation();
  const [updatedUser, setUpdatedUser] = useState(state.user || {});
  const [image, setImage] = useState({});
  const navigate = useNavigate();

  console.log(updatedUser);
  const handleUpdate = async () => {
    try {
      if (image.image) {
        const imageUrl = await uploadImageToFirebase(image.image);
        // setUpdatedUser({ ...updatedUser, image: imageUrl });
        updatedUser.image = imageUrl;
      }
      // const isAdmin = state.isAdmin;
      const updatedUserCopy = { ...updatedUser };

      if (state.isAdminUpdatingUser) {
        updatedUserCopy.userId = updatedUser.id;
      }
      const response = await fetch("/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserCopy),
        credentials: "include",
      });

      if (response.ok) {
        console.log("User information updated successfully");
        navigate("/profile");
      } else {
        const data = await response.json();
        console.error("Error updating user information:", data.error);
        alert("Error in Updation");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Error in Updation");
    }
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    // console.log(imageFile);
    setImage({ image: imageFile });
  };

  const generateForm = () => {
    if (state.isAdmin) {
      return Object.keys(updatedUser).map(
        (field) =>
          // console.log(field)
          field !== "id" && (
            <div key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={updatedUser[field]}
                onChange={handleChange}
              />
            </div>
          )
      );
    } else {
      return Object.keys(updatedUser).map(
        (field) =>
          // console.log(field)
          field !== "id" && (
            <div key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              <input
                type={field}
                id={field}
                name={field}
                value={updatedUser[field]}
                onChange={handleChange}
                disabled={field === "email" || field === "phone"}
              />
            </div>
          )
      );
    }
  };

  return (
    <div>
      <h2>Update User Information</h2>
      <form>
        {generateForm()}
        <label htmlFor="profileImage">Profile Image:</label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="button" onClick={handleUpdate}>
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateInfo;
