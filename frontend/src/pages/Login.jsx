import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setError('');

    try {
      await login(values);
      navigate(ROUTES.VERIFY_LOGIN_OTP, { state: { email: values.email } });
    } catch (apiError) {
      setError(apiError.message || 'Unable to login');
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your credentials and receive an OTP to complete login.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ErrorMessage message={error} /> : null}
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <LogIn size={18} />
            {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to={ROUTES.REGISTER}>
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
