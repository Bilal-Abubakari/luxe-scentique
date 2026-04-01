'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getToken, removeToken } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/track', label: 'Track Order' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Trap focus and close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    removeToken();
    setIsLoggedIn(false);
    globalThis.location.href = '/';
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-onyx/95 backdrop-blur-md shadow-onyx'
          : 'bg-onyx/80 backdrop-blur-sm',
      )}
      aria-label="Main navigation"
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group focus-visible:ring-2 focus-visible:ring-gold rounded"
            aria-label="Luxe Scentique — Go to homepage"
          >
            <Image
              src="/images/logo.png"
              alt="Luxe Scentique"
              width={160}
              height={48}
              className="h-10 w-auto object-contain transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded',
                      'focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
                      'gold-underline',
                      isActive
                        ? 'text-gold'
                        : 'text-cream hover:text-gold',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    data-active={isActive}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/settings"
                  className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center hover:bg-gold/30 transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Go to settings"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gold"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-onyx-300 hover:text-cream transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded px-2 py-1"
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <a
                href={`${API_BASE}/auth/google`}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-onyx text-sm font-medium rounded hover:bg-gold-500 transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx"
                aria-label="Sign in with your Google account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    fill="#0F0F0F"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#0F0F0F"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#0F0F0F"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#0F0F0F"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In
              </a>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-cream hover:text-gold transition-colors rounded focus-visible:ring-2 focus-visible:ring-gold"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-onyx-700',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container-luxury py-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-3 text-sm font-medium rounded transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none',
                  isActive
                    ? 'text-gold bg-gold/10'
                    : 'text-cream hover:text-gold hover:bg-white/5',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-onyx-700">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 px-4 py-3">
                <Link
                  href="/settings"
                  className="text-sm text-cream hover:text-gold transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  Settings
                </Link>
                <span className="text-onyx-600">·</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-onyx-300 hover:text-cream transition-colors focus-visible:ring-2 focus-visible:ring-gold rounded"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <a
                href={`${API_BASE}/auth/google`}
                className="flex items-center justify-center gap-2 mx-4 py-3 bg-gold text-onyx text-sm font-medium rounded hover:bg-gold-500 transition-colors focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Sign in with Google"
              >
                Sign In with Google
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
