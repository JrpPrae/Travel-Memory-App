export interface UserAccount {
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

const USERS_KEY = 'travel_pinboard_users_v1';
const SESSION_KEY = 'travel_pinboard_session_v1';

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getUsers(): Record<string, UserAccount> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error loading users:', e);
    return {};
  }
}

function saveUsers(users: Record<string, UserAccount>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUsername(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function register(usernameRaw: string, password: string): Promise<AuthResult> {
  const username = usernameRaw.trim();

  if (!username || !password) {
    return { success: false, error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
  }
  if (username.length < 3) {
    return { success: false, error: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร' };
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return { success: false, error: 'ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษร ตัวเลข และ _ . -' };
  }
  if (password.length < 4) {
    return { success: false, error: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' };
  }

  const users = getUsers();
  const key = username.toLowerCase();
  if (users[key]) {
    return { success: false, error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น' };
  }

  const passwordHash = await hashPassword(password);
  users[key] = { username, passwordHash, createdAt: Date.now() };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, username);

  return { success: true };
}

export async function login(usernameRaw: string, password: string): Promise<AuthResult> {
  const username = usernameRaw.trim();
  if (!username || !password) {
    return { success: false, error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
  }

  const users = getUsers();
  const account = users[username.toLowerCase()];
  if (!account) {
    return { success: false, error: 'ไม่พบชื่อผู้ใช้นี้ในระบบ' };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== account.passwordHash) {
    return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' };
  }

  localStorage.setItem(SESSION_KEY, account.username);
  return { success: true };
}
