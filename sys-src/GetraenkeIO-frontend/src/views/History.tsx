import CustomSidebar from '../components/HomeSidebar';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  FaCalendarAlt,
  FaEuroSign,
  FaWineBottle,
  FaHashtag,
} from 'react-icons/fa';

const dummyHistory = [
  {
    id: 1,
    productName: 'Cola',
    purchaseDate: '2025-05-24T14:30:00Z',
    price: 1.5,
    quantity: 2,
  },
  {
    id: 2,
    productName: 'Bier',
    purchaseDate: '2025-05-23T19:15:00Z',
    price: 2.0,
    quantity: 1,
  },
  {
    id: 3,
    productName: 'Wasser',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.0,
    quantity: 3,
  },
  {
    id: 3,
    productName: 'Fanta',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.50,
    quantity: 3,
  },
  {
    id: 3,
    productName: 'Wasser',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.0,
    quantity: 3,
  },
  {
    id: 3,
    productName: 'Wasser',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.0,
    quantity: 3,
  },
  {
    id: 3,
    productName: 'Wasser',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.0,
    quantity: 3,
  },
  {
    id: 3,
    productName: 'Wasser',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.0,
    quantity: 3,
  },
  {
    id: 3,
    productName: 'Wasser',
    purchaseDate: '2025-05-22T11:45:00Z',
    price: 1.0,
    quantity: 3,
  },
];


const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return (
    date.toLocaleDateString() +
    ' – ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
};

const History = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Sortiere die History-Daten nach Datum (neueste zuerst)
  const sortedHistory = [...dummyHistory].sort((a, b) => {
    return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
  });

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
          <CardContent sx={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            padding: 0,
            overflow: 'auto',
            flexGrow: 1,
          }}>
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
                    }
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
                {sortedHistory.map((item, index) => (
                  <TableRow key={`${item.id}-${item.purchaseDate}-${index}`} hover>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                    <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {sortedHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Keine Bestellungen vorhanden.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default History;
