import { Suspense } from "react"

import { BrowserRouter } from "react-router-dom"

import { Spinner } from "@/shared/ui/spinner/Spinner.tsx"

// eslint-disable-next-line react/display-name
export const withRouter = (component: () => React.ReactNode) => () => (
  <BrowserRouter>
    <Suspense fallback={<Spinner />}>{component()}</Suspense>
  </BrowserRouter>
)
