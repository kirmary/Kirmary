import { notFound } from "next/navigation"

import DashboardPage from "../_page"
import LoginPage from "../login/_page"
import MessagesPage from "../messages/_page"

import GalleryPage from "../gallery/_page"
import NewGalleryImagePage from "../gallery/new/_page"
import EditGalleryImagePage from "../gallery/[id]/_page"
import NewGallerySectionPage from "../gallery/sections/new/_page"
import EditGallerySectionPage from "../gallery/sections/[id]/_page"

import ProductsPage from "../products/_page"
import NewProductPage from "../products/new/_page"
import EditProductPage from "../products/[id]/_page"

import ProjectsPage from "../projects/_page"
import NewProjectPage from "../projects/new/_page"
import EditProjectPage from "../projects/[id]/_page"

import RfqDetailPage from "../rfq/[id]/_page"

import TechnicalLibraryPage from "../technical-library/_page"
import NewTechnicalDocumentPage from "../technical-library/new/_page"
import EditTechnicalDocumentPage from "../technical-library/[id]/_page"

type QueryValue = string | string[] | undefined

type AdminCatchAllProps = {
  params: Promise<{
    path?: string[]
  }>
  searchParams: Promise<Record<string, QueryValue>>
}

function firstQueryValue(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Vercel Hobby counts each dynamic App Router page as a Serverless Function.
 * Keep all Admin GET pages behind this single optional catch-all route while
 * preserving the existing /admin/... URLs.
 */
export default async function AdminCatchAllPage({
  params,
  searchParams,
}: AdminCatchAllProps) {
  const { path = [] } = await params

  if (path.length === 0) {
    const query = await searchParams

    return (
      <DashboardPage
        searchParams={Promise.resolve({
          q: firstQueryValue(query.q),
          status: firstQueryValue(query.status),
          page: firstQueryValue(query.page),
        })}
      />
    )
  }

  if (path.length === 1) {
    switch (path[0]) {
      case "login": {
        const query = await searchParams

        return (
          <LoginPage
            searchParams={Promise.resolve({
              error: firstQueryValue(query.error),
            })}
          />
        )
      }

      case "messages":
        return <MessagesPage />

      case "gallery":
        return <GalleryPage />

      case "products":
        return <ProductsPage />

      case "projects":
        return <ProjectsPage />

      case "technical-library":
        return <TechnicalLibraryPage />

      default:
        notFound()
    }
  }

  if (path.length === 2) {
    const [section, value] = path

    if (section === "gallery") {
      if (value === "new") {
        return <NewGalleryImagePage />
      }

      return (
        <EditGalleryImagePage
          params={Promise.resolve({ id: value })}
        />
      )
    }

    if (section === "products") {
      if (value === "new") {
        return <NewProductPage />
      }

      return (
        <EditProductPage
          params={Promise.resolve({ id: value })}
        />
      )
    }

    if (section === "projects") {
      if (value === "new") {
        return <NewProjectPage />
      }

      return (
        <EditProjectPage
          params={Promise.resolve({ id: value })}
        />
      )
    }

    if (section === "technical-library") {
      if (value === "new") {
        return <NewTechnicalDocumentPage />
      }

      return (
        <EditTechnicalDocumentPage
          params={Promise.resolve({ id: value })}
        />
      )
    }

    if (section === "rfq") {
      return (
        <RfqDetailPage
          params={Promise.resolve({ id: value })}
        />
      )
    }

    notFound()
  }

  if (
    path.length === 3 &&
    path[0] === "gallery" &&
    path[1] === "sections"
  ) {
    if (path[2] === "new") {
      return <NewGallerySectionPage />
    }

    return (
      <EditGallerySectionPage
        params={Promise.resolve({ id: path[2] })}
      />
    )
  }

  notFound()
}
