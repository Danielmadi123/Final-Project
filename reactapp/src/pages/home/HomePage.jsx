
import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Divider, Button } from "@mui/material";
import CardComponent from "../../components/CardComponent";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import axios from "axios";
import homePageNormalization from "./homePageNormalization";
import { useSelector } from "react-redux";
import useQueryParams from "../../hooks/useQueryParams";
import AsideFilter from "./AsideFilter";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const HomePage = () => {
  const [dataFromServer, setDataFromServer] = useState([]);
  const [initialDataFromServer, setInitialDataFromServer] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((bigPie) => bigPie.authSlice.userData);
  const query = useQueryParams();
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    axios
      .get("/cards")
      .then(({ data }) => {
        if (userData) data = homePageNormalization(data, userData._id);
        setInitialDataFromServer(data);
        setDataFromServer(data);
        setFilteredData(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [userData]);

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);

    const newData = initialDataFromServer.filter((card) => {
      const cardPrice = typeof card.price === 'string' ? parseFloat(card.price.replace(/[^0-9.-]+/g, "")) : parseFloat(card.price);
      
      const meetsPriceCriteria =
        cardPrice >= filters.price.min && cardPrice <= filters.price.max;
  
      const meetsBrandCriteria = !filters.brand || card.brand === filters.brand;
  
      const cardShipping = typeof card.shipping === 'string' ? parseFloat(card.shipping.replace(/[^0-9.-]+/g, "")) : parseFloat(card.shipping);
      let meetsShippingCriteria;
      if (filters.shipping === "Free") {
        meetsShippingCriteria =
          cardShipping === 0 || card.shipping.toLowerCase() === "free";
      } else if (filters.shipping === "0-100") {
        meetsShippingCriteria = cardShipping <= 100;
      } else {
        meetsShippingCriteria =
          !filters.shipping || card.shipping === filters.shipping;
      }
  
      return meetsPriceCriteria && meetsBrandCriteria && meetsShippingCriteria;
    });
  
    setFilteredData(newData);
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

  const handleEditCard = (_id) => {
    navigate(`${ROUTES.EDITCARD}/${_id}`);
  };

  const handleLikeCardClick = (_id, isLiked) => {
    setDataFromServer((dataFromServerCopy) =>
      dataFromServerCopy.map((card) => {
        if (card._id === _id) {
          card.like = isLiked;
          if (isLiked) {
            const likedCards =
              JSON.parse(localStorage.getItem("likedCards")) || [];
            likedCards.push(card);
            localStorage.setItem("likedCards", JSON.stringify(likedCards));
          }
        }
        return card;
      })
    );

    setInitialDataFromServer((initialDataCopy) =>
      initialDataCopy.map((card) => {
        if (card._id === _id) {
          card.like = isLiked;
        }
        return card;
      })
    );
  };

  const handleShowFiltersClick = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={showFilters ? 3 : 12}>
        <Container
          sx={{
            position: "sticky",
            top: "0",
            marginTop: "85px",
            height: "100%",
            visibility: showFilters ? "visible" : "hidden",
            opacity: showFilters ? 1 : 0,
            transition: "visibility 0s, opacity 0.5s linear",
          }}
        >
          {showFilters && <AsideFilter onFilterChange={handleFilterChange} />}
        </Container>
      </Grid>
      <Grid item xs={12} md={showFilters ? 9 : 12}>
        {/* Main Content */}
        <Container
          sx={{
            minHeight: "100vh", 
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontFamily: "serif", textAlign: "center", p: 5 }}
          >
            STORE
            <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleShowFiltersClick}
            sx={{
              display: "block",
              margin: "0 auto",
              marginBottom: "20px",
            }}
          >
            {showFilters ? <CloseIcon /> : <FilterListIcon />}
          </Button>
          <Grid container spacing={2}>
            {filteredData.map((card) => (
              <Grid
                item
                key={card._id}
                xs={12}
                sm={showFilters ? 6 : 4}
                md={showFilters ? 4 : 3}
                lg={showFilters ? 4 : 3}
              >
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
                  like={card.likes}
                  cardNumber={card.cardNumber}
                  onDeleteCard={handleDeleteCard}
                  onEditCard={handleEditCard}
                  handleLikeCardClick={handleLikeCardClick}
                  isAdmin={userData && userData.isAdmin}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default HomePage;
