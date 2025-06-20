import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { publicAxios } from '../api/axiosInstance';

interface Transaction {
  transaction_id: string;
  name: string;
  imageUrl: string;
  cost: string;
  user_id: string;
  count_before: number;
  amount: number;
  date: string;
}

interface ProductStats {
  name: string;
  quantity: number;
  revenue: number;
}

// Dynamische Farberstellung für Kreisdiagramm
const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count; 
    const saturation = 70 + (i % 3) * 10;
    const lightness = 50 + (i % 2) * 15;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

const Statistics: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.userData);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userData?.credentials) {
        setLoading(false);
        return;
      }

      try {
        const auth = {
          username: userData.credentials.username,
          password: userData.credentials.password,
        };

        const res = await publicAxios.get<Transaction[]>('/transactions/me', { auth });
        setTransactions(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Transaktionen:', err);
        setError('Statistiken konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userData]);

  const calculateTotalRevenue = (history: Transaction[]) =>
    history.reduce((sum, item) => sum + parseFloat(item.cost), 0);

  const calculateTotalQuantity = (history: Transaction[]) =>
    history.reduce((sum, item) => sum + item.amount, 0);

  const aggregateByProduct = (history: Transaction[]): ProductStats[] => {
    const map = new Map<string, { quantity: number; revenue: number }>();
    history.forEach(item => {
      if (!map.has(item.name)) {
        map.set(item.name, { quantity: 0, revenue: 0 });
      }
      const product = map.get(item.name)!;
      product.quantity += item.amount;
      product.revenue += parseFloat(item.cost);
    });
    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const totalRevenue = calculateTotalRevenue(transactions);
  const totalQuantity = calculateTotalQuantity(transactions);
  const productStats = aggregateByProduct(transactions);
  const colors = generateColors(productStats.length);

  return (
    <Box sx={{ 
      height: '100vh', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
          Statistiken
        </Typography>

        {transactions.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Keine Transaktionen vorhanden.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
            gap={4}
            sx={{ width: '100%' }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">Gesamtumsatz</Typography>
                <Typography variant="h4" color="primary">{totalRevenue.toFixed(2)} €</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6">Verkaufte Getränke insgesamt</Typography>
                <Typography variant="h4" color="primary">{totalQuantity}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Verkäufe pro Getränk (Menge)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={productStats}
                      dataKey="quantity"
                      nameKey="name"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {productStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card sx={{ height: 400 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Umsatz pro Getränk
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={productStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#1976d2" name="Umsatz (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Statistics;