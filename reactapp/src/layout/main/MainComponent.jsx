import { Container } from "@mui/material";

const MainComponent = ({ children }) => {
  return <Container sx={{ mb: 10 }}>{children}</Container>;
};

export default MainComponent;
