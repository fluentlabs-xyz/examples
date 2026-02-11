import { createConfig, http, WagmiProvider } from "wagmi"
import { injected } from "wagmi/connectors"

import {
  FLUENT_TESTNET_CHAIN_ID,
  TESTNET_EXPLORER_URL,
  TESTNET_RPC_URL,
} from "@/shared/config/consts"

const fluentTestnet = {
  id: FLUENT_TESTNET_CHAIN_ID,
  name: "Fluent Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [TESTNET_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Fluent Block Explorer",
      url: TESTNET_EXPLORER_URL,
    },
  },
} as const

const wagmiConfig = createConfig({
  chains: [fluentTestnet],
  transports: {
    [FLUENT_TESTNET_CHAIN_ID]: http(TESTNET_RPC_URL),
  },
  connectors: [injected()],
})

// eslint-disable-next-line react/display-name
export const withWagmi = (component: () => React.ReactNode) => () => (
  <WagmiProvider config={wagmiConfig}>
    {component()}
  </WagmiProvider>
)
