export type OriginalImage = {
  height: number
  width: number
  url: string
  webp?: string
}

export type PreviewImage = {
  url: string
}

export type Images = {
  original: OriginalImage
  preview_gif?: PreviewImage
  preview_webp?: PreviewImage
}

export type Gif = {
  id: string
  url: string
  title: string
  images: Images
}

export type GetGifsParams = {
  q?: string
  limit?: number
  offset?: number
}

export type GetGifsResponse = {
  data: Array<Gif>
  pagination: {
    total_count: number
    count: number
    offset: number
  }
}
