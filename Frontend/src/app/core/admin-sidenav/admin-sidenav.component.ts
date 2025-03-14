import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css'],
})
export class AdminSidenavComponent {
  // Temporary state for side nav toggle
  isSideNavOpen = true;

  // Temporary navigation items array
  navItems = [
    { name: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Users', route: '/admin/users', icon: 'people' },
    { name: 'Products', route: '/admin/products', icon: 'shopping_cart' },
    { name: 'Orders', route: '/admin/orders', icon: 'list_alt' },
    { name: 'Settings', route: '/admin/settings', icon: 'settings' },
  ];

  // Temporary function to toggle side nav
  toggleSideNav(): void {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  // Temporary logout function
  logout(): void {
    console.log('Logging out...');
    localStorage.clear();
  }
}