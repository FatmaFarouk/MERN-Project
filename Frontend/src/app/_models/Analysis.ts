
export interface OrdersAnalysis {
    ordersallmonths: number[];
    ordersnumber: number;
    salesallmonths: number[];
    totalSales:number;
    ordersStatus: number[];
    pendingorders:number;
    shippedorders:number;
    canceled:number;
  }
  
  export interface UserAnalysis {
    customersAllMonths: number[];
    customerCount: number;
  }
  
  
  export interface Analysis {
    ordersanalysis: OrdersAnalysis;
    UseraAnalysis: UserAnalysis;
  }

  export interface StockAnalysis {
    ProductStockBranches: number[];
    BranchesNames: string[];
  }
  
  export interface RevenueAnalysis {
    ProductRevenueBranches: number[];
  }
  
  export interface ProductAnalysis {
    StockAnalysis: StockAnalysis;
    RevenueAnalysis: RevenueAnalysis;
  }