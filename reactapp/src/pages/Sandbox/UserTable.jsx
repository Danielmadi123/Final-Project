import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const UserTable = ({
  users,
  handleEditUserClick,
  deleteUser,
  changeUserStatus,
  makeRegularUser,
}) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User ID</TableCell>
          <TableCell>User Name</TableCell>
          <TableCell>User Phone</TableCell>
          <TableCell>User Type</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((userData) => (
          <TableRow key={userData._id}>
            <TableCell>{userData._id}</TableCell>
            <TableCell>{userData.name.first}</TableCell>
            <TableCell>{userData.phone}</TableCell>
            <TableCell>
              {userData.isAdmin
                ? "Admin"
                : userData.isBusiness
                ? "Business"
                : "Regular"}
            </TableCell>
            <TableCell>
              <Button
                onClick={() => handleEditUserClick(userData)}
                style={{ color: "blue" }}
              >
                Edit
              </Button>
              <Button
                onClick={() => deleteUser(userData._id)}
                style={{ color: "red" }}
              >
                Delete
              </Button>
              {!userData.isBusiness && (
                <Button onClick={() => changeUserStatus(userData._id, true)}>
                  Make Business
                </Button>
              )}
              {userData.isBusiness && (
                <Button onClick={() => makeRegularUser(userData._id)}>
                  Make Regular User
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default UserTable;
