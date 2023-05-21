import { test, expect } from "@playwright/test"
import { successResponse } from "./success-response"

test("on page load should display one of the info alerts", async ({ page }) => {
  await page.goto("http://localhost:5173/")
  await expect(
    page.getByRole("alert").getByText("Try searching for something!")
  ).toBeInViewport()
})

test("on empty response should display another info alert", async ({
  page,
}) => {
  await page.route(`**/gifs/search**`, async (route) => {
    const json = {
      data: [],
      pagination: {
        total_count: 0,
        count: 0,
        offset: 0,
      },
    }
    route.fulfill({ json })
  })
  await page.goto("http://localhost:5173/")
  await page.getByLabel("Search").click()
  await page.getByLabel("Search").fill("foo")
  await expect(
    page.getByRole("alert").getByText("No results found")
  ).toBeInViewport()
})

test("on error should display the error alert", async ({ page }) => {
  await page.route(`**/gifs/search**`, async (route) =>
    route.abort("accessdenied")
  )
  await page.goto("http://localhost:5173/")
  await page.getByLabel("Search").click()
  await page.getByLabel("Search").fill("foo")
  await expect(
    page.getByRole("alert").getByText("Something went wrong")
  ).toBeInViewport()
})

test("on server error should display the error alert with additonal text", async ({
  page,
}) => {
  await page.route(`**/gifs/search**`, async (route) =>
    route.fulfill({ status: 503 })
  )
  await page.goto("http://localhost:5173/")
  await page.getByLabel("Search").click()
  await page.getByLabel("Search").fill("foo")
  const alertLocator = page.getByRole("alert")
  await expect(alertLocator.getByText("Something went wrong")).toBeInViewport()
  await expect(
    alertLocator.getByText("Please, try again later")
  ).toBeInViewport()
})

test("on success should display gifs", async ({ page }) => {
  await page.route(`**/gifs/search**`, async (route) => {
    route.fulfill({ json: successResponse })
  })
  await page.goto("http://localhost:5173/")
  await page.getByLabel("Search").click()
  await page.getByLabel("Search").fill("foo")
  const listLocator = page.getByTestId("gif-list")
  await expect(listLocator).toBeInViewport()
  const paginationLocator = page.getByTestId("pagination")
  await expect(paginationLocator.getByText("1 / 1")).toBeInViewport()
  expect(await listLocator.locator("img").count()).toBe(
    successResponse.pagination.count
  )
})

// Nice to have(May 22, 2023): add tests for pagination
