import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-profit-analysis',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe],
  template: `
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Sales Analysis</h5>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-0">Total Approved Sales</p>
                <h2 class="text-primary">{{ totalSales | currency }}</h2>
              </div>
              <div class="icon-shape bg-primary text-white rounded-circle">
                <i class="bi bi-currency-dollar"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Profit Analysis</h5>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="mb-0">Estimated Profit (10%)</p>
                <h2 class="text-success">{{ totalProfit | currency }}</h2>
              </div>
              <div class="progress" style="height: 10px; width: 100px">
                <div class="progress-bar bg-success" 
                     [style.width]="profitPercentage + '%'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./seller-analysis.component.css']
})
export class ProfitAnalysisComponent implements OnChanges {
  @Input() sellerOrders: any[] = [];
  totalSales = 0;
  totalProfit = 0;
  profitPercentage = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sellerOrders']) {
      this.calculateMetrics();
    }
  }

  private calculateMetrics() {
    this.totalSales = 0;
    
    // Calculate total sales from approved items
    this.sellerOrders.forEach(order => {
      order.items.forEach((item: any) => {
        if (item.itemStatus === 'approved') {
          this.totalSales += item.quantity * item.price;
        }
      });
    });

    // Calculate profit (10% of total sales)
    this.totalProfit = this.totalSales * 0.10;
    
    // Calculate profit percentage (for visualization)
    const maxProfit = this.totalSales * 0.20; // Assuming max possible is 20%
    this.profitPercentage = maxProfit > 0 
      ? (this.totalProfit / maxProfit) * 100 
      : 0;
  }
}