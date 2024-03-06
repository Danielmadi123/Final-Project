import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Grid,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ROUTES from "../../routes/ROUTES";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";

const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputsValue, setInputValue] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    alt: "",
    url: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          return;
        }

        console.log("User ID:", id);
        const response = await axios.get(
          `http://localhost:8080/users/${id}?includePassword=true`
        );

        const userData = response.data;

        console.log("UserData:", userData);

        if (!userData || !userData.user) {
          console.error("User data is undefined");
          return;
        }

        setUserData(userData.user);

        setInputValue((currentState) => ({
          ...currentState,
          firstName: userData.user.name?.first || "",
          middleName: userData.user.name?.middle || "",
          lastName: userData.user.name?.last || "",
          email: userData.user.email || "",
          password: userData.user.password || "",
          phone: userData.user.phone || "",
          alt: userData.user.image?.alt || "",
          url: userData.user.image?.url || "",
          state: userData.user.address?.state || "",
          country: userData.user.address?.country || "",
          city: userData.user.address?.city || "",
          street: userData.user.address?.street || "",
          houseNumber: userData.user.address?.houseNumber || "",
          zip: userData.user.address?.zip || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(
          `Error fetching user data: ${error.message || "Unknown error"}`,
          toastStyle
        );
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setInputValue((currentState) => ({
      ...currentState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleUpdateChangesClick = async () => {
    try {
      if (!id) {
        console.error("User ID is undefined");
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        "Content-Type": "application/json",
      };

      if (!inputsValue.password) {
        toast.error("Password is required for updating the user", toastStyle);
        return;
      }

      const { data } = await axios.put(
        `http://localhost:8080/users/${id}`,
        {
          name: {
            first: inputsValue.firstName,
            middle: inputsValue.middleName,
            last: inputsValue.lastName,
          },
          address: {
            street: inputsValue.street,
            city: inputsValue.city,
            country: inputsValue.country,
            houseNumber: inputsValue.houseNumber,
            zip: inputsValue.zip,
          },
          image: {
            alt: inputsValue.alt,
            url: inputsValue.url,
          },
          phone: inputsValue.phone,
          email: inputsValue.email,
          password: inputsValue.password,
        },
        { headers }
      );

      dispatch(authActions.updateUserProfile(data));

      toast.success("User has been edited successfully!", toastStyle);

      // Delay the window.location.reload() by 30 seconds (30000 milliseconds)
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      toast.error(
        `Error updating User: ${err.message || "Unknown error"}`,
        toastStyle
      );
    }
  };

  const toastStyle = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  return (
    <Container sx={{ padding: "50px" }}>
      <Typography variant="h2" sx={{ mb: 1, padding: "10px", pb: "0px" }}>
        Edit Profile
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, padding: "3px", ml: "7px" }}>
        Put new values in the correct input
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container flexDirection={"column"}>
        {Object.keys(inputsValue).map((key) => (
          <TextField
            key={key}
            id={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            variant="outlined"
            sx={{ mt: "10px" }}
            onChange={handleInputChange}
            value={inputsValue[key]}
            required
          />
        ))}
        <Grid container spacing={2}>
          <Grid item lg={8} md={8} sm={8} xs>
            <Button
              variant="outlined"
              sx={{ mt: 2, width: "100%", ml: "0%", bgcolor: "lightskyblue" }}
              onClick={handleUpdateChangesClick}
            >
              Update Changes
            </Button>
          </Grid>
          <Grid item xs>
            <Link to={`${ROUTES.EDITPROFILE}/${id}`}>
              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  width: "100%",
                  ml: "0%",
                  bgcolor: "navy",
                  color: "gray",
                }}
              >
                Discard Changes
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditProfile;
