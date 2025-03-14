export interface Product {
    productId: string;
    stock: number;
  }
  
  export interface Staff {
    cashier: string;
    clerk: string;
  }
  
  export interface Inventory {
   
    branchLocation: string;
    products: Product[];
    staff: Staff;
    createdAt?: Date;
    updatedAt?: Date;
  }