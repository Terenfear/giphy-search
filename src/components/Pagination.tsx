import { Box, IconButton, Typography } from "@mui/material"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import LastPageIcon from "@mui/icons-material/LastPage"
import { useCallback } from "react"
export type PaginationProps = {
  total: number
  limit: number
  offset: number
  onChange: (offset: number) => void
}

const Pagination = (props: PaginationProps) => {
  const { total, limit, offset, onChange } = props
  const hasPrev = offset > 0
  const hasNext = offset + limit < total
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const onFirstPageClick = useCallback(() => onChange(0), [onChange])
  const onPrevPageClick = useCallback(
    () => onChange(Math.max(offset - limit, 0)),
    [onChange, offset, limit]
  )
  const onNextPageClick = useCallback(
    () => onChange(offset + limit),
    [onChange, offset, limit]
  )
  const onLastPageClick = useCallback(
    () => onChange((totalPages - 1) * limit),
    [onChange, totalPages, limit]
  )

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <IconButton disabled={!hasPrev} onClick={onFirstPageClick}>
        <FirstPageIcon />
      </IconButton>
      <IconButton disabled={!hasPrev} onClick={onPrevPageClick}>
        <NavigateBeforeIcon />
      </IconButton>
      <Typography variant="body1" component="span">
        {currentPage} / {totalPages}
      </Typography>
      <IconButton disabled={!hasNext} onClick={onNextPageClick}>
        <NavigateNextIcon />
      </IconButton>
      <IconButton disabled={!hasNext} onClick={onLastPageClick}>
        <LastPageIcon />
      </IconButton>
    </Box>
  )
}

export default Pagination
