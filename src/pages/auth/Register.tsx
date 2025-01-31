import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBasket } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '../../lib/auth/service';
import UserIdSelect from '../../components/UserIdSelect';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Select ID, Step 2: Registration
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Please select a user ID');
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await register({
        ...formData,
        userId,
      });

      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center">
            <ShoppingBasket className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">Pantry Plus</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">Create an account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleUserIdSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-foreground">
                Select Your User ID
              </label>
              <UserIdSelect
                value={userId}
                onChange={setUserId}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="First name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Last name"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Email"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Password"
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-input rounded-md shadow-sm text-sm font-medium hover:bg-accent"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}