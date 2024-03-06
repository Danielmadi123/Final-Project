import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import axios from "axios";
import { useSelector } from "react-redux";
import { Container, Grid, Button, Typography, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";

const MyCardsPage = () => {
  const [myUserCards, setMyUserCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const userData = useSelector((state) => state.authSlice.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCards = async () => {
      try {
        setLoading(true);

        if (!userData) {
          console.error("User data is undefined");
          setLoading(false);
          return;
        }

        const userId = userData._id;
        const config = {
          headers: {
            bearer: process.env.REACT_APP_API_TOKEN,
          },
        };

        const response = await axios.get(
          `http://localhost:8080/cards/my-cards`,
          config
        );

        const userCards = response.data.filter(
          (card) => card.user_id === userId
        );
        setMyUserCards(userCards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user's cards:", error);
        setError("Error fetching user's cards. Please try again.");
        setLoading(false);
      }
    };

    fetchMyCards();
  }, [userData, location.pathname]);

  const handleEditCard = (_id) => {
    navigate(`${ROUTES.EDITCARD}/${_id}`);
  };

  const handleDeleteCard = async (_id) => {
    try {
      const config = {
        headers: {
          bearer: process.env.REACT_APP_API_TOKEN,
        },
      };

      await axios.delete(`http://localhost:8080/cards/${_id}`, config);

      setMyUserCards((prevCards) =>
        prevCards.filter((card) => card._id !== _id)
      );
    } catch (error) {
      console.error("Error deleting card:", error);
      setError("Error deleting card. Please try again.");
    }
  };

  const handleLikeChange = (_id, newLikeStatus) => {
    setMyUserCards((prevCards) =>
      prevCards.map((card) =>
        card._id === _id ? { ...card, like: newLikeStatus } : card
      )
    );
  };

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography
        sx={{ fontFamily: "serif", textAlign: "center", py: 5 }}
        variant="h1"
      >
        MY ITEMS
        <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
      </Typography>
      <Button
        variant="outlined"
        sx={{ mt: 3, bgcolor: "green", color: "white" }}
        onClick={() => {
          if (userData && (userData.isBusiness || userData.isAdmin)) {
            navigate(ROUTES.CREATECARD);
          } else {
            console.log("Only business users or admins can create cards.");
          }
        }}
      >
        Create Item
      </Button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {myUserCards.length === 0 ? (
          <Grid item>
            <div>No cards found.</div>
          </Grid>
        ) : (
          myUserCards.map(
            ({
              _id,
              title,
              subtitle,
              brand,
              price,
              shipping,
              images,
              like,
              alt,
            }) => (
              <Grid item key={_id} xs={12} sm={6} md={4} lg={3}>
                <CardComponent
                  _id={_id}
                  title={title}
                  subTitle={subtitle}
                  brand={brand}
                  price={price}
                  shipping={shipping}
                  imgs={{
                    url: images.length > 0 ? images[0].url : "",
                    alt: images.length > 0 ? images[0].alt : "",
                  }}
                  like={like}
                  onDeleteCard={() => handleDeleteCard(_id)}
                  onEditCard={() => handleEditCard(_id)}
                  handleLikeCardClick={(newLikeStatus) =>
                    handleLikeChange(_id, newLikeStatus)
                  }
                />
              </Grid>
            )
          )
        )}
      </Grid>
    </Container>
  );
};

export default MyCardsPage;
