import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (duration: number) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLogin }) => {
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginDuration, setLoginDuration] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Очищення форми при відкритті/закритті
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const getAdminCredentials = (): { login: string; password: string } => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings) {
          return {
            login: data.adminSettings.login || 'admin',
            password: data.adminSettings.password || 'admin123'
          };
        }
      }
    } catch (error) {
      console.error('Помилка при зчитуванні даних:', error);
    }
    return { login: 'admin', password: 'admin123' }; // Дані за замовчуванням
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Введіть логін!');
      return;
    }
    
    if (!password.trim()) {
      setError('Введіть пароль!');
      return;
    }

    setIsLoading(true);
    setError('');

    // Імітуємо затримку для перевірки даних
    setTimeout(() => {
      const credentials = getAdminCredentials();
      
      if (username === credentials.login && password === credentials.password) {
        const duration = parseInt(loginDuration);
        
        // Зберігаємо сесію
        const now = new Date().getTime();
        const expiry = now + duration * 60 * 1000;
        
        const sessionData = {
          timestamp: now,
          expiry: expiry,
          duration: duration
        };
        
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        toast({
          title: "Вхід успішний",
          description: `Сесія активна протягом ${duration} хвилин`,
        });
        
        onLogin(duration);
        setUsername('');
        setPassword('');
      } else {
        setError('Невірний логін або пароль. Спробуйте ще раз.');
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as React.FormEvent);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white dark:bg-gray-900 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Вхід в панель адміністратора</CardTitle>
                <CardDescription className="mt-2">
                  Введіть пароль для доступу до налаштувань
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Логін адміністратора</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введіть логін"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Пароль адміністратора</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Введіть пароль"
                      className="pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Тривалість сесії</Label>
                  <Select value={loginDuration} onValueChange={setLoginDuration} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 хвилин</SelectItem>
                      <SelectItem value="30">30 хвилин</SelectItem>
                      <SelectItem value="60">1 година</SelectItem>
                      <SelectItem value="240">4 години</SelectItem>
                      <SelectItem value="720">12 годин</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Скасувати
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Перевірка...
                      </>
                    ) : (
                      'Увійти'
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Стандартні дані: логін <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">admin</code>, 
                  пароль <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">admin123</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminLogin; 