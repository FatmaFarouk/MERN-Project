import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AnalysisComponent } from './Component/SuperAdmin/Analysis/analysis/analysis.component';
import { OrderListComponent } from "./Component/SuperAdmin/orders/order-list/order-list.component";
import { ProductListComponent } from "./Component/SuperAdmin/products/product-list/product-list.component";
import { AdminSidenavComponent } from "./core/admin-sidenav/admin-sidenav.component";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    CommonModule,
    MatSidenavModule,
    AnalysisComponent,
    OrderListComponent,
    ProductListComponent,
    AdminSidenavComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Project';
  hideHeaderAndFooter = false;
  hiddenRoutes = [
    '/cashier/getInventory',
    '/cashier/getInventory/checkout',
    '/SuperAdminAnalysis',
                  '/SuperAdminBranches','/SuperAdminBranches/internal-order','/deliver',
                  '/SuperAdminBranches/branchDetails/:branchLocation','/ProductDetails','/admProducts','/admOrders', // Add all routes where you want to hide header/footer
    '/SuperAdminBranches',
    '/SuperAdminBranches/internal-order',
    '/deliver',
    '/Main','/Seller/products','/Main/profile'
  ]; // Add all routes where you want to hide header/footer

                  constructor(private router: Router) {
                    this.router.events.subscribe((event) => {
                      if (event instanceof NavigationEnd) {
                        this.hideHeaderAndFooter = this.isRouteHidden(event.url);
                      }
                    });
                  }
                
                  isRouteHidden(url: string): boolean {
                    return this.hiddenRoutes.some((route) => {
                      // Convert route pattern to a regex to match dynamic parameters
                      const routePattern = route.replace(/:[^/]+/g, '[^/]+'); // Replace :param with a regex pattern
                      const regex = new RegExp(`^${routePattern}$`);
                      return regex.test(url);
                    });
                  }
}
