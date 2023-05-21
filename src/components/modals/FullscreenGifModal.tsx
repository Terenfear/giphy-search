import { Box, Modal } from "@mui/material"
import { Gif } from "../../api/giphy/types"

const FullscreenGifModal = ({
  gif,
  onClose,
}: {
  gif: Gif | null
  onClose: () => void
}) => (
  <Modal
    open={!!gif}
    onClose={onClose}
    sx={{
      display: "flex",
    }}
  >
    {gif ? (
      <Box
        component="img"
        src={gif.images.original.webp ?? gif.images.original.url}
        width={gif.images.original.width}
        height={gif.images.original.height}
        alt={gif.title}
        m="auto"
        p={2}
        maxWidth="100%"
        maxHeight="100%"
      />
    ) : (
      <div />
    )}
  </Modal>
)

export default FullscreenGifModal
