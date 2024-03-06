import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import Links from "./ui/Links";
import LeftDrawerComponent from "./ui/LeftDrawerComponent";
import { useState, useEffect } from "react";
import FilterComponent from "./ui/FilterComponent";
import CottageIcon from "@mui/icons-material/Cottage";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "../../routes/ROUTES";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import axios from "axios"; // Import axios for making API requests
import { selectCartItemsCount } from "../../store/cartSlice";

const HeaderComponent = ({ isDarkTheme, onThemeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const isLoggedIn = useSelector((bigPie) => bigPie.authSlice.loggedIn);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const userData = useSelector((state) => state.authSlice.userData);
  const [imageUrl, setImageUrl] = useState(""); // State variable to store the image URL

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (event) => {
    if (event && event.target.textContent === "Logout") {
      setTimeout(() => {
        setAnchorEl(null);
        handleMobileMenuClose();

        if (isLoggedIn) {
          localStorage.removeItem("token");
          localStorage.setItem("showLogoutToast", "true");
          window.location.href = ROUTES.LOGIN;
        } else {
          window.location.href = ROUTES.LOGIN;
        }
      }, 100);
    } else {
      setAnchorEl(null);
      handleMobileMenuClose();

      if (!isLoggedIn) {
        navigate(ROUTES.LOGIN);
      }
    }
  };

  const handleEditProfileOpen = (event) => {
    if (event) {
      event.preventDefault();
    }
    setEditProfileOpen(true);
    handleMenuClose(event);
    handleMobileMenuClose();
    navigate(`/editprofile/${userData?.id ?? userData?._id}`);
  };

  const handleEditProfileClose = () => {
    setEditProfileOpen(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleThemeChange = (event) => {
    onThemeChange(event.target.checked);
  };

  const handleOpenDrawerClick = () => {
    setIsOpen(true);
  };

  const handleCloseDrawerClick = () => {
    setIsOpen(false);
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "mobile-menu";

  useEffect(() => {
    const showLogoutToast = localStorage.getItem("showLogoutToast");

    if (showLogoutToast === "true") {
      toast.success("You've logged out successfully 🌊", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      localStorage.removeItem("showLogoutToast");
    }
  }, []);

  const toastStyle = {};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userData?.id && !userData?._id) {
          console.error("User ID is not available");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/users/${
            userData.id ?? userData._id
          }?includePassword=true`
        );

        const userDataResponse = response.data;

        if (!userDataResponse || !userDataResponse.user) {
          console.error("User data is undefined");
          return;
        }

        setImageUrl(userDataResponse.user.image?.url || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(
          `Error fetching user data: ${error.message || "Unknown error"}`,
          toastStyle
        );
      }
    };

    fetchUserData();
  }, [userData]);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isLoggedIn && (
        <MenuItem onClick={handleEditProfileOpen}>Edit Profile</MenuItem>
      )}
      <MenuItem onClick={handleMenuClose}>
        {isLoggedIn ? "Logout" : "Login"}
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isLoggedIn && (
        <MenuItem onClick={handleEditProfileOpen}>Edit Profile</MenuItem>
      )}
      <MenuItem onClick={handleMenuClose}>
        {isLoggedIn ? "Logout" : "Login"}
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleOpenDrawerClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Link
              to={ROUTES.HOME}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconButton color="inherit">
                <CottageIcon />
              </IconButton>
            </Link>
          </Typography>
          <Links />
          <Box
            sx={{
              my: 2,
              p: 1,
            }}
          >
            <IconButton color="inherit" onClick={handleThemeChange}>
              <Typography sx={{ display: { xs: "none", md: "inline" } }}>
                {isDarkTheme ? <DarkModeIcon /> : <LightModeIcon />}
              </Typography>
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {isLoggedIn && (
              <IconButton
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "20px",
                }}
              >
                <IconButton onClick={() => navigate(ROUTES.CARTPAGE)}>
                  <Badge badgeContent={cartItemsCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </IconButton>
            )}

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {isLoggedIn ? (
                <img
                  src={
                    imageUrl ||
                    process.env.PUBLIC_URL + "/assets/imgs/default-image.png"
                  }
                  style={{ borderRadius: "50%", width: "32px", height: "32px" }}
                  alt="User Avatar"
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <LeftDrawerComponent
        isOpen={isOpen}
        onCloseDrawer={handleCloseDrawerClick}
      />
      <ToastContainer />
    </Box>
  );
};

export default HeaderComponent;
