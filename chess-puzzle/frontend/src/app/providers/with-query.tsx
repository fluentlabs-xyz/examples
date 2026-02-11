import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// eslint-disable-next-line react/display-name
export const withQuery = (component: () => React.ReactNode) => () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {component()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
