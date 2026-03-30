'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../lib/auth';
import { Language } from '@luxe-scentique/shared-types';
import { cn } from '../../lib/utils';

interface NotificationPrefs {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface UserPreferences {
  language: Language;
  notifications: NotificationPrefs;
}

const STORAGE_KEY = 'luxe_user_preferences';

const defaultPreferences: UserPreferences = {
  language: Language.EN,
  notifications: {
    email: true,
    sms: false,
    push: false,
  },
};

function loadPreferences(): UserPreferences {
  if (globalThis.window === undefined) return defaultPreferences;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(stored) } as UserPreferences;
  } catch {
    return defaultPreferences;
  }
}

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ id, checked, onChange, label, description }: Readonly<ToggleSwitchProps>) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-onyx-100 last:border-0">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-onyx cursor-pointer">
          {label}
        </label>
        {description && <p className="text-xs text-onyx-400 mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={`${label} notifications ${checked ? 'enabled' : 'disabled'}`}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          checked ? 'bg-gold' : 'bg-onyx-200',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow',
            'transform transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setPreferences(loadPreferences());
  }, []);

  const savePreferences = (updated: UserPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch {
      // localStorage unavailable
    }
  };

  const updateLanguage = (lang: Language) => {
    const updated = { ...preferences, language: lang };
    setPreferences(updated);
    savePreferences(updated);
  };

  const updateNotification = (key: keyof NotificationPrefs, value: boolean) => {
    const updated: UserPreferences = {
      ...preferences,
      notifications: { ...preferences.notifications, [key]: value },
    };
    setPreferences(updated);
    savePreferences(updated);
  };

  // Loading skeleton while checking auth
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <output
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"
          aria-label="Loading"
        />
      </div>
    );
  }

  // Not authenticated
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-onyx py-16 text-center">
          <h1 className="font-display text-display-sm text-cream">Settings</h1>
        </div>
        <div className="container-luxury py-16 max-w-md text-center">
          <div className="bg-white rounded-xl border border-onyx-100 p-10 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-12 h-12 mx-auto mb-4 text-onyx-200"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <h2 className="font-display text-xl text-onyx mb-3">Please Sign In</h2>
            <p className="text-onyx-400 text-sm mb-6">
              You need to be signed in to access your settings and preferences.
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'}/auth/google`}
              className="btn-gold inline-block"
              aria-label="Sign in with Google to access settings"
            >
              Sign In with Google
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-onyx py-16 text-center">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Your Account</p>
        <h1 className="font-display text-display-sm text-cream">Settings</h1>
      </div>

      <div className="container-luxury py-12 max-w-2xl">
        {/* Saved confirmation */}
        {savedMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 flex-shrink-0"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Preferences saved successfully.
          </div>
        )}

        {/* Language Settings */}
        <section
          aria-labelledby="language-heading"
          className="bg-white rounded-xl border border-onyx-100 p-6 shadow-sm mb-6"
        >
          <h2 id="language-heading" className="font-display text-xl text-onyx mb-2">
            Language
          </h2>
          <p className="text-onyx-400 text-sm mb-6">
            Choose your preferred language for the Luxe Scentique experience.
          </p>

          <div className="flex gap-3" role="radiogroup" aria-labelledby="language-heading">
            {([Language.EN, Language.FR] as const).map((lang) => {
              const labels: Record<Language, string> = {
                [Language.EN]: 'English',
                [Language.FR]: 'Français',
              };
              return (
                <label
                  key={lang}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200',
                    preferences.language === lang
                      ? 'border-gold bg-gold/10 text-gold font-medium'
                      : 'border-onyx-200 text-onyx hover:border-gold/50',
                  )}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={preferences.language === lang}
                    onChange={() => updateLanguage(lang)}
                    className="sr-only"
                    aria-label={`Set language to ${labels[lang]}`}
                  />
                  <span className="text-sm font-medium">{labels[lang]}</span>
                  {preferences.language === lang && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </label>
              );
            })}
          </div>
        </section>

        {/* Notification Settings */}
        <section
          aria-labelledby="notifications-heading"
          className="bg-white rounded-xl border border-onyx-100 p-6 shadow-sm"
        >
          <h2 id="notifications-heading" className="font-display text-xl text-onyx mb-2">
            Notifications
          </h2>
          <p className="text-onyx-400 text-sm mb-4">
            Manage how you receive updates about your orders and exclusive offers.
          </p>

          <fieldset className="notifications-group">
            <legend id="notifications-heading">Notification Preferences</legend>
            <ToggleSwitch
              id="notify-email"
              label="Email Notifications"
              description="Order confirmations, shipping updates, and exclusive offers."
              checked={preferences.notifications.email}
              onChange={(val) => updateNotification('email', val)}
            />
            <ToggleSwitch
              id="notify-sms"
              label="SMS Notifications"
              description="Real-time order status updates via text message."
              checked={preferences.notifications.sms}
              onChange={(val) => updateNotification('sms', val)}
            />
            <ToggleSwitch
              id="notify-push"
              label="Push Notifications"
              description="Instant alerts in your browser for new arrivals and offers."
              checked={preferences.notifications.push}
              onChange={(val) => updateNotification('push', val)}
            />
          </fieldset>
        </section>

        <p className="text-center text-xs text-onyx-400 mt-6">
          Preferences are saved automatically to your device.
        </p>
      </div>
    </div>
  );
}
