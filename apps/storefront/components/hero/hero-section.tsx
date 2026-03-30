'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '../../lib/utils';

export function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-onyx"
      aria-label="Hero section — Luxe Scentique"
    >
      {/* Background Image */}
      {imageError ? (
        /* Fallback gradient when image fails */
        <div
          className="absolute inset-0 bg-gradient-to-br from-onyx-900 via-onyx to-onyx-800"
          aria-hidden="true"
        />
      ) : (
        <Image
          src="/images/hero-1.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
          onError={() => setImageError(true)}
          aria-hidden="true"
          sizes="100vw"
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-hero-gradient" aria-hidden="true" />

      {/* Decorative gold line top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gold-gradient opacity-60"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container-luxury text-center px-6">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          <p
            className={cn(
              'text-gold font-medium tracking-[0.3em] uppercase text-sm mb-6',
              'opacity-0 animate-fade-in',
            )}
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            The Classic Sophisticate
          </p>

          {/* Main Heading */}
          <h1
            className={cn(
              'font-display text-display-lg md:text-display-xl text-cream mb-6',
              'text-balance leading-tight',
              'opacity-0 animate-fade-in-up',
            )}
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            Wear Your <span className="text-gold-gradient italic">Essence</span>
          </h1>

          {/* Subtitle */}
          <p
            className={cn(
              'text-cream/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed',
              'opacity-0 animate-fade-in-up',
            )}
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            Discover a curated world of luxury fragrances — where each bottle tells a story of
            craftsmanship, heritage, and uncompromising quality.
          </p>

          {/* CTA Buttons */}
          <div
            className={cn(
              'flex flex-col sm:flex-row items-center justify-center gap-4',
              'opacity-0 animate-fade-in-up',
            )}
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          >
            <Link
              href="/shop"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded',
                'bg-gold text-onyx font-medium text-base',
                'hover:bg-gold-500 hover:shadow-gold-lg transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx',
                'group',
              )}
              aria-label="Explore our fragrance collection"
            >
              Explore Collection
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>

            <Link
              href="/about"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4 rounded',
                'border-2 border-cream/50 text-cream font-medium text-base',
                'hover:border-gold hover:text-gold transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx',
              )}
              aria-label="Learn about our story and brand"
            >
              Our Story
            </Link>
          </div>

          {/* Stats / Trust indicators */}
          <div
            className={cn(
              'mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16',
              'opacity-0 animate-fade-in',
            )}
            style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}
          >
            {[
              { value: '500+', label: 'Fragrances' },
              { value: '100%', label: 'Authentic' },
              { value: 'Free', label: 'Shipping over GHS 500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl text-gold font-semibold">{stat.value}</p>
                <p className="text-cream/60 text-xs uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce"
        aria-hidden="true"
      >
        <span className="text-cream text-xs uppercase tracking-widest">Scroll</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gold"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {/* Decorative gold line bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gold-gradient opacity-30"
        aria-hidden="true"
      />
    </section>
  );
}
