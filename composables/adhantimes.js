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
  userParameters
) {
  const prayerTimes = calculateAdhanTimesDayRaw(
    latitude,
    longitude,
    date,
    userParameters
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
  userParameters
) {
  const coordinates = new Coordinates(latitude, longitude)
  const calculationParameters
    = CalculationMethod[userParameters.calculationMethod]()

  calculationParameters.fajrAngle = userParameters.fajrAngle
  calculationParameters.ishaAngle = userParameters.ishaAngle
  calculationParameters.madhab = userParameters.madhab
  if (userParameters.ishaInterval) {
    calculationParameters.ishaInterval = userParameters.ishaInterval
  }

  if (userParameters.highLatitudeRule === 'recommended') {
    calculationParameters.highLatitudeRule
      = HighLatitudeRule.recommended(coordinates)
  }
  else {
    calculationParameters.highLatitudeRule = userParameters.highLatitudeRule
  }
  calculationParameters.adjustments = userParameters.adjustments
  calculationParameters.polarCircleResolution
    = userParameters.polarCircleResolution
  calculationParameters.rounding = userParameters.rounding
  calculationParameters.shafaq = userParameters.shafaq

  return new PrayerTimes(coordinates, date, calculationParameters)
}

export function calculateAdhanDay(latitude, longitude, date, userParameters) {
  return Object.values(
    calculateAdhanTimesDay(latitude, longitude, date, userParameters)
  )[0]
}

export function calculateAdhanMonth(latitude, longitude, date, userParameters) {
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
        userParameters
      )
    )
  }
  return month
}

function calculateMiddleOfNight(date, prayerTimes, tomorrow) {
  const maghribTime = prayerTimes.maghrib
  if (!tomorrow || !('fajr' in tomorrow)) {
    return null
  }
  const fajrTime = tomorrow?.fajr

  const halfMaghrib = maghribTime.getTime() / 2
  const halfFajr = fajrTime.getTime() / 2
  const middleOfNightTime = new Date(halfMaghrib + halfFajr + 6 * 60)

  return middleOfNightTime
}

export function nextPrayer(prayerTimes, date, tomorrow) {
  const midnightTomorrow = new Date()
  midnightTomorrow.setHours(24, 0, 0, 0)
  const midnightToday = new Date(date.getTime())
  midnightToday.setHours(0, 0, 0, 0)

  if (date >= prayerTimes.isha && date < midnightTomorrow) {
    return tomorrow?.fajr ? { prayer: 'fajr', time: tomorrow.fajr } : null
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
  const midnightTomorrow = new Date()
  midnightTomorrow.setHours(24, 0, 0, 0)
  const midnightToday = new Date(date.getTime())
  midnightToday.setHours(0, 0, 0, 0)
  const middleOfNight = calculateMiddleOfNight(date, prayerTimes, tomorrow)

  if (prayerTimes.fajr == null) {
    return null
  }
  else if (
    date >= prayerTimes.isha
    && prayerTimes.isha < (middleOfNight || midnightTomorrow)
  ) {
    return { prayer: 'isha', time: prayerTimes.isha }
  }
  else if (
    date >= prayerTimes.isha
    && prayerTimes.isha >= (middleOfNight || midnightTomorrow)
  ) {
    return null
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
