import { Component, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js';


@Component({
  selector: 'app-sales-chart',
  imports:[BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="chartType">
      </canvas>
    </div>
  `
})
export class SellerAnalysisComponent {
  constructor() {
    Chart.register(...registerables);  // Register all necessary components
  }
  @Input() monthlySales: number[] = [];

  // Chart configuration
  chartType: ChartType = 'line';
  chartData!: ChartData<'line'>;
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Monthly Sales Analysis ${new Date().getFullYear()}` // Now matches counted year
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months'
        },
        ticks: {
          callback: (value) => this.getMonthName(Number(value))
        }
      },
      y: {
       // beginAtZero: true,
        title: {
          display: true,
          text: 'Items Sold'
        }
      }
    }
  };

  ngOnChanges() {
    this.updateChartData();
  }

  private updateChartData() {
    this.chartData = {
      labels: Array(12).fill('').map((_, i) => i),
      datasets: [{
        label: 'Items Sold',
        data: this.monthlySales,
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        pointBackgroundColor: '#4a90e2',
        pointBorderColor: '#fff',
        tension: 0.4,
        fill: true
      }]
    };
  }

  private getMonthName(monthIndex: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
  }
}