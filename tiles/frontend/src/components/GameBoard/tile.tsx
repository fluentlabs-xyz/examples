import { useEffect, useState } from "react"

import { useMediaQuery } from "react-responsive"

import { TileCell, TileCellText } from "@/components/GameBoard/styles/styles.ts"
import {
  getBackground,
  getColor,
  getLetter,
} from "@/components/GameBoard/utils/utils.ts"

import {
  containerWidthMobile,
  containerWidthDesktop,
  mergeAnimationDuration,
  tileCountPerDimension,
} from "./constants"
import usePreviousProps from "./hooks/use-previous-props"
import type { Tile as TileProps } from "./models/tile"

export default function Tile({ position, value }: TileProps) {
  const isWideScreen = useMediaQuery({ minWidth: 512 })
  const containerWidth = isWideScreen
    ? containerWidthDesktop
    : containerWidthMobile

  const [scale, setScale] = useState(1)
  const previousValue = usePreviousProps<number>(value)
  const hasChanged = previousValue !== value

  const positionToPixels = (pos: number) =>
    (pos / tileCountPerDimension) * containerWidth

  useEffect(() => {
    if (hasChanged) {
      setScale(1.1)
      setTimeout(() => setScale(1), mergeAnimationDuration)
    }
  }, [hasChanged])

  const style = {
    left: positionToPixels(position[0]),
    top: positionToPixels(position[1]),
    transform: `scale(${scale})`,
    zIndex: value,
    background: getBackground(value),
    color: getColor(value),
  }

  return (
    <TileCell style={style}>
      <TileCellText>{getLetter(value)}</TileCellText>
    </TileCell>
  )
}
