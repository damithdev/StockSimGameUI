import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

@Component({
  selector: 'app-menu-my-statistics',
  templateUrl: './menu-my-statistics.component.html',
  styleUrls: ['./menu-my-statistics.component.scss']
})
export class MenuMyStatisticsComponent implements OnInit {

  chart = []

  constructor() { }

  ngOnInit() {

    var games = ['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5', 'Game 6', 'Game 7', 'Game 8']

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: games,
        datasets: [{
          label: 'Your Income',
          data: [1100, 100, 1300, 1600, 300, 500, 50, 900],
          fill: false,
          backgroundColor: "#ff5722",
          borderColor: "#ff5722",
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    })
  }

}
