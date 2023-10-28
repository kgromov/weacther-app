import {Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WeatherServiceService} from "../../services/weather-service.service";
import {Subject} from "rxjs";
import {ChartDataset, ChartType} from "chart.js";
import {formatDate} from "@angular/common";
import {SyncStatus, WeatherData} from "../../model/weather-data";
import {DAILY_CHART_CONFIG, ExportChart} from "../../model/chart-config";
import {BsDatepickerDirective} from "ngx-bootstrap/datepicker";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-daily-temperature',
  templateUrl: './daily-temperature.component.html'
})
export class DailyTemperatureComponent implements OnInit, OnDestroy {
  chartTypes: ChartType[] = ['bar', 'line', 'scatter', /*'bubble', 'pie', 'doughnut',*/ 'polarArea', 'radar'];
  data: WeatherData[] = [];
  availableYears: number[] = [];
  // latestDate: string = formatDate(new Date(), 'YYYY-MM-dd', this.locale);
  latestDate: string | undefined;
  chartConfig: ExportChart = DAILY_CHART_CONFIG;
  private $subject: Subject<void> = new Subject<void>();

  // @ts-ignore
  @ViewChild(BsDatepickerDirective, {static: false}) datepicker: BsDatepickerDirective;
  // @ts-ignore
  @ViewChild(ChartjsComponent, {static: false}) chart: ChartjsComponent;
  // @ts-ignore
  form: FormGroup;

  constructor(@Inject(LOCALE_ID) public locale: string,
              private weatherService: WeatherServiceService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      selectedDate: null,
      years: null
    });

    this.weatherService.getYearsToShow()
      .subscribe(yearsRange => {
        console.log('Years range = ', yearsRange);
        const years: number = yearsRange?.maxYear - yearsRange?.minYear + 1;
        this.availableYears = [...Array(years || 14).keys()].map(i => i + 1)
      });

    this.selectedDate.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(value => {
        const selectedDate: string = formatDate(value, 'YYYY-MM-dd', this.locale);
        this.fetchData(selectedDate, this.years.value);
      });

    this.years.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(selectedYears => {
        const selectedDate: string = formatDate(this.selectedDate.value, 'YYYY-MM-dd', this.locale);
        this.fetchData(selectedDate, selectedYears);
      });

    this.selectedDate.patchValue(new Date());
  }

  private get selectedDate(): FormControl {
    return this.form.get('selectedDate') as FormControl;
  }

  public get years(): FormControl {
    return this.form.get('years') as FormControl;
  }

  onTypeChanged(chartType: string) {
    console.log('Selected type = ', chartType);
    // @ts-ignore
    this.chartConfig.type = chartType;
  }

  onYearsChanged(year: number) {
    console.log('Selected year = ', year);
    this.years.setValue(year);
  }

  reloadDataOnSync(syncStatus: SyncStatus): void {
    if (syncStatus.code === HttpStatusCode.Ok) {
      const selectedDate: string = formatDate(this.selectedDate.value, 'YYYY-MM-dd', this.locale);
      this.fetchData(selectedDate, this.years.value);
    }
  }

  ngOnDestroy(): void {
    this.$subject.next();
    this.$subject.complete();
  }

  private fetchData(selectedDate: string, yearsToShow: number): void {
    this.weatherService.getWeatherDayInRange(selectedDate, yearsToShow)
      .subscribe(data => {
        this.data = data;
        this.latestDate = this.data[this.data.length - 1].date;
        console.log('Daily view: latestDate = ', this.latestDate);
        this.updateChartData(this.data);
      });
  }

  private updateChartData(weatherData: WeatherData[]): void {
    const labelsData: any[] = [];
    const morningData: any[] = [];
    const afternoonData: any[] = [];
    const eveningData: any[] = [];
    const nightData: any[] = [];
    weatherData.forEach(dayData => {
      labelsData.push(dayData.date);
      morningData.push(dayData.morningTemperature);
      afternoonData.push(dayData.afternoonTemperature);
      eveningData.push(dayData.eveningTemperature);
      nightData.push(dayData.nightTemperature);
    });

    this.chartConfig.data.labels = [...labelsData];
    const datasets: ChartDataset[] = this.chartConfig.data.datasets;
    datasets[0].data = [...morningData];
    datasets[1].data = [...afternoonData];
    datasets[2].data = [...eveningData];
    datasets[3].data = [...nightData];
    console.log('Chart data: ', this.chartConfig);
    // to trigger refresh
    this.chart.updateChart();
  }

}
