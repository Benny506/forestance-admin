import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginScreen: React.FC = () => {
  const { user, login, isLoading: authLoading } = useAuth();
  const { showLoader, hideLoader, addToast } = useUI();
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        showLoader('Authenticating...');
        await login(values.email, values.password);
        addToast('Successfully authenticated.', 'success');
      } catch (error: unknown) {
        console.error('Login error:', error);
        addToast((error as Error).message || 'Invalid email or password.', 'error');
      } finally {
        setSubmitting(false);
        hideLoader();
      }
    },
  });

  const hasError = (field: keyof typeof formik.values) => formik.touched[field] && formik.errors[field];

  // Global formik error observer to mimic the frontend's toast on submit fail
  React.useEffect(() => {
    if (formik.submitCount > 0 && !formik.isValid) {
      const errorKeys = Object.keys(formik.errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0] as keyof typeof formik.errors;
        const errorMessage = formik.errors[firstErrorKey];
        addToast(`Please review: ${errorMessage}`, 'error');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.submitCount]);

  if (authLoading) return null; // Let the global router handle initial load, or just show nothing to prevent flicker before redirect

  // If already logged in, redirect to dashboard
  if (user && !authLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-14 h-14 bg-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="font-heading text-4xl text-[#111111] uppercase mb-2">
            Admin Portal
          </h1>
          <p className="font-outfit text-[#111111]/60">
            Sign in to manage the Forestance platform.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="bg-white border border-[#111111]/10 rounded-2xl p-8 md:p-10 shadow-sm flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
            <label className="font-outfit font-[600] text-[15px] text-[#111111]">Email Address</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="admin@forestance.com"
              className={`w-full border rounded-lg px-5 py-4 font-outfit text-[16px] text-[#111111] placeholder:text-[#111111]/30 focus:outline-none transition-colors ${
                hasError('email') ? 'border-red-500 focus:border-red-500' : 'border-[#111111]/15 focus:border-[#111111]/40'
              }`}
            />
            {hasError('email') && <span className="font-outfit text-sm text-red-500">{formik.errors.email as string}</span>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-outfit font-[600] text-[15px] text-[#111111]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                placeholder="••••••••"
                className={`w-full border rounded-lg pl-5 pr-12 py-4 font-outfit text-[16px] text-[#111111] placeholder:text-[#111111]/30 focus:outline-none transition-colors ${
                  hasError('password') ? 'border-red-500 focus:border-red-500' : 'border-[#111111]/15 focus:border-[#111111]/40'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111111]/40 hover:text-[#111111] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {hasError('password') && <span className="font-outfit text-sm text-red-500">{formik.errors.password as string}</span>}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-4 bg-[#111111] text-white font-outfit font-medium text-[16px] px-6 py-4 rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[56px]"
          >
            {formik.isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
