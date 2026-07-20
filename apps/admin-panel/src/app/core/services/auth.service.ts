import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'luxe_token';
const API_BASE = environment.apiBase;

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
      const payload = this.decodePayload(token);
      if (!payload) return false;

      const now = Math.floor(Date.now() / 1000);
      const exp = payload['exp'] as number
      if (exp < now) {
        this.removeToken();
        return false;
      }

      return true;
    } catch {
      this.removeToken();
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodePayload(token);
    if (!payload) return false;

    const role = payload['role'];
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }

  private decodePayload(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
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
