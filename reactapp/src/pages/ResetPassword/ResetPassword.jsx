import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ResetPassword.css"; // Import CSS file for styling

const ResetPassword = () => {
  const { userId, token } = useParams();
  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/users/reset-password/${userId}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error); 
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
