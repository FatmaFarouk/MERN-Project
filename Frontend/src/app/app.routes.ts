import { ProductComponent } from './Component/product/product.component';
import { Routes } from '@angular/router';
import { CartComponent } from './Component/cart/cart.component';
import { HomeComponent } from './Component/Home/home/home.component';
import { OrderComponent } from './Component/order/order.component';
import { UserProfileComponent } from './Component/user-profile/user-profile.component';
import { ProductDetailsComponent } from './Component/product-details/product-details.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MainComponent } from './shared/main/main.component';
import {CashierHomeComponent } from './Component/Cashier/cashier-home/cashier-home.component'
import { SloginComponent } from './auth/slogin/slogin.component';
import { SsignupComponent } from './auth/ssignup/ssignup.component';
import { AuthStaffGuardGuard } from './guard/auth-staff-guard.guard';
import {SellerProfileComponent} from './shared/seller-profile/seller-profile.component';
import { AnalysisComponent } from './Component/SuperAdmin/Analysis/analysis/analysis.component';
import { BranchesComponent } from './Component/SuperAdmin/Branches/branches/branches.component';
import { InternalOrderComponent } from './Component/SuperAdmin/Branches/internal-order/internal-order.component';
import { DeliverComponent } from './Component/SuperAdmin/clerk/deliver/deliver.component';
import { ProductListComponent } from './Component/SuperAdmin/products/product-list/product-list.component';
import { ProductDetailsAdminComponent } from './Component/SuperAdmin/products/product-details-admin/product-details-admin.component';
import { BrancheDetailsComponent } from './Component/SuperAdmin/Branches/branche-details/branche-details.component';
import { OrderListComponent } from './Component/SuperAdmin/orders/order-list/order-list.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full' }, 
    {path: 'home', component:HomeComponent},  
    {path: 'cart', component:CartComponent, canActivate: [AuthGuard]},  
    {path:'order',component:OrderComponent},
    {path: "user", component:UserProfileComponent},
    {path: "products", component:ProductComponent},
    {path: "products/:name", component:ProductComponent},
    {path: "product/:id", component:ProductDetailsComponent},
    { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  {path: 'Main',component:MainComponent,  canActivate: [AuthGuard]},
  {path:'Main/profile', component: SellerProfileComponent},
  { path: 'Seller/products', component: SellerProfileComponent,  canActivate: [AuthGuard]},
  { path: 'slogin', component: SloginComponent },
  { path: 'ssignup', component: SsignupComponent   },
  { path: 'SuperAdminAnalysis', component: AnalysisComponent   },
  {path:'ProductDetails',component:ProductDetailsAdminComponent},
  {path: 'SuperAdminBranches',
    component: BranchesComponent,
    children: [
      {
        path: 'internal-order', // Child route
        component: InternalOrderComponent,
      },
      {
        path: 'branchDetails/:branchLocation', // Child route
        component: BrancheDetailsComponent,
      }
    ],
  },
  { path: 'admProducts', component: ProductListComponent   },
  { path: 'admOrders', component: OrderListComponent   },

  {
    path:'deliver',component:DeliverComponent
  },
  { 
    path: "cashier/getInventory", canActivate: [AuthStaffGuardGuard],
    loadChildren: () => import('./Component/Cashier/Cashier.routes').then(m => m.default) 
  },
  {
  
  path: 'internal-order', // Define a route with a parameter (branchId)
  component: InternalOrderComponent,
  }
];
