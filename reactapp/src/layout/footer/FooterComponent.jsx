import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PortraitIcon from "@mui/icons-material/Portrait";
import ContactMailIcon from "@mui/icons-material/ContactMail"; // Import the icon for contact
import { Link, useLocation } from "react-router-dom";
import ROUTES from "../../routes/ROUTES.js";
import { useSelector } from "react-redux";

const FooterComponent = ({ selectedIndex }) => {
  const [value, setValue] = useState(selectedIndex);
  const location = useLocation();
  const loggedIn = useSelector((bigPie) => bigPie.authSlice.loggedIn);
  const isBusiness = useSelector((bigPie) => bigPie.authSlice.isBusiness);
  const isAdmin = useSelector((bigPie) => bigPie.authSlice.isAdmin);

  const footerLinks = [
    { to: ROUTES.ABOUT, label: "About", icon: <InfoIcon /> },
    { to: ROUTES.FAVCARD, label: "Favorite", icon: <FavoriteIcon /> },
    { to: ROUTES.MYCARDS, label: "My Cards", icon: <PortraitIcon /> },
    { to: ROUTES.CONTACTME, label: "Contact Me", icon: <ContactMailIcon /> },
  ];

  useEffect(() => {
    const foundIndex = footerLinks.findIndex(
      (link) => link.to === location.pathname
    );
    setValue(foundIndex !== -1 ? foundIndex : -1);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        paddingTop: 1,
      }}
    >
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          justifyContent: "space-evenly",
        }}
      >
        <img src="/logoE-commerce.png" alt="Logo" style={{ height: 50 }} />
        <BottomNavigation
          showLabels
          value={value}
          sx={{ flexGrow: 3 }}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {footerLinks.map((link, index) =>
            (link.to === ROUTES.ABOUT && !loggedIn) ||
            (link.to === ROUTES.FAVCARD && loggedIn) ||
            (link.to === ROUTES.MYCARDS && (isBusiness || isAdmin)) ||
            (link.to === ROUTES.ABOUT && loggedIn) ||
            link.to === ROUTES.CONTACTME ? ( // Ensure the contact link is always visible
              <BottomNavigationAction
                key={link.to}
                label={link.label}
                icon={link.icon}
                component={Link}
                to={link.to}
                style={{ color: value === index ? "#3498db" : "#848484" }}
              />
            ) : null
          )}
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default FooterComponent;
