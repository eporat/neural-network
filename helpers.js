const clone2DArray = (array) => {
  return array.map((sub) => sub.slice())
}

function indexOfMax(arr) {
    return arr.indexOf(max(...arr))
}