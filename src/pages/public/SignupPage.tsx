import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import { Calendar } from 'lucide-react';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { signup } = useAuth();
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
      await signup(data.name, data.email, data.password);
      toast.success('Registration successful. Please verify your email before logging in.', {
        duration: 6000,
      });
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
          <h1 className="text-3xl font-extrabold text-white font-display">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Join your campus community today</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <Input
                placeholder="John Doe"
                error={errors.name?.message}
                className="bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl"
                {...register('name')}
              />
            </div>
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
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                className="bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl"
                {...register('password')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                className="bg-slate-950/60 border-slate-800 text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 rounded-xl"
                {...register('confirmPassword')}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-95 duration-150 mt-2"
            >
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-350 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

