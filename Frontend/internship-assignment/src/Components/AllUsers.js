import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/users", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          console.error("Error fetching users:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = (user) => {
    const newUserData = {
      email: user.email,
      phone: user.phone,
      name: user.name,
      id: user._id,
    };
    navigate("/updateInfo", {
      state: { user: newUserData, isAdmin: true, isAdminUpdatingUser: true },
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

  return (
    <div className="user-list-container">
      <h2>All Users</h2>
      <div className="user-cards">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-info">
              <p>Email: {user.email}</p>
              <p>Name: {user.name}</p>
              <p>Phone: {user.phone}</p>
              <img className="profile-image" src={user.image} alt="UserImage" />
            </div>
            <div className="action-buttons">
              <button
                className="update-button"
                onClick={() => handleUpdateUser(user)}
              >
                Update User
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
