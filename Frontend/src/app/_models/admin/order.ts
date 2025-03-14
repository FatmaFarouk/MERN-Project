export enum PaymentMethod {
    CreditCard = 'credit_card',
    DebitCard = 'debit_card',
    PayPal = 'paypal',
    BankTransfer = 'bank_transfer',
    CashOnDelivery = 'cash_on_delivery',
  }
  
  export enum OrderStatus {
    Pending = 'pending',
    Shipped = 'shipped',
    Canceled = 'canceled',
  }
  
  export interface OrderItem {
    _id?: string;
    productId: string;
    sellerId: string;
    quantity: number;
    price: number;
    isAvailable: boolean;
    itemStatus?: string;
    images?: string[];
  }
  
  export interface PaymentDetails {
    theRest: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    shippingAddress: string;
    paymentStatus: string;
  }
  
  export class Order {
    constructor(
      public _id?: string,
      public customerId?: string,
      public PhoneNumber?: number,
      public paymentDetails?: PaymentDetails,
      public Orderstatus?: OrderStatus,
      public updatedAt?: Date,
      public items?: OrderItem[]
    ) {}
  }
  