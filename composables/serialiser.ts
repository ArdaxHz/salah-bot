import { DateTime } from 'luxon'

export function customStringify(obj: any): string {
  const jsonString = JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) {
      return DateTime.fromJSDate(value).toISO()
    }
    return value
  })
  return jsonString
}

export function customParse(compressedData: string): any {
  return JSON.parse(compressedData, (key, value) => {
    if (typeof value === 'string') {
      const convertedDate = Date.parse(value)
      if (Number.isNaN(convertedDate)) {
        return value
      }
      return DateTime.fromISO(value).toJSDate()
    }
    return value
  })
}
