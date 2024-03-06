import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Tabs, Tab } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonalInformationPage from "./PersonalInformationPage";
import CartItemsPage from "./CartItemsPage";
import Divider from "@mui/material/Divider";
import axios from "axios";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const CheckoutPage = () => {
  const location = useLocation();
  const { state } = location;
  const cartItems = state?.cartItems || [];
  const totalCartPrice = state?.totalCartPrice || 0;
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    first: "",
    middle: "",
    last: "",
    email: "",
    phone: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    cardNumber: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleBack = () => {
    setActiveTab((prevTab) => prevTab - 1);
  };

  const handleNext = () => {
    setActiveTab((prevTab) => prevTab + 1);
  };

  const handlePlaceOrderClick = async () => {
    try {
      const userEmail = formData.email;

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not logged in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const cartResponse = await axios.get(
        "http://localhost:8080/cart",
        config
      );
      const cartItems = cartResponse.data[0].items;
      if (!cartItems || cartItems.length === 0) {
        console.error("No cart items found.");
        return;
      }

      await axios.post(
        "/users/order-confirmation",
        {
          userEmail,
          cartItems,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/ThankYouPage");
      window.location.reload();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  useEffect(() => {
    const validateFormData = () => {
      if (activeTab === 0) {
        return (
          formData.first.trim() !== "" &&
          formData.last.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.phone.trim() !== "" &&
          formData.country.trim() !== "" &&
          formData.city.trim() !== "" &&
          formData.street.trim() !== "" &&
          formData.houseNumber.trim() !== ""
        );
      } else if (activeTab === 1) {
        return (
          formData.cardNumber.trim() !== "" &&
          formData.name.trim() !== "" &&
          formData.expiry.trim() !== "" &&
          formData.cvc.trim() !== ""
        );
      } else if (activeTab === 2) {
        return true;
      }

      return false;
    };
    setIsFormValid(validateFormData());
  }, [formData, activeTab]);

  const containerStyle = {
    marginTop: "16px",
    padding: "24px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const submitButtonStyle = {
    marginTop: "16px",
  };

  const tabIconStyle = {
    marginRight: "8px",
  };

  const formContainerStyle = {
    maxWidth: "400px",
    margin: "0 auto",
  };

  return (
    <Container>
      <Typography variant="h1" align="center" gutterBottom>
        CHECKOUT
        <Divider sx={{ mt: 4, width: 750, mx: "auto" }} />
      </Typography>

      <Paper elevation={3} style={containerStyle}>
        <div style={{ marginBottom: "30px" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              icon={<PersonIcon style={tabIconStyle} />}
              label="Personal Information"
              disabled
            />
            <Tab
              icon={<CreditCardIcon style={tabIconStyle} />}
              label="Billing Information"
              disabled
            />
            <Tab
              icon={<ShoppingCartIcon style={tabIconStyle} />}
              label="Cart Items"
              disabled
            />
          </Tabs>
        </div>

        {activeTab === 0 && (
          <PersonalInformationPage
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}

        {activeTab === 1 && (
          <div style={formContainerStyle}>
            <div style={{ marginBottom: "20px" }}>
              {" "}
              <Cards
                number={formData.cardNumber}
                name={formData.name}
                expiry={formData.expiry}
                cvc={formData.cvc}
                focused={formData.focus}
              />
            </div>
            <div className="mt-3">
              <form>
                <div className="mb-3">
                  <input
                    type="number"
                    name="cardNumber"
                    className="form-control"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    onFocus={handleInputChange}
                    required
                    style={{ marginBottom: "20px" }}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    onChange={handleInputChange}
                    onFocus={handleInputChange}
                    required
                    style={{ marginBottom: "20px" }}
                  />
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input
                      type="number"
                      name="expiry"
                      className="form-control"
                      placeholder="Valid Thru"
                      pattern="\d\d/\d\d"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      onFocus={handleInputChange}
                      required
                      style={{ marginBottom: "20px" }}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <input
                      type="number"
                      name="cvc"
                      className="form-control"
                      placeholder="CVC"
                      pattern="\d{3,4}"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      onFocus={handleInputChange}
                      required
                      style={{ marginBottom: "20px" }}
                    />
                  </div>
                </div>
                <div className="d-grid"></div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <CartItemsPage
            cartItems={cartItems}
            totalCartPrice={totalCartPrice}
          />
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {activeTab > 0 && (
            <Button
              variant="outlined"
              color="primary"
              style={submitButtonStyle}
              onClick={handleBack}
            >
              Back
            </Button>
          )}

          <form onSubmit={handleSubmit}>
            {activeTab < 2 && (
              <Button
                variant="contained"
                color="primary"
                style={submitButtonStyle}
                onClick={handleNext}
                disabled={!isFormValid}
              >
                Next
              </Button>
            )}

            {activeTab === 2 && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handlePlaceOrderClick}
                style={submitButtonStyle}
                disabled={!isFormValid}
              >
                Place Order
              </Button>
            )}
          </form>
        </div>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
