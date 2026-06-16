import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { ROUTES } from '../constants/routes.js';

const features = [
  {
    icon: ShieldCheck,
    title: 'Protected Workflows',
    description: 'Authentication state and private routes are ready for real API integration.',
  },
  {
    icon: Workflow,
    title: 'Modular Architecture',
    description: 'Routes, services, hooks, constants, and UI are separated for maintainable growth.',
  },
  {
    icon: Sparkles,
    title: 'Polished UI',
    description: 'Tailwind, motion, toast notifications, and accessible controls are wired in.',
  },
];

export default function Home() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-700">React 19 + Vite</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
          A production-ready frontend foundation for your internship project.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Start from a clean, scalable React app with routing, auth structure, API services, loading states, and reusable components already in place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} to={ROUTES.REGISTER} size="lg">
            Get started
            <ArrowRight size={18} />
          </Button>
          <Button as={Link} to={ROUTES.LOGIN} variant="secondary" size="lg">
            Login
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4">
        {features.map((feature) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
          >
            <feature.icon className="mb-4 text-cyan-700" size={28} />
            <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
