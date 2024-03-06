import React from "react";
import { TextField, Select, MenuItem } from "@mui/material";

const CardField = ({
  id,
  label,
  value,
  onChange,
  required,
  error,
  helperText,
  options,
}) => {
  return (
    <>
      {id === "brand" ? (
        <Select
          id={id}
          value={value}
          onChange={onChange}
          variant="outlined"
          sx={{ mt: "10px" }}
          required={required}
          error={error}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          id={id}
          label={label}
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={onChange}
          value={value}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    </>
  );
};

export default CardField;
