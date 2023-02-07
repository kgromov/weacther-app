export enum Season {
  WINTER = 'WINTER',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN'
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
