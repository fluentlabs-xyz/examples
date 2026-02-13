import { Suspense } from "react"

import { BrowserRouter } from "react-router-dom"

import { Spinner } from "@/shared/ui/spinner/Spinner.tsx"

export const withRouter = (component: () => React.ReactNode) => () => (
  <BrowserRouter>
    <Suspense fallback={<Spinner />}>{component()}</Suspense>
  </BrowserRouter>
)
