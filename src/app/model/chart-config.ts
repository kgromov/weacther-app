import {ChartData, ChartOptions, ChartType} from "chart.js";

export interface ExportChart {
  options: ChartOptions;
  type: ChartType;
  data: ChartData;
}

export const DAILY_CHART_CONFIG: ExportChart  = {
  data: {
    labels: [
      /* '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01',
       '2014-01-01', '2015-01-01', '2016-01-01', '2017-01-01',
       '2018-01-01', '2019-01-01', '2020-01-01', '2021-01-01'*/
    ],
    datasets: [
      {
        data: [/*2.00, -1.00, 0.00, -2.31, 1.56, -14.55, -6.73, -3.42, 2.17, -0.25, 3.73, 7.73*/],
        label: 'Morning',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'yellow',
        pointBackgroundColor: 'yellow',
        pointBorderColor: 'yellow',

        borderWidth: 2
      },
      {
        data: [/*3.00, -1.00, 0.00, 4.25, 2.00, -6.55, -5.36, 1.55, 6.09, 1.00, 4.33, 10.55*/],
        label: 'Afternoon',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'orange',
        pointBackgroundColor: 'orange',
        pointBorderColor: 'red',
        borderWidth: 2
      },
      {
        data: [/*20.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00*/],
        label: 'Evening',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'cyan',
        pointBackgroundColor: 'cyan',
        pointBorderColor: 'cyan',
        borderWidth: 2
      },
      {
        data: [/*1.00, -6.00, 0.00, -4.00, 0.00, -15.82, -7.55, -5.81, -0.22, -1.67, 2.92, 9.23*/],
        label: 'Night',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'blue',
        pointBackgroundColor: 'blue',
        pointBorderColor: 'blue',
        borderWidth: 2
      }
    ]
  },
  type: 'line',
  options: {
    responsive: true,
    aspectRatio: 2,
    /* scales: {
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
     },*/
    plugins: {
      tooltip: {
        enabled: true,
        position: 'nearest'
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      }
    }
  }
};

export const SEASONS_CHART_CONFIG: ExportChart  = {
  data: {
    labels: [
      /* '2010', '2011', ... '2023'*/
    ],
    datasets: [
      {
        data: [/*2.00, -1.00, 0.00, -2.31, 1.56, -14.55, -6.73, -3.42, 2.17, -0.25, 3.73, 7.73*/],
        label: 'Winter',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'cyan',
        pointBackgroundColor: 'blue',
        pointBorderColor: 'blue',

        borderWidth: 2
      },
      {
        data: [/*3.00, -1.00, 0.00, 4.25, 2.00, -6.55, -5.36, 1.55, 6.09, 1.00, 4.33, 10.55*/],
        label: 'Spring',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'lime',
        pointBackgroundColor: 'green',
        pointBorderColor: 'green',
        borderWidth: 2
      },
      {
        data: [/*20.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00*/],
        label: 'Summer',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'orange',
        pointBackgroundColor: 'orange',
        pointBorderColor: 'red',
        borderWidth: 2
      },
      {
        data: [/*1.00, -6.00, 0.00, -4.00, 0.00, -15.82, -7.55, -5.81, -0.22, -1.67, 2.92, 9.23*/],
        label: 'Autumn',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'yellow',
        pointBackgroundColor: 'orange',
        pointBorderColor: 'orange',
        borderWidth: 2
      }
    ]
  },
  type: 'line',
  options: {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      tooltip: {
        enabled: true,
        position: 'nearest'
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      }
    }
  }
};

export const YEAR_SUMMARY_CHART_CONFIG: ExportChart  = {
  data: {
    labels: [
      /* '2010', '2011', ... '2023'*/
    ],
    datasets: [
      {
        data: [/*2.00, -1.00, 0.00, -2.31, 1.56, -14.55, -6.73, -3.42, 2.17, -0.25, 3.73, 7.73*/],
        label: 'Min',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'cyan',
        pointBackgroundColor: 'blue',
        pointBorderColor: 'blue',

        borderWidth: 2
      },
      {
        data: [/*3.00, -1.00, 0.00, 4.25, 2.00, -6.55, -5.36, 1.55, 6.09, 1.00, 4.33, 10.55*/],
        label: 'Average',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'lime',
        pointBackgroundColor: 'green',
        pointBorderColor: 'green',
        borderWidth: 2
      },
      {
        data: [/*20.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00*/],
        label: 'Max',
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
        borderColor: 'orange',
        pointBackgroundColor: 'orange',
        pointBorderColor: 'red',
        borderWidth: 2
      }
    ]
  },
  type: 'line',
  options: {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      tooltip: {
        enabled: true,
        position: 'nearest'
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      }
    }
  }
};
