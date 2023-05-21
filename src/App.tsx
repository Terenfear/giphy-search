import { Typography, styled } from "@mui/material"
import SearchPage from "./pages/SearchPage"

function App() {
  return (
    <RootContainer>
      <Title component="h1">
        <a href="/">Find Your GIF</a>
      </Title>
      <SearchPage />
    </RootContainer>
  )
}

const RootContainer = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor: "#99ffcf",
  backgroundAttachment: "fixed",
  backgroundImage: `radial-gradient(at 96% 34%, hsla(135,66%,75%,1) 0px, transparent 50%),
    radial-gradient(at 52% 80%, hsla(201,74%,60%,1) 0px, transparent 50%),
    radial-gradient(at 47% 99%, hsla(46,65%,67%,1) 0px, transparent 50%),
    radial-gradient(at 51% 37%, hsla(102,79%,63%,1) 0px, transparent 50%),
    radial-gradient(at 73% 21%, hsla(260,96%,67%,1) 0px, transparent 50%),
    radial-gradient(at 92% 25%, hsla(195,66%,61%,1) 0px, transparent 50%),
    radial-gradient(at 96% 77%, hsla(218,82%,75%,1) 0px, transparent 50%)`,
}))

const Title = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  fontFamily: '"Press Start 2P", sans-serif',
  textAlign: "center",
  alignSelf: "stretch",
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    textAlign: "left",
    fontSize: theme.typography.h3.fontSize,
  },
  "& > a": {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
})) as typeof Typography

export default App
