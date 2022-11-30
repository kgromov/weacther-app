import {Component} from '@angular/core';
import {ChartData, ChartOptions, ChartType} from 'chart.js';

export interface ExportChart {
  options: ChartOptions;
  type: ChartType;
  data: ChartData;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // '2.00,-1.00,0.00,-2.31,1.56,-14.55,-6.73,-3.42,2.17,-0.25,3.73,7.73'
  chartConfig: ExportChart = {
    data: {
      labels: [
        '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01',
        '2014-01-01', '2015-01-01', '2016-01-01', '2017-01-01',
        '2018-01-01', '2019-01-01', '2020-01-01', '2021-01-01'
      ],
      datasets: [
        {
          data: [2.00, -1.00, 0.00, -2.31, 1.56, -14.55, -6.73, -3.42, 2.17, -0.25, 3.73, 7.73],
          label: 'Label A',
          backgroundColor: 'rgba(255, 255, 0, 0.4)',
          borderColor: 'yellow',
          pointBackgroundColor: 'yellow',
          pointBorderColor: 'yellow',
          borderWidth: 2
        }
      ]
    },
    type: 'bar',
    options: {
      responsive: true,
      aspectRatio: 2,
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          min: 0,
          max: 100,
          ticks: { stepSize: 25 }
        }
      },
      elements: {
        line: {
          tension: 0
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          position: 'nearest'
        },
        legend: {
          display: false,
          position: 'top'
        }
      }
    }
  };
}
