import { Component, inject, OnInit, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CardModule, DividerModule, RippleModule],
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

      .error-banner {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
        background: rgba(220, 38, 38, 0.1);
        border: 1px solid rgba(220, 38, 38, 0.3);
        border-radius: 10px;
        color: #fca5a5;

        .pi {
          font-size: 1.1rem;
          color: #f87171;
          margin-top: 0.1rem;
          flex-shrink: 0;
        }

        p {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
        }
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
  private readonly route = inject(ActivatedRoute);

  errorMessage = signal('');

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      void this.router.navigate(['/dashboard']);
      return;
    }

    const error = this.route.snapshot.queryParamMap.get('error');
    if (error === 'unauthorized') {
      this.errorMessage.set(
        'Access denied. Your account is not authorized to access the admin panel. Please contact an administrator if you believe this is an error.'
      );
    }
  }

  signInWithGoogle(): void {
    this.errorMessage.set('');
    this.authService.login();
  }
}
