import { DateTime } from 'luxon'
import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  PrayerTimes,
} from 'adhan'
import HijrahDate from 'hijrah-date'

const HijriMonths = {
  SHORTMONTH: [
    'Muh',
    'Saf',
    'Rab I',
    'Rab II',
    'Jum I',
    'Jum II',
    'Raj',
    'Sha',
    'Ram',
    'Shaw',
    'Dhuʻl-Q',
    'Dhuʻl-H',
  ],
  STANDALONEMONTH: [
    'Muharram',
    'Safar',
    'Rabiʻ I',
    'Rabiʻ II',
    'Jumada I',
    'Jumada II',
    'Rajab',
    'Shaʻban',
    'Ramadan',
    'Shawwal',
    'Dhuʻl-Qiʻdah',
    'Dhuʻl-Hijjah',
  ],
}

const salaahs = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

export function convertToHijri(date) {
  const hijriDate = new HijrahDate(date)
  return {
    date: hijriDate,
    month_long: HijriMonths.STANDALONEMONTH[hijriDate._monthOfYear - 1],
    month_short: HijriMonths.SHORTMONTH[hijriDate._monthOfYear - 1],
  }
}

export function calculateAdhanTimesDay(
  latitude,
  longitude,
  date,
  customParams
) {
  const prayerTimes = calculateAdhanTimesDayRaw(
    latitude,
    longitude,
    date,
    customParams
  )

  const formattedDate = DateTime.fromJSDate(date).toISODate()
  const day = {}
  day[formattedDate] = {
    ...prayerTimes,
    prayerTimes,
    hijri: convertToHijri(formattedDate),
  }
  return day
}

export function calculateAdhanTimesDayRaw(
  latitude,
  longitude,
  date,
  customParams
) {
  const coordinates = new Coordinates(latitude, longitude)

  const paramsToUse = CalculationMethod[customParams.method.value]()
  paramsToUse.fajrAngle = customParams.fajrAngle.value
  paramsToUse.madhab = customParams.madhab.value

  const prayerTimes = new PrayerTimes(coordinates, date, paramsToUse)
  paramsToUse.highLatitudeRule = HighLatitudeRule.recommended(coordinates)
  const prayerTimesIshaChanged = new PrayerTimes(
    coordinates,
    date,
    paramsToUse
  )

  // if (checkTimeWithinRange(prayerTimes.fajr, prayerTimes.isha, 5)) {
  //     const newIshaTime = new Date(prayerTimes.maghrib.getTime() + 60 * 60 * 1000);
  //     prayerTimes.isha = newIshaTime;
  // }

  prayerTimes.isha = prayerTimesIshaChanged.isha
  return prayerTimes
}

export function calculateAdhanDay(latitude, longitude, date, customParams) {
  return Object.values(
    calculateAdhanTimesDay(latitude, longitude, date, customParams)
  )[0]
}

export function calculateAdhanTomorrow() {}

export function calculateAdhanMonth(latitude, longitude, date, customParams) {
  let month = {}
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()

  for (let i = 1; i <= daysInMonth; i++) {
    const dailyDate = new Date(date.getFullYear(), date.getMonth(), i, 12, 0)
    month = Object.assign(
      month,
      calculateAdhanTimesDay(
        latitude,
        longitude,
        DateTime.fromJSDate(dailyDate),
        customParams
      )
    )
  }
  return month
}

export function nextPrayer(prayerTimes, date, tomorrow) {
  const midnightTomorrow = new Date()
  midnightTomorrow.setHours(24, 0, 0, 0)
  const midnightToday = new Date(date.getTime())
  midnightToday.setHours(0, 0, 0, 0)

  if (date >= prayerTimes.isha && date < midnightTomorrow) {
    return null
  }
  else if (date >= prayerTimes.maghrib) {
    return { prayer: 'isha', time: prayerTimes.isha }
  }
  else if (date >= prayerTimes.asr) {
    return { prayer: 'maghrib', time: prayerTimes.maghrib }
  }
  else if (date >= prayerTimes.dhuhr) {
    return { prayer: 'asr', time: prayerTimes.asr }
  }
  else if (date >= prayerTimes.sunrise) {
    return { prayer: 'dhuhr', time: prayerTimes.dhuhr }
  }
  else if (date >= prayerTimes.fajr) {
    return { prayer: 'sunrise', time: prayerTimes.sunrise }
  }
  else if (date >= midnightToday) {
    return { prayer: 'fajr', time: prayerTimes.fajr }
  }
  else {
    return null
  }
}

export function currentPrayer(prayerTimes, date, tomorrow) {
  if (date >= prayerTimes.isha) {
    return { prayer: 'isha', time: prayerTimes.isha }
  }
  else if (date >= prayerTimes.maghrib) {
    return { prayer: 'maghrib', time: prayerTimes.maghrib }
  }
  else if (date >= prayerTimes.asr) {
    return { prayer: 'asr', time: prayerTimes.asr }
  }
  else if (date >= prayerTimes.dhuhr) {
    return { prayer: 'dhuhr', time: prayerTimes.dhuhr }
  }
  else if (date >= prayerTimes.sunrise) {
    return { prayer: 'sunrise', time: prayerTimes.sunrise }
  }
  else if (date >= prayerTimes.fajr) {
    return { prayer: 'fajr', time: prayerTimes.fajr }
  }
  else {
    return null
  }
}
