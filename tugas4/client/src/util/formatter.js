export const formTimeFormat = (time) => {
  return time.toString().substring(0, 16).replace('T', ' ') + ':00'
}

export const pickerTimeFormat = (time) => {
  return time.toString().substring(0, 16).replace(' ', 'T')
}

export const tableTimeFormat = (time) => {
  return time.toString().substring(0, 19).replace('T', ' ')
}
