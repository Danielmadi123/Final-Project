import React from "react";
import {
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";

const AboutContainer = styled(Container)({
  marginTop: "2rem",
});

const AboutPaper = styled(Paper)({
  padding: "2rem",
  textAlign: "left",
  "& > *": {
    marginBottom: "1.5rem",
  },
});

const AboutPage = () => {
  return (
    <AboutContainer>
      <AboutPaper elevation={3}>
        <Typography variant="h3" component="h1">
          About Our Shop
        </Typography>

        <Typography variant="body1">
          Welcome to our shop! We are dedicated to providing the best products
          and services to our customers.
        </Typography>

        <Typography variant="body1">
          Our goal is to offer a wide range of high-quality products, ensuring
          an excellent shopping experience.
        </Typography>

        <Typography variant="body1">
          At our shop, you'll find everything from apparel to electronics and
          much more.
        </Typography>

        <Typography variant="body1">
          For any inquiries or support, feel free to contact our customer
          service team.
        </Typography>

        <Typography variant="h4">Our Values</Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Quality Products"
              secondary="We prioritize offering only high-quality products to our customers."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Customer Satisfaction"
              secondary="We aim to ensure a seamless and satisfying shopping experience."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Diverse Selection"
              secondary="Our shop boasts a diverse selection of items to cater to various needs."
            />
          </ListItem>
        </List>

        <Typography variant="h4">Our Team</Typography>

        <Typography variant="body1">
          Meet our dedicated team of professionals working to provide the best
          service and products to you.
        </Typography>

        {/* Add more sections, team members, details, or any other relevant information here */}
      </AboutPaper>
    </AboutContainer>
  );
};

export default AboutPage;
