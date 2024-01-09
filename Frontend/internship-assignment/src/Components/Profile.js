import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/profile", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          console.log(data);
        } else {
          console.error("Error fetching profile data:", response);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);
  useEffect(() => {
    const checkAdminStatus = () => {
      console.log(user.user);
      if (user.role === "admin") {
        console.log("admin");
        setIsAdmin(true);
      }
    };
    checkAdminStatus();
  }, [user]);

  const updateProfile = () => {
    console.log(user, user._id);
    const newUserData = {
      email: user.email,
      phone: user.phone,
      name: user.name,
      id: user._id,
    };
    navigate("/updateInfo", {
      state: {
        user: newUserData,
        isAdmin: isAdmin,
        isAdminUpdatingUser: false,
      },
    });
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/deleteUser/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("User deleted successfully");
      } else {
        const data = await response.json();
        console.error("Error deleting user:", data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed:", response);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const renderAdminButtons = () => {
    if (isAdmin) {
      return (
        <div>
          <button
            className="createAdminButton"
            type="button"
            onClick={createAdmin}
          >
            Create Admin
          </button>
          <button type="button" onClick={viewAllUsers}>
            View All Users
          </button>
        </div>
      );
    }
    return null;
  };

  const createAdmin = () => {
    navigate("/signup", { state: { user: "admin" } });
  };

  const viewAllUsers = () => {
    navigate("/allUsers");
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-section">
        <p className="profile-info">Welcome, {user.name}!</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <img className="profile-image" src={user.image} alt="UserImage" />
      </div>
      <div className="action-buttons">
        <button className="update-button" type="button" onClick={updateProfile}>
          Update Profile
        </button>
      </div>
      <div className="action-buttons">
        <button className="logout-button" type="button" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="delete-button"
          onClick={() => handleDeleteUser(user._id)}
        >
          Delete User
        </button>
      </div>
      {renderAdminButtons()}
    </div>
  );
};

export default Profile;
