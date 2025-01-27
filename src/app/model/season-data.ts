export enum Season {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN'
}

export const MONTH_NAMES = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

export enum AggregateType {
  MIN = 'MIN',
  AVG = 'AVG',
  MAX = 'MAX'
}

export interface SeasonTemperature {
  year: number,
  season: Season,
  minTemp: number
  maxTemp: number
  avgTemp: number
}

export interface YearBySeasonTemperature {
  year: number,
  seasons: SeasonTemperature[];
}

export interface YearSummary {
  year: number,
  min: number,
  max: number,
  avg: number
  maxTempDates?: string[],
  minTempDates?: string[]
}

export interface MonthTemperature {
  year: number,
  month: number,
  minTemp: number
  maxTemp: number
  avgTemp: number
}

export interface YearByMonthTemperature {
  year: number,
  months: MonthTemperature[];
}
