import compose from "compose-function"

import { withMui } from "./with-mui"
import { withQuery } from "./with-query"
import { withRouter } from "./with-router"
import { withWagmi } from "./with-wagmi"

export const withProviders = compose(withRouter, withWagmi, withQuery, withMui)
