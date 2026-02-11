import { Route, Routes } from "react-router-dom"

import { Layout } from "@/components/Layout"

import { NoMatch } from "./no-match"
import TilesPage from "./tiles"

export default function Pages() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<TilesPage />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}
