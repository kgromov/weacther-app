import {Component, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  ArcElement,
  BarController,
  BarElement, BubbleController,
  CategoryScale,
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType, DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement, PieController, PieControllerChartOptions, PieDataPoint,
  PointElement, PolarAreaController, RadarController, RadialLinearScale, ScatterController,
  Title,
  Tooltip
} from 'chart.js';
import {WeatherServiceService} from "./services/weather-service.service";
import {BsDatepickerDirective} from "ngx-bootstrap/datepicker";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {WeatherData} from "./model/weather-data";
import {Subject, takeUntil} from "rxjs";
import {formatDate} from "@angular/common";
import {ChartjsComponent} from "@ctrl/ngx-chartjs";
import {DEFAULT_CHART_CONFIG} from "./model/chart-config";

export interface ExportChart {
  options: ChartOptions;
  type: ChartType;
  data: ChartData;
}

// What you register will depend on what chart you are using and features used.
Chart.register(BarController, BarElement,
  LineController, LineElement, PointElement,
  ScatterController,
  // BubbleController,
  // PieController,
  // DoughnutController,
  PolarAreaController, RadialLinearScale, ArcElement,
  RadarController,
  CategoryScale, LinearScale, Title, Tooltip, Legend
);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  chartTypes: ChartType[] = ['bar', 'line', 'scatter', /*'bubble', 'pie', 'doughnut',*/ 'polarArea', 'radar'];
  currentDate: string = formatDate(new Date(), 'YYYY-MM-dd', this.locale);
  // auxiliary
  /* minDate: Date = new Date('2010-01-01');
   maxDate: Date = new Date('2022-12-31');*/
  data: WeatherData[] = [];
  availableYears: number[] = [1, 2, 3 , 4, 5, 6, 7, 8, 9, 10, 11, 12];
  chartConfig: ExportChart = DEFAULT_CHART_CONFIG;
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

    this.selectedDate.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(value => {
        const selectedDate: string = formatDate(value, 'YYYY-MM-dd', this.locale);
        this.weatherService.getWeatherDayInRange(selectedDate, this.years.value)
          .subscribe(data => {
            this.data = data;
            this.updateChartData(this.data);
          });
      });

    this.years.valueChanges
      .pipe(takeUntil(this.$subject))
      .subscribe(selectedYears => {
        const selectedDate: string = formatDate(this.selectedDate.value, 'YYYY-MM-dd', this.locale);
        this.weatherService.getWeatherDayInRange(selectedDate, selectedYears)
          .subscribe(data => {
            this.data = data;
            this.updateChartData(this.data);
          });
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

  ngOnDestroy(): void {
    this.$subject.next();
    this.$subject.complete();
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
