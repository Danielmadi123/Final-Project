import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  addToCart,
  setItems,
  incrementCartCount,
  selectCartItemsCount,
} from "../store/cartSlice";
import MyCardsPage from "../pages/MyCardsPage/MyCardsPage";
import { toast } from "react-toastify";
import store from "../store/bigPie";

const CardComponent = ({
  _id,
  title,
  subTitle,
  brand,
  price,
  shipping,
  imgs,
  alt,
  like,
  cardNumber,
  onDeleteCard,
  onToggleFavorite,
  onEditCard,
  onAddToCart,
  quantity,
}) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const [isLiked, setIsLiked] = useState(like);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const loggedIn = useSelector((bigPie) => bigPie.authSlice.loggedIn);
  const userData = useSelector((state) => state.authSlice.userData) || {};
  const isAdmin = useSelector((bigPie) => bigPie.authSlice.isAdmin);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = useSelector((state) => state.cart.cartItemsCount);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedLikeStatus = localStorage.getItem(`like_${_id}`);
    if (storedLikeStatus !== null && !like) {
      setIsLiked(JSON.parse(storedLikeStatus));
    }
  }, [_id, isLiked]);

  const handleDeleteCardClick = async () => {
    try {
      setSuccessMessage("Card deleted successfully!");
      setErrorMessage("");
      await onDeleteCard(_id);
    } catch (error) {
      console.error("Error deleting card:", error.message);
      setErrorMessage("Error deleting card. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleClickEditCard = () => {
    if (userData.isAdmin || userData.isBusiness) {
      onEditCard(_id);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const existingCartItem = cartItems.find((item) => item._id === _id);
      const newQuantity = existingCartItem ? existingCartItem.quantity + 1 : 1;

      const response = await axios.post(
        `http://localhost:8080/cart/${_id}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Card added to cart successfully!");
        dispatch(addToCart({ item: response.data }));

        const updatedCartCount = selectCartItemsCount(store.getState());

        localStorage.setItem("cartItemsCount", updatedCartCount.toString());
        toast.success("Item added to cart successfully!");
      } else {
        console.error("Failed to add card to cart.");
        toast.error("Failed to add card to cart.");
      }
    } catch (error) {
      console.error("Error adding card to cart:", error);
      toast.error("Error adding card to cart.");
    }
  };
  const handleLikeCard = async () => {
    setIsLiked(!isLiked);
    if (onToggleFavorite) onToggleFavorite();
    try {
      const response = await axios.patch(
        `http://localhost:8080/cards/${_id}`,
        {
          like: !isLiked,
          shipping,
          brand,
          price,
          bizNumber: cardNumber,
        },
        {
          headers: {
            Authorization: "Bearer YOUR_AUTH_TOKEN",
          },
        }
      );
      console.log("Response after updating like status:", response);
      localStorage.setItem(`like_${_id}`, (!isLiked).toString());

      setIsLiked((prevIsLiked) => !prevIsLiked);
      setSuccessMessage("Like status updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating like status:", error);

      setIsLiked(!isLiked);
      setErrorMessage("Error updating like status. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleCardClick = () => {
    navigate(`/card-details/${_id}`);
  };

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          onClick={handleCardClick}
          sx={{ height: 200 }}
          component="img"
          src={imgs.url}
          alt={imgs.alt}
          onLoad={() => console.log("Image loaded:", imgs.url)}
          onError={() => console.error("Error loading image:", imgs.url)}
        />
      </CardActionArea>
      <CardContent>
        <CardHeader title={title} subheader={subTitle} sx={{ p: 0, mb: 1 }} />
        <Divider />
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            <Typography fontWeight="700" variant="subtitle1" component="span">
              Price:{" "}
            </Typography>
            {price}$ {/* Add the dollar sign before the price */}
          </Typography>
          <Typography variant="body2">
            <Typography fontWeight="700" variant="subtitle1" component="span">
              brand:{" "}
            </Typography>
            {brand}
          </Typography>
          <Typography variant="body2">
            <Typography fontWeight="700" variant="subtitle1" component="span">
              Shipping:{""}
            </Typography>
            {shipping}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            {loggedIn && userData.isAdmin ? (
              <IconButton onClick={handleClickEditCard}>
                <CreateIcon />
              </IconButton>
            ) : loggedIn &&
              userData.isBusiness &&
              currentPage === "/MyCardsPage" ? (
              <IconButton onClick={handleClickEditCard}>
                <CreateIcon />
              </IconButton>
            ) : null}
          </Box>
          <Box>
            {isAdmin ? (
              <IconButton onClick={handleDeleteCardClick}>
                <DeleteIcon />
              </IconButton>
            ) : userData.isBusiness && currentPage === "/MyCardsPage" ? (
              <IconButton onClick={handleDeleteCardClick}>
                <DeleteIcon />
              </IconButton>
            ) : null}

            {loggedIn && (
              <IconButton onClick={handleLikeCard}>
                <FavoriteIcon color={isLiked ? "error" : "action"} />
              </IconButton>
            )}
            {loggedIn && (
              <IconButton
                color="primary"
                aria-label="add to shopping cart"
                onClick={handleAddToCart}
              >
                <AddShoppingCartIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
      {successMessage && (
        <Typography style={{ color: "green" }}>{successMessage}</Typography>
      )}
      {errorMessage && (
        <Typography style={{ color: "red" }}>{errorMessage}</Typography>
      )}
    </Card>
  );
};

CardComponent.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  brand: PropTypes.string,
  price: PropTypes.string,
  shipping: PropTypes.string,
  imgs: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  }),
  onAddToCart: PropTypes.func.isRequired,
  like: PropTypes.bool,
  cardNumber: PropTypes.number,
  onDeleteCard: PropTypes.func.isRequired,
  onEditCard: PropTypes.func,
};

CardComponent.defaultProps = {
  imgs: "https://www.livemint.com/lm-img/img/2023/08/14/1600x900/garena_free_fire_max_1688877791610_1691982307589.jpg",
  alt: "running",
};

export default CardComponent;
