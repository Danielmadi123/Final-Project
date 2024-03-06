import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

const CartItemsPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("User is not logged in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("http://localhost:8080/cart", config);

      if (response.data && response.data.length > 0 && response.data[0].items) {
        setCartItems(response.data[0].items); 
        const totalPrice = response.data[0].items.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        setTotalCartPrice(totalPrice);
      } else {
        setErrorMessage("No items found in the cart.");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setErrorMessage("Failed to fetch cart items.");
    }
  };
  return (
    <Box>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item._id} style={{ marginBottom: "20px" }}>
            <Card style={{ marginBottom: "15px" }}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                {item.images && item.images.length > 0 ? (
                  item.images.map((image) => (
                    <img
                      key={image._id}
                      src={image.url}
                      alt={image.alt || "Item image"}
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "20px",
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2">No image available</Typography>
                )}
                <Typography variant="h6">
                  {item.name || "No name available"}
                </Typography>
                <Typography variant="body1">
                  Brand: {item.brand || "No brand available"}
                </Typography>
                <Typography variant="body1">
                  Card ID: {item.cardId || "No ID available"}
                </Typography>
                <Typography variant="body1">
                  Price: ${item.price || 0}
                </Typography>
                <Typography variant="body1">
                  Quantity: {item.quantity || 0}
                </Typography>
                <Typography variant="body1">
                  Shipping: {item.shipping || "No shipping info"}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <Typography variant="body1">{errorMessage}</Typography>
      )}
      <Typography variant="h6" align="right">
        Total Price: ${totalCartPrice.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default CartItemsPage;
