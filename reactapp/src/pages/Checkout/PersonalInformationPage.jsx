// PersonalInformationPage.js
import React from "react";
import { Box, Typography, Divider, Grid, TextField } from "@mui/material";

const PersonalInformationPage = ({
  formData,
  handleInputChange,
  isNextDisabled,
  setActiveTab,
}) => {
  const isFormValid = () => {
    return (
      formData.first &&
      formData.last &&
      formData.email &&
      formData.phone &&
      formData.country &&
      formData.city &&
      formData.street &&
      formData.houseNumber &&
      formData.zip
    );
  };

  const handleNext = () => {
    if (isFormValid() && !isNextDisabled) {
      setActiveTab((prevTab) => prevTab + 1);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Divider style={{ margin: "16px 0" }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="First Name"
            name="first"
            value={formData.first}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Middle Name"
            name="middle"
            value={formData.middle}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Last Name"
            name="last"
            value={formData.last}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="House Number"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="ZIP"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInformationPage;
