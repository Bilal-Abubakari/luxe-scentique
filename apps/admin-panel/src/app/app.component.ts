import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { LayoutComponent } from './layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LayoutComponent],
  template: `
    @if (isLoggedIn()) {
      <app-layout>
        <router-outlet />
      </app-layout>
    } @else {
      <router-outlet />
    }
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private readonly authService = inject(AuthService);

  isLoggedIn = signal(false);

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isAuthenticated());

    // Handle OAuth callback token in URL
    const params = new URLSearchParams(globalThis.location.search);
    const token = params.get('token');
    if (token) {
      this.authService.setToken(token);
      this.isLoggedIn.set(true);
      // Clean up URL
      globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
    }
  }
}
