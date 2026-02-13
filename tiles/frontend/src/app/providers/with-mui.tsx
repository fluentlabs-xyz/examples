import { ThemeProvider } from "@mui/material/styles"
import { MUI_THEME } from "@fluent.xyz/fluent-ui"
import "@fontsource/urbanist/400.css" // Specify weight
import "@fontsource/urbanist/400-italic.css" // Specify weight and style

export const withMui = (component: () => React.ReactNode) => () => {
  return <ThemeProvider theme={MUI_THEME}>{component()}</ThemeProvider>
}
