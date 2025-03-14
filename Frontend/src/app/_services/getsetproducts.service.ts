import { Injectable,signal,computed ,OnInit} from '@angular/core';
import {SellerauthaddService} from '../_services/sellerauthadd.service';

interface OrderAnalysis {
  totalOrders: number;
 // pendingOrders: number;
  //completedOrders: number;
  totalRevenue: number;
 // averageOrderValue: number;
  popularProducts: Array<[string, number]>;
}

@Injectable({
  providedIn: 'root'
})
export class GetsetproductsService implements OnInit{
  sellerOrders = signal<any[]>([]);
  sellerProducts = signal<any[]>([]);
  currentSellerId:any ;

  constructor(private authService: SellerauthaddService) { }
  ngOnInit(): void {
    const userId = this.authService.getUserId(); 
    this.currentSellerId = this.authService.getUserId();
  }

  //total orders
  totalOrders = computed(() => 
    this.sellerOrders().filter(order => 
      order.items.some((item: any) => item.sellerId === this.currentSellerId)
    ).length
  );

  //total revenue 
  totalRevenue = computed(() => 
    this.sellerOrders()
      .filter(order => order.status === 'completed')
      .reduce((acc, order) => {
        const sellerItems = order.items.filter((item: any) => 
          item.sellerId === this.currentSellerId
        );
        return acc + sellerItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      }, 0)
  );

  // Updated popular products calculation
  popularProducts = computed(() => {
    this.currentSellerId = this.authService.getUserId();
    const productCount = new Map<string, number>();
    const orders = this.sellerOrders();
    orders.forEach(order => {
           order.items
          .filter((item: any) => {
            return item.sellerId === this.currentSellerId && item.itemStatus === 'approved';
          })
          .forEach((item: any) => {
            const currentCount = productCount.get(item.productId) || 0;
            productCount.set(item.productId, currentCount + item.quantity);
          });
    });

    const sortedProducts = Array.from(productCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return sortedProducts;
});



  //inventory analysis 
  getInventoryAnalysis() {
    return {
      totalProducts: this.sellerProducts().length,
      lowStock: this.sellerProducts().filter(p => p.stockQuantity < 10).length,
      averagePrice: this.sellerProducts().reduce((acc, p) => acc + p.price, 0) / this.sellerProducts().length
    };
  }

  getSalesAnalysis(): OrderAnalysis {
    return {
      totalOrders: this.totalOrders(),
     // pendingOrders: this.orderStatusAnalysis().pending,
     // completedOrders: this.orderStatusAnalysis().completed,
      totalRevenue: this.totalRevenue(),
    //  averageOrderValue: this.totalRevenue() / (this.orderStatusAnalysis().completed || 1),
      popularProducts: this.popularProducts()
    };
  }

  


  setProducts(products: any[]) {
    this.sellerProducts.set(products);
  }

  getProducts() {
    return this.sellerProducts();
  }

  setOrders(orders: any[]) { this.sellerOrders.set(orders); }
  getOrders() {
    return this.sellerOrders();
  }
}
