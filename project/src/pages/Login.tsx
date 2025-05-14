import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Github, Mail, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, loginWithGithub, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (email && password) {
        const user = await login(email, password);
        if (user) {
          if (isAdminLogin) {
            if (!user.isAdmin) {
              setError('Invalid admin credentials');
              setIsLoading(false);
              return;
            }
            // Route to specific admin dashboard based on role
            switch (user.role) {
              case 'ProjectAdmin':
                navigate('/admin/projects');
                break;
              case 'PortfolioAdmin':
                navigate('/admin/portfolios');
                break;
              case 'PhDAdmin':
                navigate('/admin/phd');
                break;
              default:
                setError('Invalid admin role');
                break;
            }
          } else {
            if (user.isAdmin) {
              // Redirect admin users to their specific dashboard
              switch (user.role) {
                case 'ProjectAdmin':
                  navigate('/admin/projects');
                  break;
                case 'PortfolioAdmin':
                  navigate('/admin/portfolios');
                  break;
                case 'PhDAdmin':
                  navigate('/admin/phd');
                  break;
              }
            } else {
              navigate('/dashboard');
            }
          }
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Please enter both email and password');
      }
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in with GitHub');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in with Google');
      console.error(err);
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isAdminLogin ? 'Admin Login' : 'Log in to your account'}
        </h2>
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsAdminLogin(!isAdminLogin)}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center justify-center mx-auto"
          >
            <Shield className="h-4 w-4 mr-1" />
            {isAdminLogin ? 'Switch to User Login' : 'Switch to Admin Login'}
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {!isAdminLogin && (
            <>
              <div className="space-y-6">
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={handleGithubLogin}
                    leftIcon={<Github className="h-5 w-5" />}
                  >
                    Continue with GitHub
                  </Button>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={handleGoogleLogin}
                    leftIcon={<User className="h-5 w-5" />}
                  >
                    Continue with Google
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
                leftIcon={isAdminLogin ? <Shield className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              >
                {isAdminLogin ? 'Login as Admin' : 'Log in with Email'}
              </Button>
            </div>
          </form>

          {!isAdminLogin && (
            <>
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or browse as guest</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={handleGuestLogin}
                  leftIcon={<User className="h-4 w-4" />}
                >
                  Continue as Guest
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
