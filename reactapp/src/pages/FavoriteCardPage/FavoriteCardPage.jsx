import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, Divider } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import ROUTES from "../../routes/ROUTES";

const FavoriteCardPage = () => {
  const navigate = useNavigate();

  const [likedCards, setLikedCards] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((bigPie) => bigPie.authSlice.userData);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch(); // Create a dispatch function

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchLikedCards = async () => {
      try {
        setLoading(true);
        const userId = userData.id;
        console.log("UserId:", userId); // Log userId
        const dataFromServer = await axios.get("http://localhost:8080/cards");
        console.log("API Response:", dataFromServer.data);
        console.log(userId);
        const cards = dataFromServer.data.filter((card) =>
          card.likes.includes(userId)
        );
        setLikedCards(cards);

        console.log("Liked Cards:", cards);
        setLoading(false);
      } catch (error) {
        setError("Error fetching liked card IDs");
        setLoading(false);
      }
    };

    fetchLikedCards();
  }, [userData]);

  const handleEditCard = (_id) => {
    navigate(`${ROUTES.EDITCARD}/${_id}`);
  };

  const handleDeleteCard = async (_id) => {
    try {
      const config = {
        headers: {
          "x-auth-token": process.env.REACT_APP_API_TOKEN,
        },
      };

      await axios.delete(`http://localhost:8080/cards/${_id}`, config);

      setMyCards((prevCards) => prevCards.filter((card) => card._id !== _id));
    } catch (error) {
      console.error("Error deleting card:", error);
      setError("Error deleting card. Please try again.");
    }
  };

  const handleLikeRemove = (_id) => {
    const updatedLikedCards = likedCards.filter((card) => card._id !== _id);
    setLikedCards(updatedLikedCards);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Typography
        sx={{ fontFamily: "serif", textAlign: "center", p: 5 }}
        variant="h1"
      >
        FAVORITE
        <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
      </Typography>
      <Grid container spacing={2}>
        {likedCards
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((card) => (
            <Grid item key={card._id} xs={12} sm={6} md={4} lg={3}>
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
                alt={card.image && card.image.alt}
                like={true}
                onEditCard={() => handleEditCard(card._id)}
                onToggleFavorite={() => {
                  handleLikeRemove(card._id);
                }}
                onDeleteCard={() => handleDeleteCard(card._id)}
              />
            </Grid>
          ))}
      </Grid>

      <Pagination
        count={Math.ceil(likedCards.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />
    </Container>
  );
};

export default FavoriteCardPage;
