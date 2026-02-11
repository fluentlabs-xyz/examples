export const NavigationRoutes = {
  main: "/",
  puzzle: "/puzzle",
  switch: "/switch",
} as const

export type NavigationRoute =
  (typeof NavigationRoutes)[keyof typeof NavigationRoutes]
