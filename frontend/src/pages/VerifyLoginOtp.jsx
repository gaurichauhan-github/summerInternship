import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';

export default function VerifyLoginOtp() {
  const { verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const defaultEmail = location.state?.email || '';

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: defaultEmail,
      otp: '',
    },
  });

  const onSubmit = async (values) => {
    setError('');

    try {
      await verifyLoginOtp(values);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (apiError) {
      setError(apiError.message || 'Unable to verify OTP');
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-950">Verify Login OTP</h1>
        <p className="mt-2 text-sm text-slate-600">Enter the OTP sent to your email to finish login.</p>

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
            id="otp"
            label="OTP Code"
            type="text"
            autoComplete="one-time-code"
            error={errors.otp?.message}
            {...register('otp', {
              required: 'OTP is required',
              minLength: { value: 6, message: 'OTP must have 6 digits' },
              maxLength: { value: 6, message: 'OTP must have 6 digits' },
            })}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <ShieldCheck size={18} />
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Need a new OTP?{' '}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to={ROUTES.LOGIN}>
            Request again
          </Link>
        </p>
      </div>
    </section>
  );
}
