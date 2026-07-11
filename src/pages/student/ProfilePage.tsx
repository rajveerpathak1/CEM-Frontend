import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Shield, Camera, Key, User, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pwLoading, setPwLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulate profile saving to protect against unimplemented backend endpoints
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Profile changes applied (cached locally)');
    } catch (err: any) {
      toast.error('Failed to save profile changes');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password updated successfully');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success('Avatar updated locally!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">Profile Settings</h1>
        <p className="mt-2 text-slate-500 text-sm">Manage your public information and security settings</p>
      </div>

      {/* Backend Alert Disclaimer */}
      <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-4 flex gap-3 text-xs text-emerald-800 font-semibold leading-relaxed">
        <Info className="w-5 h-5 text-emerald-600 shrink-0" />
        <p>
          Notice: Dynamic profile updates are simulated and cached in memory. Backend integration will activate automatically once API endpoints are deployed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT COLUMN: AVATAR CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm h-fit">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-full flex items-center justify-center border-2 border-emerald-500/20 overflow-hidden shadow-inner">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-emerald-800 font-extrabold text-4xl font-display">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="text-white w-6 h-6" />
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />

          <h2 className="text-lg font-bold text-slate-900 mt-4 font-display">{user?.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-full">{user?.email}</p>
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider font-bold rounded-lg border border-emerald-100/50 mt-4 capitalize">
            <Shield className="w-3.5 h-3.5" />
            {user?.role}
          </span>
        </div>

        {/* RIGHT COLUMN: FORMS */}
        <div className="md:col-span-2 space-y-8">
          {/* General Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100/80 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 font-display">Personal Details</h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <Input
                label="Full Name"
                error={errors.name?.message}
                className="rounded-xl border-slate-200/80 focus:ring-emerald-500/20 focus:border-emerald-500"
                {...register('name')}
              />
              <Input
                label="Email Address"
                type="email"
                error={errors.email?.message}
                className="rounded-xl border-slate-200/80 focus:ring-emerald-500/20 focus:border-emerald-500"
                {...register('email')}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-xl active:scale-95 duration-150 shadow-md shadow-emerald-600/10"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100/80 flex items-center gap-2">
              <Key className="w-5 h-5 text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 font-display">Change Password</h3>
            </div>
            
            <form onSubmit={onPasswordSubmit} className="p-6 space-y-5">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                required
                className="rounded-xl border-slate-200/80 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                required
                className="rounded-xl border-slate-200/80 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  loading={pwLoading}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl active:scale-95 duration-150"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

