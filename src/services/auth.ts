import type { Role, User } from '../types';
import {
  getCredentials,
  getSessionUserId,
  getUsers,
  saveCredential,
  saveUser,
  setSessionUserId,
  uid,
  now,
} from './store';

// ---------------------------------------------------------------------------
// DEMO AUTHENTICATION — no real backend exists yet.
// Credentials are kept in a localStorage-backed demo store solely so the app's
// flows can be exercised end to end. This does NOT provide production
// security. Replace these functions with calls to a real auth API (sessions /
// tokens issued server-side) when a backend is available — the call sites in
// AuthContext stay the same.
// ---------------------------------------------------------------------------

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: User;
}

const AVATAR_COLORS = ['#1a7a4a', '#8b5e34', '#3a5a8c', '#7a4a8c', '#b0532a'];

export function register(name: string, email: string, password: string, role: Role): AuthResult {
  const normalized = email.trim().toLowerCase();
  if (!name.trim()) return { ok: false, error: "Ism kiritilishi shart" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return { ok: false, error: "Email formati noto'g'ri" };
  if (password.length < 6) return { ok: false, error: "Parol kamida 6 belgidan iborat bo'lsin" };
  if (getUsers().some((u) => u.email.toLowerCase() === normalized)) {
    return { ok: false, error: "Bu email allaqachon ro'yxatdan o'tgan" };
  }
  const user: User = {
    id: uid('user'),
    name: name.trim(),
    email: normalized,
    role,
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    createdAt: now(),
  };
  saveUser(user);
  saveCredential(normalized, password);
  setSessionUserId(user.id);
  return { ok: true, user };
}

export function login(email: string, password: string): AuthResult {
  const normalized = email.trim().toLowerCase();
  const user = getUsers().find((u) => u.email.toLowerCase() === normalized);
  if (!user) return { ok: false, error: 'Bunday foydalanuvchi topilmadi' };
  const creds = getCredentials();
  // Seeded demo makers accept any password in demo mode; registered users are
  // checked against the demo credential store.
  const stored = creds[normalized];
  if (stored !== undefined && stored !== password) {
    return { ok: false, error: "Parol noto'g'ri" };
  }
  setSessionUserId(user.id);
  return { ok: true, user };
}

export function logout() {
  setSessionUserId(null);
}

export function resetPassword(email: string): AuthResult {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, error: "Email formati noto'g'ri" };
  }
  // Demo mode: pretend a reset email was sent if the account exists.
  return { ok: true };
}

export function currentUser(): User | null {
  const id = getSessionUserId();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) ?? null;
}

export const DEMO_ACCOUNTS = [
  { email: 'sardor@mebelchi.uz', role: 'Usta (mebelchi)', note: "istalgan parol" },
  { email: 'jasur@mebelchi.uz', role: 'Usta (mebelchi)', note: "istalgan parol" },
];
