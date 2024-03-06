import React, { Fragment, useEffect, useState } from "react";
import { Typography, Divider, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import UserTable from "./UserTable";
// Update the import statement in SandboxPage.jsx
import EditStatusPage from "./EditStatusPage";

const updateUserProfileServer = (userId, updatedData) => {
  console.log(
    `Updating user profile on the server for user ID ${userId}`,
    updatedData
  );
};

const SandboxPage = () => {
  const user = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await axios.get("users");
        setUsers(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAllUsers();
  }, []);

  const updateUserProfile = (userId, updatedData) => {
    dispatch({ type: "UPDATE_USER_PROFILE", userId, updatedData });
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/users/${userId}`);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const changeUserStatus = async (userId, isBusiness) => {
    try {
      const data = { isBusiness };
      await axios.patch(`http://localhost:8080/users/${userId}`, data);
      const updatedUsers = users.map((user) => {
        if (user._id === userId) {
          return { ...user, isBusiness };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating user status:", error.response);
    }
  };

  const makeRegularUser = (userId) => {
    changeUserStatus(userId, false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };


  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditDialogSave = async () => {
    try {
      if (editedUser) {
        await axios.put(
          `http://localhost:8080/users/${editedUser._id}`,
          editedUser
        );
      } else {
        console.error("Edited user is null");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      handleEditDialogClose();
    }
  };

  const handleSave = () => {
    handleEditDialogSave();
    updateUserProfileServer(editedUser._id, editedUser);
    setEditedUser(null);
  };

  return (
    <Fragment>
      <Typography
        sx={{ fontFamily: "serif", textAlign: "center", py: 5 }}
        variant="h1"
      >
        SANDBOX
        <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
      </Typography>

      {user.isAuthenticated && (
        <div>
          <Button onClick={() => updateUserProfile(user.id, {})}>
            Update Profile
          </Button>
        </div>
      )}

      {user.isAdmin && (
        <UserTable
          users={users}
          handleEditUserClick={handleEditUserClick}
          deleteUser={deleteUser}
          changeUserStatus={changeUserStatus}
          makeRegularUser={makeRegularUser}
        />
      )}

      <EditStatusPage
        isOpen={isEditDialogOpen}
        handleClose={handleEditDialogClose}
        editedUser={editedUser}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />
    </Fragment>
  );
};

export default SandboxPage;
