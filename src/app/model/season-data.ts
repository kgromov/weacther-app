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
  MAX = 'MAX',
  MIN = 'MIN',
  AVG = 'AVG'
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
