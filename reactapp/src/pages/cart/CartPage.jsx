import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Divider, Button } from "@mui/material";
import CartItem from "../cart/CartItem";
import {
  setItems,
  setSavedForLaterItems,
  removeFromSavedForLater,
} from "../../store/cartSlice";
import { useNavigate, navigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const CartItems = useSelector((state) => state.cart.items) ?? [];
  const savedForLaterItems =
    useSelector((state) => state.cart.savedForLaterItems) || [];
  const navigate = useNavigate();
  useEffect(() => {
    fetchCart();
  }, []);
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.length > 0) {
        const fetchedCart = response.data[0];
        setCart(fetchedCart);
        dispatch(setItems(fetchedCart.items || []));
        dispatch(setSavedForLaterItems(fetchedCart.savedForLaterItems || []));
      } else {
        setCart({ items: [], savedForLaterItems: [] });
        dispatch(setItems([]));
        dispatch(setSavedForLaterItems([]));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setErrorMessage("Failed to fetch cart: " + error.message);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchSavedForLaterItems();
  }, []);

  const fetchSavedForLaterItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/cart/savedForLater",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.length > 0) {
        dispatch(setSavedForLaterItems(response.data));
      } else {
        dispatch(setSavedForLaterItems([]));
      }
    } catch (error) {
      console.error("Error fetching saved for later items:", error);
      setErrorMessage("Failed to fetch saved for later items.");
    }
  };

  const emptyCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/cart/${cart?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart((currentCart) => ({
        ...currentCart,
        items: [],
      }));

      setErrorMessage("");
    } catch (error) {
      console.error("Error emptying cart:", error);
      setErrorMessage("Failed to empty cart.");
    }
  };

  const handleDeleteCartItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/cart/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((currentCart) => ({
        ...currentCart,
        items: currentCart.items.filter((item) => item._id !== itemId),
      }));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setErrorMessage("Failed to delete cart item.");
    }
  };

const onUpdateCartItem = async (_id, newQuantity) => {
  try {
    if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
      throw new Error("Invalid quantity provided");
    }

    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:8080/cart/item/${_id}`,
      { newQuantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      dispatch(setItems(response.data.items)); 
    } else {
      setErrorMessage("Failed to update cart item.");
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    setErrorMessage(error.message || "Failed to update cart item.");
  }
};

  const saveItemForLater = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/cart/item/${itemId}/saveForLater`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        dispatch(setItems(response.data.items));
        dispatch(setSavedForLaterItems(response.data.savedForLaterItems));
      } else {
        setErrorMessage("Failed to save item for later.");
      }
    } catch (error) {
      console.error("Error saving item for later:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to save item for later."
      );
    }
  };

  const handleMoveToCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/cart/item/${itemId}/moveToCart`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        dispatch(setItems(response.data.items));
        dispatch(setSavedForLaterItems(response.data.savedForLaterItems));
      } else {
        setErrorMessage("Failed to move item to cart.");
      }
    } catch (error) {
      console.error("Error moving item to cart:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to move item to cart."
      );
    }
  };

  const handleEmptySavedForLater = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedItemIds = savedForLaterItems.map((item) => item._id);
      await Promise.all(
        savedItemIds.map((itemId) =>
          axios.delete(`http://localhost:8080/cart/savedItem/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      fetchCart();
    } catch (error) {
      console.error("Error removing saved items:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to remove items from saved for later."
      );
    }
  };

  const handleUpdateCartItem = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/cart/item/${itemId}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        dispatch(setItems(response.data.items));
      } else {
        setErrorMessage("Failed to update cart item.");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to update cart item."
      );
    }
  };

  const deleteSavedItemById = async (itemId, token) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/cart/savedItem/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to delete saved item: ${response.statusText}`);
      }

      console.log("Item deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting saved item:", error);
      throw error;
    }
  };

  const totalCartPrice = CartItems.reduce((total, item) => {
    const price = item && item.price ? parseFloat(item.price) : 0;
    return total + price * (item.quantity || 1);
  }, 0);
  return (
    <Container>
      <Typography
        sx={{ fontFamily: "serif", textAlign: "center", py: 5 }}
        variant="h1"
      >
        My Cart
        <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
      </Typography>

      {cart && cart.items.length > 0 ? (
        <div>
          {CartItems.map((item) => (
            <CartItem
              key={item._id}
              _id={item._id}
              cardId={item.cardId}
              title={item.title}
              price={item.price ? item.price.toString() : "N/A"}
              shipping={item.shipping}
              quantity={item.quantity}
              imgs={{
                url: item.images?.length > 0 ? item.images[0].url : "",
                alt: item.images?.length > 0 ? item.images[0].alt : "",
              }}
              onDeleteCartItem={() => handleDeleteCartItem(item._id)}
              onUpdateCartItem={onUpdateCartItem}
              onSaveForLater={saveItemForLater}
            />
          ))}
          <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
            Total Price: $
            {isNaN(totalCartPrice) ? "0.00" : totalCartPrice.toFixed(2)}
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              py: 2,
            }}
          >
            <Button
              variant="contained"
              className="cart__btn-empty"
              onClick={emptyCart}
            >
              Empty cart
            </Button>
            <Button
              variant="contained"
              className="cart__btn-checkout"
              onClick={() =>
                navigate(ROUTES.CHECKOUTPAGE, {
                  state: {
                    CartItems: CartItems,
                    totalCartPrice: totalCartPrice,
                  },
                })
              }
            >
              Checkout
            </Button>
          </div>
        </div>
      ) : (
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Your cart is empty.
        </Typography>
      )}

      <div>
        <Typography
          sx={{ fontFamily: "serif", textAlign: "center", py: 5 }}
          variant="h2"
        >
          SAVED FOR LATER
          <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
        </Typography>
        {savedForLaterItems.length > 0 ? (
          savedForLaterItems.map((item) => (
            <CartItem
              key={item._id}
              _id={item._id}
              cardId={item.cardId}
              title={item.title}
              price={item.price ? item.price.toString() : "N/A"}
              shipping={item.shipping}
              quantity={item.quantity}
              imgs={{
                url: item.images?.length > 0 ? item.images[0].url : "",
                alt: item.images?.length > 0 ? item.images[0].alt : "",
              }}
              onDeleteCartItem={() => deleteSavedItemById(item._id)}
              onUpdateCartItem={handleUpdateCartItem}
              onSaveForLater={() => saveItemForLater(item._id)}
              onMoveToCart={() => handleMoveToCart(item._id)}
              isSavedForLater={true}
            />
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            No items saved for later.
          </Typography>
        )}
        <Button
          variant="contained"
          className="cart__btn-empty"
          onClick={handleEmptySavedForLater}
        >
          Empty Saved Items
        </Button>
      </div>

      {errorMessage && <Typography variant="h5">{errorMessage}</Typography>}
    </Container>
  );
};

export default CartPage;
