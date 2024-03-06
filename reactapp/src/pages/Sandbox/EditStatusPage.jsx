import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const EditStatusPage = ({
  isOpen,
  handleClose,
  editedUser,
  handleInputChange,
  handleSave,
}) => (
  <Dialog open={isOpen} onClose={handleClose}>
    <DialogTitle>Edit User</DialogTitle>
    <DialogContent>
      <TextField
        label="First Name"
        value={editedUser?.name?.first || ""}
        onChange={(e) => handleInputChange("name", { first: e.target.value })}
        fullWidth
      />

      <TextField
        label="Middle Name"
        value={editedUser?.name?.middle || ""}
        onChange={(e) => handleInputChange("name", { middle: e.target.value })}
        fullWidth
      />

      <TextField
        label="User Email"
        value={editedUser?.email || ""}
        onChange={(e) => handleInputChange("email", e.target.value)}
        fullWidth
      />

      <TextField
        label="User Phone"
        value={editedUser?.phone || ""}
        onChange={(e) => handleInputChange("phone", e.target.value)}
        fullWidth
      />
      <TextField
        label="User Country"
        value={editedUser?.address?.country || ""}
        onChange={(e) => handleInputChange("country", e.target.value)}
        fullWidth
      />
      <TextField
        label="User City"
        value={editedUser?.address?.city || ""}
        onChange={(e) => handleInputChange("city", e.target.value)}
        fullWidth
      />
      <TextField
        label="User Street"
        value={editedUser?.address?.street || ""}
        onChange={(e) => handleInputChange("street", e.target.value)}
        fullWidth
      />
      <TextField
        label="User House Number"
        value={editedUser?.address?.houseNumber || ""}
        onChange={(e) => handleInputChange("houseNumber", e.target.value)}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </DialogActions>
  </Dialog>
);

export default EditStatusPage;
