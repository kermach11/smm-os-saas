import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Edit, Trash2, Eye, Globe, Calendar, 
  DollarSign, CheckCircle, XCircle, Mail, Phone 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';

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

const ClientManager: React.FC<ClientManagerProps> = ({ className }) => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Олександр Петренко',
      email: 'alex@restaurant.com',
      phone: '+380501234567',
      company: 'Ресторан "Смак"',
      website: 'https://restaurant-smak.com',
      previewUrl: 'https://preview.smm-os.com/restaurant-smak',
      subscriptionStatus: 'active',
      subscriptionEnd: '2024-12-31',
      monthlyFee: 299,
      createdAt: '2024-01-15',
      lastLogin: '2024-11-20',
      totalClicks: 1247,
      totalViews: 5632
    },
    {
      id: '2',
      name: 'Марія Коваленко',
      email: 'maria@beauty.com',
      phone: '+380671234567',
      company: 'Салон краси "Елегант"',
      website: 'https://elegant-beauty.com',
      previewUrl: 'https://preview.smm-os.com/elegant-beauty',
      subscriptionStatus: 'trial',
      subscriptionEnd: '2024-12-01',
      monthlyFee: 199,
      createdAt: '2024-11-01',
      lastLogin: '2024-11-19',
      totalClicks: 234,
      totalViews: 892
    }
  ]);

  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    monthlyFee: 299
  });

  const { toast } = useToast();

  const getStatusColor = (status: Client['subscriptionStatus']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Client['subscriptionStatus']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'trial':
        return <Calendar className="w-4 h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const addClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      ...newClient,
      previewUrl: `https://preview.smm-os.com/${newClient.company?.toLowerCase().replace(/\s+/g, '-') || 'client'}`,
      subscriptionStatus: 'trial',
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      totalClicks: 0,
      totalViews: 0
    };

    setClients(prev => [client, ...prev]);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      monthlyFee: 299
    });
    setShowAddClient(false);

    toast({
      title: "Успіх!",
      description: "Клієнта успішно додано",
    });
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Видалено",
      description: "Клієнта успішно видалено",
    });
  };

  const updateSubscription = (id: string, status: Client['subscriptionStatus']) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { 
            ...client, 
            subscriptionStatus: status,
            subscriptionEnd: status === 'active' 
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              : client.subscriptionEnd
          }
        : client
    ));

    toast({
      title: "Оновлено",
      description: "Статус підписки змінено",
    });
  };

  const totalRevenue = clients
    .filter(c => c.subscriptionStatus === 'active')
    .reduce((sum, c) => sum + c.monthlyFee, 0);

  const activeClients = clients.filter(c => c.subscriptionStatus === 'active').length;
  const trialClients = clients.filter(c => c.subscriptionStatus === 'trial').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всього клієнтів</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активні</p>
                <p className="text-2xl font-bold text-green-600">{activeClients}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Пробні</p>
                <p className="text-2xl font-bold text-blue-600">{trialClients}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Дохід/місяць</p>
                <p className="text-2xl font-bold text-green-600">₴{totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Керування клієнтами</h2>
          <p className="text-muted-foreground">
            Керуйте клієнтами та їх підписками на превью
          </p>
        </div>
        <Button onClick={() => setShowAddClient(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Додати клієнта
        </Button>
      </div>

      {/* Add Client Form */}
      {showAddClient && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Додати нового клієнта</CardTitle>
              <CardDescription>
                Заповніть інформацію про клієнта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ім'я *</label>
                  <Input
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ім'я клієнта"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Телефон</label>
                  <Input
                    value={newClient.phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+380501234567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Компанія</label>
                  <Input
                    value={newClient.company}
                    onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Назва компанії"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Веб-сайт</label>
                  <Input
                    value={newClient.website}
                    onChange={(e) => setNewClient(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Місячна плата (₴)</label>
                  <Input
                    type="number"
                    value={newClient.monthlyFee}
                    onChange={(e) => setNewClient(prev => ({ ...prev, monthlyFee: Number(e.target.value) }))}
                    placeholder="299"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addClient}>Додати клієнта</Button>
                <Button variant="outline" onClick={() => setShowAddClient(false)}>
                  Скасувати
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Clients List */}
      <div className="space-y-4">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Ще немає клієнтів. Додайте першого!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{client.name}</h3>
                          <Badge className={getStatusColor(client.subscriptionStatus)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(client.subscriptionStatus)}
                              {client.subscriptionStatus === 'active' ? 'Активна' : 
                               client.subscriptionStatus === 'trial' ? 'Пробна' : 'Закінчена'}
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {client.email}
                            </p>
                          </div>
                          
                          {client.phone && (
                            <div>
                              <p className="text-muted-foreground">Телефон</p>
                              <p className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {client.phone}
                              </p>
                            </div>
                          )}
                          
                          {client.company && (
                            <div>
                              <p className="text-muted-foreground">Компанія</p>
                              <p>{client.company}</p>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-muted-foreground">Місячна плата</p>
                            <p className="font-semibold text-green-600">₴{client.monthlyFee}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Переглядів</p>
                            <p className="font-semibold">{client.totalViews.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Кліків</p>
                            <p className="font-semibold">{client.totalClicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Підписка до</p>
                            <p className="font-semibold">{new Date(client.subscriptionEnd).toLocaleDateString('uk-UA')}</p>
                          </div>
                        </div>

                        {client.previewUrl && (
                          <div className="mt-4">
                            <p className="text-muted-foreground text-sm">URL превью</p>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {client.previewUrl}
                              </code>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(client.previewUrl, '_blank')}
                              >
                                <Globe className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        {client.subscriptionStatus === 'trial' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscription(client.id, 'active')}
                          >
                            Активувати
                          </Button>
                        )}
                        
                        {client.subscriptionStatus === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscription(client.id, 'expired')}
                          >
                            Призупинити
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingClient(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteClient(client.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager; 