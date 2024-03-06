import React from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "../home/HomePage";
import "./ThankYouPage.css"; // Import the component-specific styling

const ThankYouPage = () => {
  const navigate = useNavigate();
  const handleContinueShoppingClick = () => {
    navigate("/");
  };
  return (
    <div className="thank-you-page">
      <h1>Thank You For Your Purchase</h1>
      <div className="receipt-content">
        <p>Check your email inbox for the receipt.</p>
        <p>
          If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>
        </p>
        <button
          className="continue-shopping-button"
          onClick={handleContinueShoppingClick}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
