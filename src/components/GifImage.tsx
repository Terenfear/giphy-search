import { styled } from "@mui/material"
import { HTMLProps } from "react"
import { Images } from "../api/giphy/types"

type GifImageProps = Omit<HTMLProps<HTMLImageElement>, "src"> & {
  gifImages: Images
}

const GifImage = styled(({ gifImages, ...restImageProps }: GifImageProps) => (
  <img
    src={
      gifImages.preview_webp?.url ??
      gifImages.preview_gif?.url ??
      gifImages.original.webp ??
      gifImages.original.url
    }
    {...restImageProps}
  />
))(({ gifImages }) => ({
  aspectRatio: `${gifImages.original.width}/${gifImages.original.height}`,
  flexBasis: `${gifImages.original.width / 2}px`,
}))

export default GifImage
