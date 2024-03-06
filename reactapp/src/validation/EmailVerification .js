import React, { useState } from "react";
import axios from "axios";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setVerificationStatus(null);
  };

  const handleVerifyClick = async () => {
    try {
      const response = await axios.post("/api/send-verification-email", {
        email,
      });

      console.log("Email sent successfully!", response.data);
      setVerificationStatus(
        "Email sent successfully. Please check your inbox."
      );
    } catch (error) {
      console.error("Failed to send email:", error);
      setVerificationStatus("Failed to send email. Please try again.");
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <div>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
        />
        <button onClick={handleVerifyClick}>Verify</button>
      </div>
      {verificationStatus && <p>{verificationStatus}</p>}
    </div>
  );
};

export default EmailVerification;
