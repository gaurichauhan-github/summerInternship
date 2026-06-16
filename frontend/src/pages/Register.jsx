import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Input from '../components/ui/Input.jsx';
import { ROUTES } from '../constants/routes.js';
import { useAuth } from '../hooks/useAuth.js';

export default function Register() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setError('');

    try {
      await createAccount(values);
      navigate(ROUTES.VERIFY_REGISTER_OTP, { state: { email: values.email } });
    } catch (apiError) {
      setError(apiError.message || 'Unable to create account');
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Register</h1>
        <p className="mt-2 text-sm text-slate-600">Create an account and verify your email with a one-time code.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error ? <ErrorMessage message={error} /> : null}
          <Input
            id="name"
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
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
            autoComplete="new-password"
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
            <UserPlus size={18} />
            {isSubmitting ? 'Sending OTP...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to={ROUTES.LOGIN}>
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
