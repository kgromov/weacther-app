import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {YearByMonthTemperature, YearBySeasonTemperature, YearSummary} from "../model/season-data";
import {SyncStatus} from "../model/weather-data";

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public getYearSummary(years?: number): Observable<YearSummary[]> {
    const params = this.getYearsToShowParams(years);
    return this.http.get<YearSummary[]>(`${this.baseUrl}/weather/summary`, {params: params});
  }

  public getSeasonsTemperature(years?: number): Observable<YearBySeasonTemperature[]> {
    const params = this.getYearsToShowParams(years);
    return this.http.get<YearBySeasonTemperature[]>(`${this.baseUrl}/weather/seasons`, {params: params});
  }

  public getMonthTemperature(years?: number): Observable<YearByMonthTemperature[]> {
    const params = this.getYearsToShowParams(years);
    return this.http.get<YearByMonthTemperature[]>(`${this.baseUrl}/weather/months`, {params: params});
  }

  public isSynced(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/isSynced`);
  }

  public syncTemperature(): Observable<SyncStatus> {
    return this.http.get<SyncStatus>(`${this.baseUrl}/sync`);
  }

  private getYearsToShowParams(years: number | undefined) {
    const params: any = {};
    if (years) {
      params.years = years;
    }
    return params;
  }
}
