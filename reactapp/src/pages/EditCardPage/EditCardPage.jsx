import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Grid,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ROUTES from "../../routes/ROUTES";

const EditCardPage = () => {
  const [inputsValue, setInputValue] = useState({
    title: "",
    subtitle: "",
    brand: "",
    price: "",
    shipping: "",
    description: "",
    images: [{ url: "", alt: "" }],
  });
  const { id: _id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/cards/${_id}`);
        const cardData = response.data;

        setInputValue({
          title: cardData.title || "",
          subtitle: cardData.subtitle || "",
          price: cardData.price || "",
          brand: cardData.brand || "",
          shipping: cardData.shipping || "",
          description: cardData.description || "",
          images: cardData.images || [{ url: "", alt: "" }],
        });
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();
  }, [_id]);

  const handleInputChange = (e) => {
    setInputValue((currentState) => ({
      ...currentState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleImageChange = (e, index) => {
    const { name, value } = e.target;
    const updatedImages = [...inputsValue.images];
    updatedImages[index][name.split("-")[0]] = value;

    setInputValue((currentState) => ({
      ...currentState,
      images: updatedImages,
    }));
  };

  const handleAddImage = () => {
    if (inputsValue.images.length < 6) {
      setInputValue((currentState) => ({
        ...currentState,
        images: [...currentState.images, { url: "", alt: "" }],
      }));
    } else {
      toast.warn("You can add up to 6 images.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...inputsValue.images];
    updatedImages.splice(index, 1);

    setInputValue((currentState) => ({
      ...currentState,
      images: updatedImages,
    }));
  };

  const handleUpdateChangesClick = async () => {
    try {
      const headers = {
        Authorization: "Bearer ",
      };

      const { data } = await axios.put(
        `http://localhost:8080/cards/${_id}`,
        {
          // rest of your code

          title: inputsValue.title,
          subtitle: inputsValue.subtitle,
          description: inputsValue.description,
          brand: inputsValue.brand,
          price: inputsValue.price,
          shipping: inputsValue.shipping,
          images: inputsValue.images,
        },
        { headers }
      );

      console.log("Data from response", data);

      toast.success("Card has been edited successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate(ROUTES.MYCARDS);
      window.location.reload();
    } catch (err) {
      console.error("Error updating card:", err);

      toast.error(
        "Error updating card. Please fix the mistake and try again.",
        {
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <Container sx={{ padding: "50px" }}>
      <Typography variant="h2" sx={{ mb: 1, padding: "10px", pb: "0px" }}>
        Card - Edit
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, padding: "3px", ml: "7px" }}>
        Put new values in the correct input
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container flexDirection={"column"}>
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={handleInputChange}
          value={inputsValue.title}
          required
        />
        <TextField
          id="subtitle"
          label="SubTitle"
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={handleInputChange}
          value={inputsValue.subtitle}
          required
        />
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={handleInputChange}
          value={inputsValue.description}
          required
        />
        <TextField
          id="price"
          label="price"
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={handleInputChange}
          value={inputsValue.price}
          required
        />
        <TextField
          id="shipping"
          label="shipping"
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={handleInputChange}
          value={inputsValue.shipping}
        />
        <TextField
          id="brand"
          label="brand"
          variant="outlined"
          sx={{ mt: "10px" }}
          onChange={handleInputChange}
          value={inputsValue.brand}
        />
        {inputsValue.images.map((image, index) => (
          <div key={index}>
            <TextField
              name={`url-${index}`}
              label={`URL ${index + 1}`}
              variant="outlined"
              sx={{ mt: "10px" }}
              onChange={(e) => handleImageChange(e, index)}
              value={image.url}
            />
            <TextField
              name={`alt-${index}`}
              label={`Alt ${index + 1}`}
              variant="outlined"
              sx={{ mt: "10px" }}
              onChange={(e) => handleImageChange(e, index)}
              value={image.alt}
            />
            {index > 0 && (
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => handleRemoveImage(index)}
              >
                Remove Image
              </Button>
            )}
          </div>
        ))}
        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleAddImage}>
          Add Image
        </Button>
      </Grid>
      <Grid container spacing={2}>
        <Grid item lg={8} md={8} sm={8} xs>
          <Link to={ROUTES.MYCARDS}>
            <Button
              variant="outlined"
              sx={{ mt: 2, width: "100%", ml: "0%", bgcolor: "lightskyblue" }}
              onClick={handleUpdateChangesClick}
            >
              Update Changes
            </Button>
          </Link>
        </Grid>
        <Grid item xs>
          <Link to={ROUTES.MYCARDS}>
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
              Discard Changes
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditCardPage;
