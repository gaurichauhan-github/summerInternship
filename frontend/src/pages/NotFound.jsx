import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { ROUTES } from '../constants/routes.js';

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">404</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you are looking for does not exist or has been moved.</p>
      <Button as={Link} to={ROUTES.HOME} className="mt-8">
        <Home size={18} />
        Back home
      </Button>
    </section>
  );
}
