import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Card,
  CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { type Drink } from "../models/drinksModels";
import { drinksmgmtService } from '../features/drinksmgmt/drinksmgmtService';

const DEFAULT_IMAGE_URL = 'https://s1.directupload.eu/images/250608/madpacbp.png';

const DrinksManagement: React.FC = () => {
  const userData = useSelector((state: RootState) => state.user.userData);

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const [form, setForm] = useState({ name: '', cost: '', imageUrl: '', count: '' });

  // Holt sich alle Getränke vom Backend
  const fetchDrinks = async () => {
    if (!userData || !userData.credentials) return;
    try {
      const data = await drinksmgmtService.getDrinks(userData);
      setDrinks(data);
    } catch (error) {
      console.error('Fehler beim Laden der Getränke:', error);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, [userData]);

  // Dialog zum bearbeiten/erstellen von Getränken
  const handleOpenDialog = (drink?: Drink) => {
    if (drink) {
      setEditingDrink(drink);
      setForm({
        name: drink.name,
        cost: drink.cost.toString(),
        imageUrl: drink.imageUrl,
        count: drink.count.toString()
      });
    } else {
      setEditingDrink(null);
      setForm({ name: '', cost: '', imageUrl: '', count: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Speichert Änderungen wenn ein Getränk erstellt/bearbeitet wird
  const handleSubmit = async () => {
    if (!userData || !userData.credentials) return;

    const payload = {
      name: form.name,
      cost: parseFloat(form.cost),
      imageUrl: form.imageUrl.trim() || DEFAULT_IMAGE_URL,
      count: parseInt(form.count)
    };

    try {
      if (editingDrink) {
        await drinksmgmtService.updateDrink(editingDrink.id, payload, userData);
      } else {
        await drinksmgmtService.createDrink(payload, userData);
      }

      setSnackbar({
        open: true,
        message: editingDrink ? 'Getränk aktualisiert' : 'Getränk erstellt',
        severity: 'success'
      });

      fetchDrinks();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Fehler beim Speichern', severity: 'error' });
    }
  };

  // Lösche ein Getränk
  const handleDelete = async (drinkId: number) => {
    if (!userData || !userData.credentials) return;

    try {
      await drinksmgmtService.deleteDrink(drinkId, userData);
      setSnackbar({ open: true, message: 'Getränk gelöscht', severity: 'success' });
      fetchDrinks();
    } catch (error) {
      setSnackbar({ open: true, message: 'Fehler beim Löschen', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, px: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Getränkeverwaltung
        </Typography>

        <Button variant="contained" onClick={() => handleOpenDialog()}>
          + Neues Getränk
        </Button>
      </Box>

      {/*Tabelle mit Getränken */}
      <Card
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#1976d2',
                  '& .MuiTableCell-head': {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    padding: '12px 16px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  },
                }}
              >
                <TableCell>Name</TableCell>
                <TableCell>Preis (€)</TableCell>
                <TableCell>Vorrat</TableCell>
                <TableCell>Bild</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drinks.map((drink) => (
                <TableRow key={drink.id}>
                  <TableCell>{drink.name}</TableCell>
                  <TableCell>{drink.cost.toFixed(2)}</TableCell>
                  <TableCell>{drink.count}</TableCell>
                  <TableCell>
                    <img src={drink.imageUrl} alt={drink.name} width={50} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(drink)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(drink.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {drinks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Keine Getränke gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogfenster */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingDrink ? 'Getränk bearbeiten' : 'Neues Getränk anlegen'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
          <TextField label="Name" InputLabelProps={{ shrink: true }} value={form.name} margin='dense' onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Preis (€)" InputLabelProps={{ shrink: true }} type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />

          <TextField label="Vorrat" InputLabelProps={{ shrink: true }} type="number" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} />
          <TextField label="Bild-URL" InputLabelProps={{ shrink: true }} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button color="error" variant="outlined" onClick={handleCloseDialog}>Abbrechen</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingDrink ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );

};

export default DrinksManagement;
