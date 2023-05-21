import { styled } from "@mui/material"
import { keyframes } from "@mui/system"

const fade = keyframes({
  "0%": {
    opacity: 1,
  },
  "50%": {
    opacity: 0.5,
  },
  "100%": {
    opacity: 1,
  },
})

const Skeleton = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  animation: `${fade} 1s ease-in-out infinite`,
}))
export default Skeleton
