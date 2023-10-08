import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DailyTemperatureComponent} from "./components/daily-temperature/daily-temperature.component";
import {SeasonTemperatureComponent} from "./components/season-temperature/season-temperature.component";
import {YearTemperatureComponent} from "./components/year-temperature/year-temperature.component";
import {MonthTemperatureComponent} from "./components/month-temperature/month-temperature.component";

const routes: Routes = [
  {path: '', redirectTo: '/daily', pathMatch: 'full'},
  {path: 'daily', component: DailyTemperatureComponent},
  {path: 'month', component: MonthTemperatureComponent},
  {path: 'season', component: SeasonTemperatureComponent},
  {path: 'year', component: YearTemperatureComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
