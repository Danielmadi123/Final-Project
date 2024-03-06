import React from "react";
import {
  Container,
  Grid,
  Typography,
  Divider,
  Button,
  TextField,
  MenuItem, // Import MenuItem from @mui/material
} from "@mui/material";
import { Link } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";

const CardForm = ({
  fields,
  inputsValue,
  errors,
  loading,
  handleInputChange,
  handleSubmit,
  handleAddField,
  handleRemoveField,
}) => {
  const maxImages = 6; // Set the maximum number of images

  return (
    <Container sx={{ padding: "50px" }}>
      <Typography variant="h2" sx={{ mb: 1, padding: "10px", pb: "0px" }}>
        Create - Cards
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, padding: "3px", ml: "7px" }}>
        Put new values in the correct input
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit}>
        <Grid container flexDirection="column">
          {fields.map((field) => (
            <React.Fragment key={field.id}>
              {field.id === "images" ? (
                <div>
                  {inputsValue.images.map((image, index) => (
                    <React.Fragment key={index}>
                      <TextField
                        id={`url-${index}`}
                        label={`URL ${index + 1}`}
                        variant="outlined"
                        sx={{ mt: "10px" }}
                        onChange={(e) => handleInputChange(e, index)}
                        value={image.url}
                        required={field.required}
                        error={Boolean(
                          errors.images && errors.images[index]?.url
                        )}
                      />
                      <TextField
                        id={`alt-${index}`}
                        label={`Alt ${index + 1}`}
                        variant="outlined"
                        sx={{ mt: "10px" }}
                        onChange={(e) => handleInputChange(e, index)}
                        value={image.alt}
                        required={field.required}
                        error={Boolean(
                          errors.images && errors.images[index]?.alt
                        )}
                      />
                      {index > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ mt: 2 }}
                          onClick={() => handleRemoveField(index)}
                        >
                          Remove Image
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                  {inputsValue.images.length < maxImages && (
                    <Button
                      variant="outlined"
                      onClick={handleAddField}
                      sx={{ mt: "10px" }}
                    >
                      Add Image
                    </Button>
                  )}
                </div>
              ) : field.id === "brand" ? (
                <TextField
                  select
                  id={field.id}
                  label={field.label}
                  variant="outlined"
                  sx={{ mt: "10px" }}
                  onChange={(e) => {
                    console.log("Brand Select Change:", e.target.value);
                    handleInputChange(e, null, field.id);
                  }}
                  value={inputsValue[field.id]}
                  required={field.required}
                  error={Boolean(errors[field.id])}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  id={field.id}
                  label={field.label}
                  variant="outlined"
                  sx={{ mt: "10px" }}
                  onChange={(e) => {
                    console.log(`${field.label} Change:`, e.target.value);
                    handleInputChange(e, null, field.id);
                  }}
                  value={inputsValue[field.id]}
                  required={field.required}
                  error={Boolean(errors[field.id])}
                />
              )}
            </React.Fragment>
          ))}
          <Grid container spacing={2}>
            <Grid item lg={8} md={8} sm={8} xs>
              <Button
                type="submit"
                variant="outlined"
                sx={{
                  mt: 2,
                  width: "100%",
                  ml: "0%",
                  bgcolor: "darkblue",
                  color: "white",
                }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Card"}
              </Button>
            </Grid>
            <Grid item xs>
              <Link to={ROUTES.HOME}>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 2,
                    width: "100%",
                    ml: "0%",
                    bgcolor: "navy",
                    color: "gray",
                  }}
                >
                  Discard
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CardForm;
