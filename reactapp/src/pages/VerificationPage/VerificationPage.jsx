import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerificationPage = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [requestResult, setRequestResult] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showVerificationForm, setShowVerificationForm] = useState(true);
  const [timer, setTimer] = useState(50);
  const [hasRequestedNewCode, setHasRequestedNewCode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    if (timer > 0 && showVerificationForm) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && showVerificationForm) {
      setShowVerificationForm(false);
    }

    return () => clearInterval(interval);
  }, [timer, showVerificationForm]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRequestNewCode = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/users/request-new-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequestResult("New code requested successfully");
        setHasRequestedNewCode(true);
        window.location.reload();
      } else {
        setRequestResult(data.error || "Failed to request a new code");
      }
    } catch (error) {
      console.error("Error during new code request:", error);
      setRequestResult("An error occurred during new code request");
    }
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerifyClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationCode: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (showVerificationForm) {
          setVerificationResult("Verification successful");
          setShowVerificationForm(false);
          navigate("/login");
        } else {
          console.log(
            "Verification successful, but showVerificationForm is already false."
          );
        }
      } else {
        setVerificationResult(data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setVerificationResult("An error occurred during verification");
    }
  };

  return (
    <div>
      {showVerificationForm ? (
        <>
          <h1>Verification Page</h1>
          <p>Please enter the verification code sent to your email.</p>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
          />
          <button onClick={handleVerifyClick}>Verify</button>
          <p>
            Time remaining: {Math.floor(timer / 60)}:{timer % 60}
          </p>
          {verificationResult && <p>{verificationResult}</p>}
        </>
      ) : (
        <>
          <h1>Request New Verification Code</h1>
          <p>Enter your email to request a new verification code.</p>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <button onClick={handleRequestNewCode}>Request New Code</button>
          {requestResult && <p>{requestResult}</p>}
        </>
      )}
    </div>
  );
};

export default VerificationPage;
