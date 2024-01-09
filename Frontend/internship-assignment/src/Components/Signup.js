import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadImageToFirebase } from "../config/uploadFunction";
const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    password: "",
    role: "user",
    image: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [image, setImage] = useState({});

  const [heading, setHeading] = useState("SignUp");
  let { state } = useLocation();

  useEffect(() => {
    if (state) {
      setHeading("Create Admin");
      setFormData({ ...formData, role: "admin" });
    }
  }, []);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    console.log(imageFile);
    setImage({ image: imageFile });
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const validateForm = async (e) => {
    e.preventDefault();
    const { email, phone } = formData;

    if (!email && !phone) {
      setErrorMessage(
        "Please provide at least one of the following: Email or Phone"
      );
      return;
    }
    try {
      if (image.image) {
        const imageUrl = await uploadImageToFirebase(image.image);
        formData.image = imageUrl;
      }

      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful");
        setFormData({
          email: "",
          phone: "",
          name: "",
          password: "",
        });
        if (state == null) {
          navigate("/login");
        }
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signupHeading">{heading}</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <label htmlFor="profileImage">Profile Image:</label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="action-buttons">
          <button type="button" onClick={validateForm}>
            {heading}
          </button>
        </div>
        {state != null ? (
          <div></div>
        ) : (
          <div>
            <button
              className="update-button"
              type="button"
              onClick={redirectToLogin}
            >
              Login?
            </button>
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Signup;
