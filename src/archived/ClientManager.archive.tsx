/**
 * АРХІВНИЙ КОД КОМПОНЕНТУ CLIENTMANAGER
 * 
 * Цей файл містить повний код компонента ClientManager,
 * який був видалений з адміністративної панелі за запитом користувача.
 * 
 * Збережено для історії та можливого відновлення в майбутньому.
 * Дата архівування: ${new Date().toLocaleDateString('uk-UA')}
 * 
 * Причина видалення: Користувач вказав, що розділ "Клієнти" не є важливим
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Edit, Trash2, Eye, Globe, Calendar, 
  DollarSign, CheckCircle, XCircle, Mail, Phone 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/use-toast';

interface ClientManagerProps {
  className?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  previewUrl?: string;
  subscriptionStatus: 'active' | 'expired' | 'trial';
  subscriptionEnd: string;
  monthlyFee: number;
  createdAt: string;
  lastLogin?: string;
  totalClicks: number;
  totalViews: number;
}

// АРХІВНИЙ КОМПОНЕНТ - НЕ ВИКОРИСТОВУЄТЬСЯ
const ClientManager: React.FC<ClientManagerProps> = ({ className }) => {
  return (
    <div className={`p-6 h-full overflow-y-auto ${className}`}>
      <div className="text-center text-gray-500 py-8">
        <h3 className="text-lg font-semibold mb-2">Клієнт Менеджер Архівований</h3>
        <p>Цей компонент було переміщено до архіву</p>
        <p className="text-sm mt-2">Оригінальний код зберігається для історії</p>
      </div>
    </div>
  );
};

export default ClientManager; 