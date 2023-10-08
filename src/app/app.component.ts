import {Component} from '@angular/core';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Title,
  Tooltip
} from 'chart.js';


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
export class AppComponent {
  currentYear: number = new Date().getFullYear();
  dailyView: boolean = true;
  monthView: boolean = false;
  seasonView: boolean = false;
  yearView: boolean = false;

  selectDailyView(): void {
    this.dailyView = true;
    this.monthView = false;
    this.seasonView = false;
    this.yearView = false;
  }

  selectMonthView(): void {
    this.dailyView = false;
    this.monthView = true;
    this.seasonView = false;
    this.yearView = false;
  }

  selectSeasonView(): void {
    this.dailyView = false;
    this.monthView = false;
    this.seasonView = true;
    this.yearView = false;
  }

  selectYearView(): void {
    this.dailyView = false;
    this.monthView = false;
    this.seasonView = false;
    this.yearView = true;
  }
}
