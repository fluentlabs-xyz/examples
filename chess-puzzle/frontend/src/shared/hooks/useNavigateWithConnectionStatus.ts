import { useEffect } from "react"

import { useNavigate, useSearchParams } from "react-router-dom"
import { useAccount } from "wagmi"

import { DEFAULT_CONTRACT_ADDRESS } from "@/shared/config/consts.ts"
import { NavigationRoutes } from "@/shared/config/navigation"

/**
 *  Checking connection and redirect to connection page with saving contract address
 */
export const useNavigateWithConnectionStatus = () => {
  const account = useAccount()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const options = {
    replace: true,
  }
  useEffect(() => {
    const contractSearchParam = searchParams.get("contract")

    if (!account.isConnected) {
      navigate(
        NavigationRoutes.main +
          (contractSearchParam ? `?contract=${contractSearchParam}` : ""),
        options,
      )
    } else {
      const to =
        NavigationRoutes.puzzle +
        (contractSearchParam
          ? `?contract=${contractSearchParam}`
          : `?contract=${DEFAULT_CONTRACT_ADDRESS}`)
      navigate(to, options)
    }
  }, [account.isConnected, navigate])
}
