import React from "react";
import { Box, Typography, Divider, Grid, TextField } from "@mui/material";

const CardInformationPage = ({ formData, handleInputChange }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Billing Information
      </Typography>
      <Divider style={{ margin: "16px 0" }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Card Number"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Card Holder"
            name="CardHolder"
            value={formData.CardHolder}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardInformationPage;
