export enum Category {
    ForHer = 'forHer',
    ForHim = 'forHim',
    All = 'all',
  }
  
  export interface SellerInfo {
    id: string;
    name: string;
  }
  
  export class AdminProduct {
    constructor(
      public _id?: string,
      public name?: string,
      public price?: number,
      public description?: string,
      public category?: string,
      public images?: string[],
      public stockQuantity?: number,
      public sellerinfo?: any,
      public isActive?: boolean,
      public isBestSeller?: boolean,
      public salesCount?: number,
      public createdAt?: Date,
      public updatedAt?: Date
    ) {}
  }
  