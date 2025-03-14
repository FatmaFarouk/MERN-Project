export interface Inventory {
    
  _id:string;
  branchId:string
    branchLocation: string;
    products: InventoryProduct[];
    staff: InventoryStaff;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface InventoryProduct {
    productId: string; 
    stock: number;
  }
  
  export interface InventoryStaff {
    cashier?: string;
    clerk?: string;
  }