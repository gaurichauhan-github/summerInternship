import { LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
  }`;

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="text-base font-semibold tracking-normal text-slate-950">
          Internship Portal
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to={ROUTES.DASHBOARD} className={navLinkClass}>
                <span className="inline-flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </span>
              </NavLink>
              <span className="hidden text-sm text-slate-500 md:inline">{user?.name}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to={ROUTES.LOGIN} className={navLinkClass}>
                <span className="inline-flex items-center gap-2">
                  <LogIn size={16} />
                  Login
                </span>
              </NavLink>
              <Button as={Link} to={ROUTES.REGISTER} size="sm">
                <UserPlus size={16} />
                Register
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
