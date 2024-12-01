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
        if (typeof val === 'string' && !Number.isNaN(val)) {
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

export function isDifferentDate(date1, date2) {
  const year1 = date1.getFullYear()
  const month1 = date1.getMonth()
  const day1 = date1.getDate()

  const year2 = date2.getFullYear()
  const month2 = date2.getMonth()
  const day2 = date2.getDate()

  return year1 !== year2 || month1 !== month2 || day1 !== day2
}
