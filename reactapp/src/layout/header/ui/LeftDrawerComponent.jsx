import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Drawer,
  ListItemIcon,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LeftDrawerComponent = ({ isOpen, onCloseDrawer, selectedIndex }) => {
  const notLoggedIn = useSelector((bigPie) => !bigPie.authSlice.loggedIn);
  const isBusiness = useSelector((bigPie) => bigPie.authSlice.isBusiness);
  const isAdmin = useSelector((bigPie) => bigPie.authSlice.isAdmin);

  const listItems = [
    { text: "Home", link: "/", icon: <HomeIcon /> },
    { text: "About", link: "/About", icon: <InfoIcon /> },
  ];

  if (notLoggedIn) {
    listItems.push({
      text: "REGISTER",
      link: "/register",
      icon: <AccountBoxIcon />,
    });
    listItems.push({
      text: "LOGIN",
      link: "/login",
      icon: <AccountBoxIcon />,
    });
  }

  if (!notLoggedIn) {
    listItems.push({
      text: "Favorite",
      link: "/favoriteCardPage",
      icon: <FavoriteIcon />,
    });
  }

  if (isBusiness) {
    listItems.push({
      text: "My Cards",
      link: "/MyCardsPage",
      icon: <AccountBoxIcon />,
    });
  }

  if (isAdmin) {
    listItems.push({
      text: "Sandbox",
      link: "/sandboxPage",
      icon: <DeveloperModeIcon />,
    });
  }

  const renderListItems = () => (
    <List>
      {listItems.map((item, index) => (
        <ListItem
          key={item.text}
          disablePadding
          selected={selectedIndex === index}
        >
          <ListItemButton component={Link} to={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={onCloseDrawer}>
      <Box
        sx={{ width: { auto: 250 } }}
        role="presentation"
        onClick={onCloseDrawer}
        onKeyDown={onCloseDrawer}
      >
        {renderListItems()}
        <Divider />
      </Box>
    </Drawer>
  );
};

export default LeftDrawerComponent;
