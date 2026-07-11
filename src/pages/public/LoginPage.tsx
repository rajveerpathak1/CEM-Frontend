import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { Sparkles, Calendar } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/student/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account to continue</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@university.edu"
                error={errors.email?.message}
                className="bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl"
                {...register('email')}
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                className="bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl"
                {...register('password')}
              />
              <div className="flex justify-end pt-1">
                <Link to="/forgot-password" className="text-xs font-semibold text-emerald-400 hover:text-emerald-350 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95 duration-150"
            >
              Sign in
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Or login with</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-950/90 font-bold py-3 rounded-xl flex items-center justify-center gap-2 border hover:border-slate-700 transition-all active:scale-95 duration-150"
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
                const basePath = apiBase.endsWith("/api/v1") 
                  ? apiBase.replace("/api/v1", "/api/v1") 
                  : apiBase;
                window.location.href = `${basePath}/oauth/google`;
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-emerald-400 hover:text-emerald-350 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

