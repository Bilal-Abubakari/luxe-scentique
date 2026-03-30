import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'luxe_token';
const API_BASE = 'http://localhost:3003/api/v1';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT payload to check expiry
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload['exp'] && payload['exp'] < now) {
        this.removeToken();
        return false;
      }

      return true;
    } catch {
      this.removeToken();
      return false;
    }
  }

  getAuthHeaders(): { Authorization: string } {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token ?? ''}`,
    };
  }

  login(): void {
    const redirectUri = encodeURIComponent(`${globalThis.location.origin}/auth/callback`);
    globalThis.location.href = `${API_BASE}/auth/google?redirect_uri=${redirectUri}`;
  }

  logout(): void {
    this.removeToken();
    void this.router.navigate(['/login']);
  }
}
