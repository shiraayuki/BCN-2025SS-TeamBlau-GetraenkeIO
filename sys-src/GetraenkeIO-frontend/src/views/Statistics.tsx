import CustomSidebar from '../components/HomeSidebar';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
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

// Dummy-Daten
const dummyHistory = [
  { id: 1, productName: 'Cola', quantity: 3, price: 4.5, purchaseDate: '2025-05-28T10:15:00' },
  { id: 2, productName: 'Wasser', quantity: 2, price: 2.0, purchaseDate: '2025-05-28T11:00:00' },
  { id: 3, productName: 'Cola', quantity: 1, price: 1.5, purchaseDate: '2025-05-28T12:30:00' },
  { id: 3, productName: 'Bier', quantity: 2, price: 4.0, purchaseDate: '2025-05-28T12:30:00' },
  { id: 4, productName: 'Fanta', quantity: 4, price: 6.0, purchaseDate: '2025-05-28T13:00:00' },
];

const calculateTotalRevenue = (history: typeof dummyHistory) =>
  history.reduce((sum, item) => sum + item.price, 0);

const calculateTotalQuantity = (history: typeof dummyHistory) =>
  history.reduce((sum, item) => sum + item.quantity, 0);

const aggregateByProduct = (history: typeof dummyHistory) => {
  const map = new Map<string, { quantity: number; revenue: number }>();
  history.forEach(item => {
    if (!map.has(item.productName)) {
      map.set(item.productName, { quantity: 0, revenue: 0 });
    }
    const product = map.get(item.productName)!;
    product.quantity += item.quantity;
    product.revenue += item.price;
  });
  return Array.from(map.entries()).map(([name, data]) => ({
    name,
    ...data,
  }));
};

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const Statistics = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const totalRevenue = calculateTotalRevenue(dummyHistory);
  const totalQuantity = calculateTotalQuantity(dummyHistory);
  const productStats = aggregateByProduct(dummyHistory);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CustomSidebar />

      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
          Statistiken
        </Typography>

        
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={4}
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
                    {productStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
      </Box>
    </Box>
  );
};

export default Statistics;