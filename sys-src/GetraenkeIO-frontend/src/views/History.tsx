import React, { useEffect, useState } from 'react';
import CustomSidebar from '../components/HomeSidebar';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FaCalendarAlt, FaEuroSign, FaWineBottle, FaHashtag } from 'react-icons/fa';
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

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString() +
    ' – ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
};

const History: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

        // Nach Datum absteigend sortieren
        const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(sorted);
      } catch (err) {
        console.error('Fehler beim Laden der Transaktionen:', err);
        setError('Kaufhistorie konnte nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userData]);

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

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CustomSidebar />

      <Box
        sx={{
          flexGrow: 1,
          color: 'white',
          padding: 4,
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>
          Kaufhistorie
        </Typography>

        <Card
          sx={{
            backgroundColor: 'rgba(250, 250, 250, 0.95)',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 64px)',
            width: '100%',
          }}
        >
          <CardContent
            sx={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 2,
              padding: 0,
              overflow: 'auto',
              flexGrow: 1,
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#1976d2',
                    '& .MuiTableCell-head': {
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      border: 'none',
                      padding: '12px 16px',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      backgroundColor: '#1976d2',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaHashtag /> {!isSmallScreen && 'Anzahl'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaWineBottle /> {!isSmallScreen && 'Produkt'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaCalendarAlt /> {!isSmallScreen && 'Datum & Uhrzeit'}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <FaEuroSign /> {!isSmallScreen && 'Preis'}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Keine Bestellungen vorhanden.
                    </TableCell>
                  </TableRow>
                )}
                {transactions.map((item) => (
                  <TableRow key={item.transaction_id} hover>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell align="right">{parseFloat(item.cost).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default History;
