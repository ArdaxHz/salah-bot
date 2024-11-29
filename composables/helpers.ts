import { DateTime } from 'luxon'

export function capitalizeFirstLetter(stringToCapitalise: string) {
  return (
    stringToCapitalise.charAt(0).toUpperCase() + stringToCapitalise.slice(1)
  )
}

export function updateObj(obj /* , … */) {
  for (let i = 1; i < arguments.length; i++) {
    for (const prop in arguments[i]) {
      const val = arguments[i][prop]
      if (typeof val === 'object') {
        updateObj(obj[prop], val)
      }
      else {
        // Check if the value is a string and can be converted to a number
        if (typeof val === 'string' && !isNaN(val)) {
          // Convert to a number (int or float)
          obj[prop] = val.includes('.')
            ? Number.parseFloat(val)
            : Number.parseInt(val, 10)
        }
        else {
          obj[prop] = val
        }
      }
    }
  }
  return obj
}

export function getValidDate(date) {
  let convertedDate = DateTime.fromISO(date)

  if (convertedDate.isValid) {
    return convertedDate
  }

  convertedDate = DateTime.fromJSDate(date)

  if (convertedDate.isValid) {
    return convertedDate
  }

  return null
}
