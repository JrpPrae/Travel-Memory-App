import React, { useState } from 'react';
import { Compass, User, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { login, register } from '../utils/auth';

interface AuthViewProps {
  onAuthSuccess: (username: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = mode === 'login' ? await login(username, password) : await register(username, password);
      if (result.success) {
        onAuthSuccess(username.trim());
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#90AEAD] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md bg-[#FDF4E7] rounded-3xl border border-[#E4CAB3] shadow-2xl p-6 sm:p-8">

        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#874F41] to-[#5C3A2E] flex items-center justify-center text-[#FBE9D0] shadow-sm shadow-[#874F41]/30 mb-3">
            <Compass className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#244855]">
            Travel Memory Pinboard
          </h1>
          <p className="text-xs sm:text-sm text-[#9C6B58] mt-1">
            เข้าสู่ระบบเพื่อบันทึกความทรงจำการเดินทางของคุณเอง
          </p>
        </div>

        {/* Mode Switch */}
        <div className="flex bg-[#FBE9D0] p-1 rounded-2xl border border-[#E4CAB3] mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-[#874F41] text-[#FBE9D0] shadow-xs' : 'text-[#874F41]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-[#874F41] text-[#FBE9D0] shadow-xs' : 'text-[#874F41]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>สมัครสมาชิก</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#7B483B] mb-1">
              ชื่อผู้ใช้ {mode === 'register' && '(ต้องไม่ซ้ำ)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B98D79] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น praejirapa"
                className="w-full pl-10 pr-3 py-2.5 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-2 focus:ring-[#874F41]/30 focus:border-[#874F41]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#7B483B] mb-1">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B98D79] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 4 ตัวอักษร"
                className="w-full pl-10 pr-10 py-2.5 bg-[#FFFFFF] border border-[#E4CAB3] rounded-xl text-sm text-[#244855] placeholder-[#B98D79] focus:outline-none focus:ring-2 focus:ring-[#874F41]/30 focus:border-[#874F41]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B98D79] hover:text-[#244855]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#B82525] bg-[#FBE8E8] border border-[#F5C2C2] rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-[#874F41] hover:bg-[#6C3F34] disabled:opacity-60 text-[#FBE9D0] text-sm font-semibold shadow-md shadow-[#874F41]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{submitting ? 'กำลังดำเนินการ...' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกใหม่'}</span>
          </button>
        </form>

        <p className="text-[11px] text-[#B98D79] text-center mt-5">
          ข้อมูลของคุณจะถูกเก็บไว้บนอุปกรณ์นี้เท่านั้น แยกเฉพาะบุคคลตามชื่อผู้ใช้
        </p>
      </div>
    </div>
  );
};
