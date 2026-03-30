import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    RippleModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);

  isSidebarOpen = signal(true);
  isMobile = signal(false);

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      route: '/dashboard',
      ariaLabel: 'Navigate to Dashboard',
    },
    {
      label: 'Inventory',
      icon: 'pi pi-box',
      route: '/inventory',
      ariaLabel: 'Navigate to Inventory Management',
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-bag',
      route: '/orders',
      ariaLabel: 'Navigate to Orders Management',
    },
    {
      label: 'POS Sale',
      icon: 'pi pi-credit-card',
      route: '/pos',
      ariaLabel: 'Navigate to Point of Sale',
    },
  ];

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkMobile();
  }

  constructor() {
    this.checkMobile();
  }

  private checkMobile(): void {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) {
      this.isSidebarOpen.set(false);
    } else {
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }
}
