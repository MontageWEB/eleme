export const KEY = 'goodsData'

export function setItem (value) {
  let jsonString = localStorage.getItem(KEY)
  jsonString = jsonString || '[]'
  let arr = JSON.parse(jsonString)
  arr.push(value)
  localStorage.setItem(KEY, JSON.stringify(arr))
}

export function getItem () {
  let jsonString = localStorage.getItem(KEY)
  jsonString = jsonString || '[]'
  let arr = JSON.parse(jsonString)
  // console.log(arr[arr.length - 1])
  return arr[arr.length - 1]
}

export function remoteItem () {
  localStorage.removeItem(KEY)
}
