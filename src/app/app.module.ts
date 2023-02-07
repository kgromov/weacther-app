import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {ChartjsModule} from "@ctrl/ngx-chartjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { DailyTemperatureComponent } from './components/daily-temperature/daily-temperature.component';
import { SeasonTemperatureComponent } from './components/season-temperature/season-temperature.component';
import { YearTemperatureComponent } from './components/year-temperature/year-temperature.component';
import {AppRoutingModule} from "./app.routing";
import { AbstractTemperatureDirective } from './components/abstract-temperature.directive';

@NgModule({
  declarations: [
    AppComponent,
    DailyTemperatureComponent,
    SeasonTemperatureComponent,
    YearTemperatureComponent,
    AbstractTemperatureDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartjsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
