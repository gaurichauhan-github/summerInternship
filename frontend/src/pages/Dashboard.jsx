import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, CheckCircle2, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { authService } from '../services/authService.js';

const metrics = [
  { label: 'Active Tasks', value: '12', icon: Activity },
  { label: 'Completed', value: '48', icon: CheckCircle2 },
  { label: 'Team Members', value: '6', icon: Users },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const response = await authService.getProfile();
        setProfile(response.user);
      } catch {
        setProfile(user);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome back, {profile?.name || 'Intern'}.</p>
        </div>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          Updated {formatDistanceToNow(new Date(), { addSuffix: true })}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
        >
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{profile?.email || '—'}</p>
        </motion.article>
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
        >
          <p className="text-sm text-slate-500">Verified</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {profile?.isEmailVerified ? 'Yes' : 'No'}
          </p>
        </motion.article>
        {metrics.map((metric) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
          >
            <metric.icon className="text-cyan-700" size={24} />
            <p className="mt-4 text-3xl font-bold text-slate-950">{metric.value}</p>
            <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-950">Project Overview</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          This protected area is ready for real dashboard data through the service layer. Replace the placeholder metrics with API responses as the backend endpoints become available.
        </p>
      </div>
    </section>
  );
}
