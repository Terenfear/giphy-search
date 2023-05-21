import {
  Alert,
  AlertProps,
  Box,
  ButtonBase,
  TextField,
  TextFieldProps,
  Typography,
  alpha,
  styled,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import debounce from "lodash/debounce"
import get from "lodash/get"
import { memo, useCallback, useMemo, useState } from "react"
import {
  MAX_LIMIT,
  MAX_OFFSET,
  MAX_TOTAL_COUNT,
  getGifs,
} from "../api/giphy/api"
import { Gif } from "../api/giphy/types"
import GifImage from "../components/GifImage"
import Pagination from "../components/Pagination"
import Skeleton from "../components/Skeleton"
import FullscreenGifModal from "../components/modals/FullscreenGifModal"
import { useSearch } from "../hooks/useSearch"

const DEFAULT_LIMIT = 30

const SearchPage = () => {
  const [searchParams, updateSearch] = useSearch()
  const searchObj = useMemo(
    () => Object.fromEntries(searchParams),
    [searchParams]
  )

  const { fetchStatus, data, error } = useQuery({
    queryKey: ["search", searchObj],
    queryFn: () => getGifs(searchObj),
    enabled: !!searchObj.q,
    keepPreviousData: true,
  })

  const [clickedGif, setClickedGif] = useState<Gif | null>(null)
  const [searchInput, setSearchInput] = useState(searchObj.q ?? "")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateSearchOnInputChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      updateSearch(setNewSearchInput(e.target.value.trim()))
    }, 300),
    [updateSearch]
  )

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setSearchInput(e.target.value)
      updateSearchOnInputChange(e)
    },
    [updateSearchOnInputChange]
  )

  const onOffsetChange = useCallback(
    (offset: number) => {
      updateSearch((draft) =>
        draft.set("offset", Math.min(offset, MAX_OFFSET).toString())
      )
      setClickedGif(null)
      // HACK: in some cases the scroll doesn't work without this.
      // Usually it's reproduced when we return to the page that's already cached
      // If your're curious, try to comment the promise, reload the tab,
      // go to the second page and then return to the first one
      Promise.resolve().then(() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      )
    },
    [updateSearch]
  )

  const onModalClose = useCallback(() => setClickedGif(null), [])

  return (
    <>
      <SearchField
        label="Search"
        value={searchInput}
        onChange={onInputChange}
      />
      {error ? (
        <CenteredAlert severity="error">
          <Typography variant="body1">Something went wrong</Typography>
          {get(error, "status", NaN) >= 500 && (
            <Typography variant="body2">Please, try again later</Typography>
          )}
        </CenteredAlert>
      ) : fetchStatus === "fetching" ? (
        <List>
          <Skeletons length={DEFAULT_LIMIT} />
        </List>
      ) : fetchStatus === "idle" && !data ? (
        <CenteredAlert severity="info">
          Try searching for something!
        </CenteredAlert>
      ) : !data?.data.length ? (
        <CenteredAlert severity="info">No results found</CenteredAlert>
      ) : (
        <>
          <List data-testid="gif-list">
            {data.data.map((gif) => (
              <ImageRippleWrapper
                key={gif.id}
                onClick={() => setClickedGif(gif)}
              >
                <GifImage
                  gifImages={gif.images}
                  title={gif.title}
                  width="100%"
                />
              </ImageRippleWrapper>
            ))}
          </List>
          <Pagination
            total={Math.min(data.pagination.total_count || 0, MAX_TOTAL_COUNT)}
            limit={sanitizeLimit(searchObj.limit)}
            offset={data.pagination.offset}
            onChange={onOffsetChange}
          />
        </>
      )}
      <FullscreenGifModal gif={clickedGif} onClose={onModalClose} />
    </>
  )
}

const sanitizeLimit = (limit?: string | null) =>
  Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT)

const setNewSearchInput = (searchInput: string) => (draft: URLSearchParams) => {
  searchInput === "" ? draft.delete("q") : draft.set("q", searchInput)
  draft.set("offset", "0")
  const limit = sanitizeLimit(draft.get("limit")).toString()
  draft.set("limit", limit)
}

const SearchField = styled((props: TextFieldProps) => (
  <TextField fullWidth variant="filled" autoFocus {...props} />
))(({ theme }) => ({
  marginBottom: theme.spacing(4),
  alignSelf: "stretch",
})) as typeof TextField

const CenteredAlert = (alertProps: AlertProps) => (
  <Box flexGrow={1} display="flex">
    <Alert
      {...alertProps}
      variant="filled"
      sx={{ ...alertProps.sx, m: "auto" }}
    />
  </Box>
)

// Nice to have(May 21, 2023): find a way to make a nice bottom edge?
const List = styled("div")(({ theme }) => ({
  gap: theme.spacing(2),
  maxWidth: "1400px",
  width: "100%",
  "& > * + *": {
    marginBlockStart: theme.spacing(2),
  },
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up("sm")]: {
    columnCount: 2,
  },
  [theme.breakpoints.up("md")]: {
    columnCount: 3,
  },
  [theme.breakpoints.up("lg")]: {
    columnCount: 5,
  },
}))

const ImageRippleWrapper = styled(ButtonBase)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  width: "100%",
  display: "flex",
  border: `1px solid ${theme.palette.grey[400]}`,
  lineHeight: 0,
  backgroundColor: theme.palette.background.paper,
  // by default ButtonBase has explicit 0 margin
  "& + &": {
    marginBlockStart: theme.spacing(2),
  },
  "& > *": {
    flexGrow: 1,
  },
  justifyItems: "center",
  position: "relative",
  "&::after": {
    content: "'Click to view in fullscreen'",
    position: "absolute",
    alignSelf: "center",
    backgroundColor: alpha(theme.palette.grey[900], 0.7),
    color: theme.palette.common.white,
    ...theme.typography.body2,
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    borderRadius: theme.shape.borderRadius,
    opacity: 0,
    transition: theme.transitions.create("opacity"),
  },
  "&:hover, &:focus-within": {
    borderColor: theme.palette.primary.main,
    "&::after": {
      opacity: 1,
    },
  },
}))

const ImageSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  breakInside: "avoid",
  ":nth-of-type(4n+1)": {
    height: "150px",
  },
  ":nth-of-type(4n+2)": {
    height: "250px",
  },
  ":nth-of-type(4n+3)": {
    height: "350px",
  },
  ":nth-of-type(4n)": {
    height: "450px",
  },
}))

const Skeletons = memo(({ length }: { length: number }) => (
  <>
    {Array(length)
      .fill(null)
      .map((_, index) => (
        <ImageSkeleton key={index} />
      ))}
  </>
))

export default SearchPage
