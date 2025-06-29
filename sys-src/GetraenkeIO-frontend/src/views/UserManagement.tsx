import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { type UserManagementData } from "../models/userModels";
import { usermgmtService } from "../features/usermgmt/usermgmtService";
import { FaCalendarAlt, FaEuroSign, FaHashtag, FaHistory, FaPen, FaWineBottle } from "react-icons/fa";
import { type Transaction } from "../models/transactionModels";

const UserManagement = () => {
  const [usermgmtdata, setUsermgmtdata] = useState<UserManagementData[]>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [historyDialogeOpen, setHistoryDialogOpen] = useState(false);
  const [currentRecharge, setCurrentRecharge] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserTrans, setCurrentUserTrans] = useState<Transaction[]>([])

  const [errorMessage, setErrorMessage] = useState('');

  const userData = useSelector((state: RootState) => state.user.userData);
  useEffect(() => {
    if (!userData) {
      return
    }

    usermgmtService.getAllUserData(userData)
      .then((data) => {
        setUsermgmtdata(data)
      })
      .catch((err) => {
        console.log("Error when loading userdata: ", err)
      })
  }, [userData])


  const editUserBalance = (userId: string, userName: string) => {
    setCurrentUserId(userId);
    setCurrentUserName(userName);
    setCurrentRecharge('');
    setEditDialogOpen(true);
  }

  const handleRechargeClose = () => {
    setEditDialogOpen(false)
    setCurrentUserId('');
  }

  const handleApply = async () => {
    if (!userData || isNaN(Number(currentRecharge))) {
      setErrorMessage('Ungültiger Eingabewert!');
      return
    }

    try {
      await usermgmtService.updateUserRecharge(currentUserId, Number(currentRecharge), userData);

      const updatedData = await usermgmtService.getAllUserData(userData);
      setUsermgmtdata(updatedData);
    } catch (e: any) {
      setErrorMessage('Fehler beim Aktualisieren des Guthabens!')
    }

    setEditDialogOpen(false);
    setCurrentUserId('');
    setCurrentUserName('');
    setCurrentRecharge('');
  }

  const openUserHistory = async (userId: string, userName: string) => {
    if (!userData) {
      return
    }

    usermgmtService.getUserTransactions(userName, userData)
      .then((data) => {
        setCurrentUserTrans(data)
      })
      .catch((err) => {
        console.log('Error when loading user transactions: ', err)
      })

    setCurrentUserName(userName);
    setCurrentUserId(userId);
    setHistoryDialogOpen(true);
  }

  const handleHistoryClose = () => {
    setHistoryDialogOpen(false);
    setCurrentUserId('');
    setCurrentUserName('');
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString() +
      ' – ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Box sx={{
        flexGrow: 1,
        color: 'white',
        padding: 4,
        overflowY: 'auto'
      }}>
        <Card
          sx={{
            backgroundColor: 'rgba(250, 250, 250, 0.95)',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 64px)',
            width: '100%'
          }}>
          <CardContent
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              padding: 0,
              overflow: 'auto',
              flexGrow: 1
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
                  }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Id
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Benutername
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Guthaben
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Admin
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      History
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usermgmtdata.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Keine Benutzer gefunden.
                    </TableCell>
                  </TableRow>
                )}

                {usermgmtdata.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{Number(user.guthaben).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          minWidth: 36,
                          height: 36,
                          padding: 0,
                          marginLeft: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => editUserBalance(user.id, user.name)}
                      >
                        <FaPen />
                      </Button>
                    </TableCell>
                    <TableCell>{user.is_admin ? 'ja' : 'nein'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          minWidth: 36,
                          height: 36,
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => openUserHistory(user.id, user.name)}
                      >
                        <FaHistory />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={editDialogOpen} onClose={handleRechargeClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Guthaben für {currentUserName} bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Guthaben"
            type="number"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={!!errorMessage}
            value={currentRecharge}
            onChange={(e) => {
              setCurrentRecharge(e.target.value);
              setErrorMessage('');
            }}
          />
          {errorMessage && (
            <Box mt={1} color="error.main" fontSize="0.9rem">
              {errorMessage}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'space-between',
            px: 3,
            pb: 2,
          }}>
          <Button
            onClick={handleRechargeClose}
            color="error"
            variant="outlined">
            Abbrechen
          </Button>
          <Button
            onClick={handleApply}
            color="primary"
            variant="contained"
            disabled={currentRecharge.toString().trim() === ''}>
            Übernehmen
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={historyDialogeOpen} onClose={handleHistoryClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Kaufhistorie
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, pl: 1 }}>
            <strong>Benutzer:</strong> {currentUserName}
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#1976d2',
                  '& .MuiTableCell-head': {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: 'none',
                    padding: '10px 16px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaWineBottle />
                    Produkt
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaHashtag />
                    Menge
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaCalendarAlt />
                    Datum
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <FaEuroSign />
                    Preis
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUserTrans.map((item) => (
                <TableRow key={item.transaction_id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell align="right">{parseFloat(item.cost).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {currentUserTrans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Keine Bestellungen vorhanden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleHistoryClose} color="primary" variant="outlined">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default UserManagement;
