import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div class="callback-wrapper">
      <span class="pi pi-spin pi-spinner callback-spinner" aria-hidden="true"></span>
      <p>Signing you in…</p>
    </div>
  `,
  styles: [`
    .callback-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 1rem;
      color: var(--color-gold, #D4AF37);
      background: var(--color-bg, #0f0f1a);
    }
    .callback-spinner {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
      color: var(--color-text-muted, #888);
      margin: 0;
    }
  `],
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    console.log("Hey there")
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.setToken(token);
      void this.router.navigate(['/dashboard'], { replaceUrl: true });
    } else {
      void this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
