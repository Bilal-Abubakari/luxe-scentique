import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, DividerModule, RippleModule],
  templateUrl: './login.component.html',
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: var(--color-onyx);
      }

      .login-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1.5rem;
        background: radial-gradient(
          ellipse at center,
          rgba(212, 175, 55, 0.05) 0%,
          var(--color-onyx) 70%
        );
      }

      .login-card {
        width: 100%;
        max-width: 440px;
        background: var(--color-surface) !important;
        border: 1px solid var(--color-border) !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
        overflow: hidden;
      }

      .login-card ::ng-deep .p-card-body {
        padding: 2.5rem !important;
      }

      .login-card ::ng-deep .p-card-content {
        padding: 0 !important;
      }

      .brand-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .brand-logo-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 200px;
        margin-bottom: 1.25rem;
      }

      .brand-logo-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .brand-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--color-gold);
        margin: 0 0 0.25rem;
        letter-spacing: 0.03em;
      }

      .brand-tagline {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin: 0;
      }

      .login-divider {
        margin: 1.5rem 0;
      }

      .login-heading {
        font-size: 1rem;
        color: var(--color-text-secondary);
        text-align: center;
        margin: 0 0 1.5rem;
        font-weight: 400;
      }

      .google-btn {
        width: 100%;
        justify-content: center;
        gap: 0.75rem;
        padding: 0.875rem 1.5rem !important;
        font-size: 0.95rem !important;
        font-weight: 600 !important;
        background: var(--color-gold) !important;
        border-color: var(--color-gold) !important;
        color: var(--color-onyx) !important;
        border-radius: 10px !important;
        transition: all 0.2s ease !important;

        &:hover:not(:disabled) {
          background: var(--color-gold-light) !important;
          border-color: var(--color-gold-light) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35) !important;
        }

        &:focus-visible {
          outline: 2px solid var(--color-gold) !important;
          outline-offset: 3px !important;
        }
      }

      .google-icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
      }

      .google-svg {
        width: 18px;
        height: 18px;
      }

      .login-footer {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.78rem;
        color: var(--color-text-muted);

        a {
          color: var(--color-gold);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      void this.router.navigate(['/dashboard']);
    }
  }

  signInWithGoogle(): void {
    this.authService.login();
  }
}
