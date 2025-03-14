// order-status-analysis.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Order {
  _id: string;
  Orderstatus: 'pending' | 'processing' | 'shipped' | 'canceled';
  updatedAt: Date;
}

@Component({
  selector: 'app-order-status-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Order Status Analysis</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-6 col-md-3 mb-3" *ngFor="let status of statuses">
            <div class="card status-card {{ status }}">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="text-uppercase text-muted mb-0">{{ status }}</h6>
                    <h2 class="mb-0">{{ statusCounts[status] }}</h2>
                  </div>
                  <div class="icon">
                    <span class="badge bg-{{ status }}">{{ getPercentage(status) | percent }}</span>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="progress">
                    <div class="progress-bar bg-{{ status }}" 
                         [style.width]="getPercentage(status) | percent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .status-card {
        transition: transform 0.2s;
        &:hover {
          transform: translateY(-5px);
        }
      }

      .status-card h6 {
      color: white !important; /* Ensure status text is white */
    }
      
      .progress {
        height: 4px;
      }
      .badge {
        font-size: 0.75rem;
        padding: 0.35em 0.65em;
      }
      .bg-pending { background-color: #f0ad4e; }
      .bg-processing { background-color: #5bc0de; }
      .bg-shipped { background-color: #5cb85c; }
      .bg-canceled { background-color: #d9534f; }
    `
  ]
})
export class OrderStatusAnalysisComponent implements OnChanges {
  @Input() sellerOrders: any[] = [];
  statuses: ('pending' | 'processing' | 'shipped' | 'canceled')[] = 
    ['pending', 'processing', 'shipped', 'canceled'];
  statusCounts:any = {
    pending: 0,
    processing: 0,
    shipped: 0,
    canceled: 0
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sellerOrders']) {
      this.calculateStatusCounts();
    }
  }

  private calculateStatusCounts() {
    this.statusCounts = this.sellerOrders.reduce((acc, order) => {
      acc[order.Orderstatus]++;
      return acc;
    }, { 
      pending: 0, 
      processing: 0, 
      shipped: 0, 
      canceled: 0 
    });
  }

  getPercentage(status: string): number {
    const total = this.sellerOrders.length;
    return total > 0 ? this.statusCounts[status] / total : 0;
  }
}