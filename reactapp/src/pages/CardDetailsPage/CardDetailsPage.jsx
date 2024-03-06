import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importing useNavigate instead of useHistory
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import axios from "axios";
import CardComponent from "../../components/CardComponent";

const CardDetailsPage = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [relatedCards, setRelatedCards] = useState([]);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/cards/${cardId}`
        );

        console.log("Card Details Response:", response);

        if (response.data) {
          console.log("Card Details Data:", response.data);
          setCardDetails(response.data);

          if (response.data.images && response.data.images.length > 0) {
            setSelectedImage(response.data.images[0]);
          }

          const brand = response.data.brand;
          const relatedResponse = await axios.get(
            `http://localhost:8080/cards?brand=${encodeURIComponent(
              brand
            )}&limit=6&exclude=${cardId}`
          );
          if (relatedResponse.data) {
            console.log("Related Cards Data:", relatedResponse.data);
            setRelatedCards(relatedResponse.data);
          }
        } else {
          console.error("Invalid response structure. Please check the API.");
          setError("Invalid response structure. Please check the API.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching card details:", error);
        setError("Error fetching card details. Please try again.");
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [cardId]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    console.log("Selected Image:", selectedImage);
  }, [selectedImage]);

  const handleCardClick = (id) => {
    navigate(`/card-details/${id}`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography style={{ color: "red" }}>{error}</Typography>;
  }

  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            {cardDetails &&
            cardDetails.images &&
            cardDetails.images.length > 0 ? (
              <>
                <CardMedia
                  component="img"
                  src={selectedImage.url}
                  alt={selectedImage.alt || "No Alt Text"}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                    marginBottom: 10,
                  }}
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.target.src = "path/to/fallback-image.jpg";
                  }}
                />
                <Grid container spacing={1}>
                  {cardDetails.images.map((image, index) => (
                    <Grid item key={index}>
                      <Button onClick={() => handleThumbnailClick(image)}>
                        <CardMedia
                          component="img"
                          src={image.url}
                          alt={image.alt || "No Alt Text"}
                          style={{
                            height: 60,
                            width: 60,
                            objectFit: "cover",
                          }}
                        />
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Typography>No Images Available</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <CardContent>
              <CardHeader
                title={cardDetails?.title || "No Title"}
                subheader={cardDetails?.subtitle || "No Subtitle"}
                sx={{ p: 0, mb: 1 }}
              />
              <Divider />
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <Typography
                    fontWeight="700"
                    variant="subtitle1"
                    component="span"
                  >
                    Description: {cardDetails?.description || "No Description"}
                  </Typography>
                </Typography>
                <Typography variant="body2">
                  <Typography
                    fontWeight="700"
                    variant="subtitle1"
                    component="span"
                  >
                    Price: {cardDetails?.price || "No Price"}$
                  </Typography>
                </Typography>

                <Typography variant="body2">
                  <Typography
                    fontWeight="700"
                    variant="subtitle1"
                    component="span"
                  >
                    Shipping: {cardDetails?.shipping || "No Shipping"}
                  </Typography>
                </Typography>

                <Typography variant="body2">
                  <Typography
                    fontWeight="700"
                    variant="subtitle1"
                    component="span"
                  >
                    Brand: {cardDetails?.brand || "Brand"}
                  </Typography>
                </Typography>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      {/* Related Cards */}
      {relatedCards.length > 0 && (
        <div>
          <Typography variant="h5" gutterBottom>
            Related Cards
          </Typography>
          <Grid container spacing={2}>
            {relatedCards.slice(0, 6).map((card) => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <CardComponent
                  _id={card._id}
                  title={card.title}
                  subTitle={card.subtitle}
                  brand={card.brand}
                  price={card.price}
                  shipping={card.shipping}
                  imgs={{
                    url: card.images.length > 0 ? card.images[0].url : "",
                    alt: card.images.length > 0 ? card.images[0].alt : "",
                  }}
                  onClick={() => handleCardClick(card._id)}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default CardDetailsPage;
