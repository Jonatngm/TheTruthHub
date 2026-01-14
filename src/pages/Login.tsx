import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/lib/authService';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cross, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Handle magic link authentication
  useEffect(() => {
    // Check for existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        login(authService.mapUser(session.user));
        toast.success('Successfully logged in!');
        navigate('/admin');
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        login(authService.mapUser(session.user));
        toast.success('Successfully logged in!');
        navigate('/admin');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, login]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.signInWithPassword(email, password);
      login(authService.mapUser(user));
      navigate('/admin');
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Login failed');
      }
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const user = await authService.signUpWithPassword(email, password, username);
      if (user) {
        login(authService.mapUser(user));
        toast.success('Account created! You can now login with your password.');
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
      <Card className="w-full max-w-md border-border/60">
        <CardHeader className="text-center space-y-3 sm:space-y-4 px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
              <Cross className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Sign in to manage teachings
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          {step === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="your@email.com"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                  className="text-sm sm:text-base"
                />
              </div>
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                Sign In
              </Button>
              <div className="text-center mt-3 sm:mt-4">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-xs sm:text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="your@email.com"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Your name"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm">Password (min 6 characters)</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Create a password"
                  minLength={6}
                  className="text-sm sm:text-base"
                />
              </div>
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                Create Account
              </Button>
              <div className="text-center mt-3 sm:mt-4">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-xs sm:text-sm text-muted-foreground hover:underline"
                  disabled={loading}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
