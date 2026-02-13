export const getBackground = (num: number) => {
  switch (num) {
    case 2:
      return "#EBE9FF"
    case 4:
      return "#f3def5"
    case 8:
      return "#cbaad8"
    case 16:
      return "#b08fc8"
    case 32:
      return "#9e72c3"
    case 64:
      return "#924dbf"
    case 128:
      return "#96529b"
    case 256:
      return "#70437f"
    case 512:
      return "#3c274e"
    case 1024:
      return "#4e008c"
    default:
      return "#EBE9FF"
  }
}

export const getColor = (num: number) => {
  switch (num) {
    case 2:
      return "#1E1E1E"
    case 4:
      return "#1E1E1E"
    case 8:
      return "#1E1E1E"
    case 16:
      return "#1E1E1E"
    case 32:
      return "#1E1E1E"
    case 64:
      return "#FFF"
    case 128:
      return "#FFF"
    case 256:
      return "#FFF"
    case 512:
      return "#FFF"
    case 1024:
      return "#FFF"
    default:
      return "#1E1E1E"
  }
}

export const getLetter = (num: number) => {
  switch (num) {
    case 2:
      return "f"
    case 4:
      return "l"
    case 8:
      return "u"
    case 16:
      return "e"
    case 32:
      return "n"
    case 64:
      return "t"
    case 128:
      return "."
    case 256:
      return "x"
    case 512:
      return "y"
    case 1024:
      return "z"
    default:
      return ""
  }
}
