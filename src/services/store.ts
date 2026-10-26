import type {
  CatalogItem,
  DesignRequest,
  MakerService,
  Order,
  OrderStatus,
  PortfolioItem,
  User,
} from '../types';
import { ORDER_STATUS_FLOW } from '../types';
import { seedCatalog, seedMakers, seedPortfolio, seedServices } from '../data/seed';

// ---------------------------------------------------------------------------
// Demo data layer.
// There is no backend in this project. All data is stored in localStorage and
// seeded on first run. This is DEMO behavior only — it does not provide
// production-level security. A real API can replace these functions later
// without changing the components that call them.
// ---------------------------------------------------------------------------

const KEYS = {
  users: 'mebelchi_users',
  orders: 'mebelchi_orders',
  designs: 'mebelchi_designs',
  portfolio: 'mebelchi_portfolio',
  services: 'mebelchi_services',
  catalog: 'mebelchi_catalog',
  session: 'mebelchi_session',
  // demo-only credential store; see auth.ts header
  credentials: 'mebelchi_credentials',
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];
export const STORAGE_KEYS = KEYS;

function read<T>(key: Key, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: Key, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('mebelchi:store', { detail: key }));
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function now(): string {
  return new Date().toISOString();
}

export function seedIfEmpty() {
  if (!read<User[]>(KEYS.users, []).some((u) => u.role === 'maker')) {
    write(KEYS.users, seedMakers);
  }
  if (read<CatalogItem[]>(KEYS.catalog, []).length === 0) {
    write(KEYS.catalog, seedCatalog);
  }
  if (read<PortfolioItem[]>(KEYS.portfolio, []).length === 0) {
    write(KEYS.portfolio, seedPortfolio);
  }
  if (read<MakerService[]>(KEYS.services, []).length === 0) {
    write(KEYS.services, seedServices);
  }
}

// --- users -----------------------------------------------------------------
export const getUsers = () => read<User[]>(KEYS.users, []);
export const getMakers = () => getUsers().filter((u) => u.role === 'maker');
export const getUser = (id: string) => getUsers().find((u) => u.id === id);
export const saveUser = (user: User) => {
  const users = getUsers();
  const i = users.findIndex((u) => u.id === user.id);
  if (i >= 0) users[i] = user;
  else users.push(user);
  write(KEYS.users, users);
};
export const getCredentials = () => read<Record<string, string>>(KEYS.credentials, {});
export const saveCredential = (email: string, password: string) => {
  const creds = getCredentials();
  creds[email.toLowerCase()] = password;
  write(KEYS.credentials, creds);
};

// --- catalog ---------------------------------------------------------------
export const getCatalog = () => read<CatalogItem[]>(KEYS.catalog, []);

// --- orders ----------------------------------------------------------------
export const getOrders = () => read<Order[]>(KEYS.orders, []);
export const getOrdersForCustomer = (customerId: string) =>
  getOrders().filter((o) => o.customerId === customerId);
export const getOrdersForMaker = (makerId: string) =>
  getOrders().filter((o) => o.makerId === makerId);

export function createOrder(input: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Order {
  const order: Order = { ...input, id: uid('ord'), status: 'new', createdAt: now(), updatedAt: now() };
  write(KEYS.orders, [order, ...getOrders()]);
  return order;
}

export function transitionOrder(orderId: string, next: OrderStatus): { ok: boolean; reason?: string } {
  const orders = getOrders();
  const i = orders.findIndex((o) => o.id === orderId);
  if (i < 0) return { ok: false, reason: 'Buyurtma topilmadi' };
  const allowed = ORDER_STATUS_FLOW[orders[i].status];
  if (!allowed.includes(next)) {
    return { ok: false, reason: `"${orders[i].status}" holatidan "${next}" ga o'tib bo'lmaydi` };
  }
  orders[i] = { ...orders[i], status: next, updatedAt: now() };
  write(KEYS.orders, orders);
  return { ok: true };
}

// --- designs ---------------------------------------------------------------
export const getDesigns = () => read<DesignRequest[]>(KEYS.designs, []);
export const getDesignsForCustomer = (customerId: string) =>
  getDesigns().filter((d) => d.customerId === customerId);
export function saveDesign(d: Omit<DesignRequest, 'id' | 'createdAt'>): DesignRequest {
  const design: DesignRequest = { ...d, id: uid('dsn'), createdAt: now() };
  write(KEYS.designs, [design, ...getDesigns()]);
  return design;
}
export function deleteDesign(id: string) {
  write(
    KEYS.designs,
    getDesigns().filter((d) => d.id !== id),
  );
}

// --- portfolio ---------------------------------------------------------------
export const getPortfolio = () => read<PortfolioItem[]>(KEYS.portfolio, []);
export const getPortfolioForMaker = (makerId: string) =>
  getPortfolio().filter((p) => p.makerId === makerId);
export function savePortfolioItem(item: PortfolioItem) {
  const items = getPortfolio();
  const i = items.findIndex((p) => p.id === item.id);
  if (i >= 0) items[i] = item;
  else items.unshift(item);
  write(KEYS.portfolio, items);
}
export function deletePortfolioItem(id: string) {
  write(
    KEYS.portfolio,
    getPortfolio().filter((p) => p.id !== id),
  );
}

// --- services ----------------------------------------------------------------
export const getServices = () => read<MakerService[]>(KEYS.services, []);
export const getServicesForMaker = (makerId: string) =>
  getServices().filter((s) => s.makerId === makerId);
export function saveService(svc: MakerService) {
  const items = getServices();
  const i = items.findIndex((s) => s.id === svc.id);
  if (i >= 0) items[i] = svc;
  else items.unshift(svc);
  write(KEYS.services, items);
}
export function deleteService(id: string) {
  write(
    KEYS.services,
    getServices().filter((s) => s.id !== id),
  );
}

// --- session -------------------------------------------------------------------
export const getSessionUserId = () => read<string | null>(KEYS.session, null);
export const setSessionUserId = (id: string | null) => write(KEYS.session, id);
