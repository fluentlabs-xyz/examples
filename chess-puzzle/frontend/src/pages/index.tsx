import { Route, Routes } from "react-router-dom"

import { Layout } from "@/components/Layout"
import { NavigationRoutes } from "@/shared/config/navigation"

import { ChessboardPage } from "./chessboard"
import { NoMatch } from "./no-match"
import PuzzlesPage from "./puzzles"

export default function Pages() {
  return (
    <Routes>
      <Route path="/" element={<PuzzlesPage />} />
      <Route element={<Layout />}>
        <Route path={NavigationRoutes.puzzle} element={<ChessboardPage />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}
