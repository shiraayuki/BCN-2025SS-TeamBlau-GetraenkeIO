import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import CustomSidebar from "../components/HomeSidebar";
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { type UserManagementData } from "../models/userModels";
import { usermgmtService } from "../features/usermgmt/usermgmtService";
import { FaHistory, FaPen } from "react-icons/fa";

const UserManagement = () => {
  const [usermgmtdata, setUsermgmtdata] = useState<UserManagementData[]>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRecharge, setCurrentRecharge] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

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

  const openUserHistory = (userId: string) => {
  }

  const editUserBalance = (userId: string) => {
    setCurrentUserId(userId);
    setCurrentRecharge('');
    setEditDialogOpen(true);
  }

  const handleClose = () => {
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
    } catch (e: any) {
      setErrorMessage('Fehler beim Aktualisieren des Guthabens!')
    }


    setCurrentUserId('');
    setCurrentRecharge('');
    setEditDialogOpen(false);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CustomSidebar />

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
                    <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{user.guthaben}
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
                        onClick={() => editUserBalance(user.id)}
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
                        onClick={() => openUserHistory(user.id)}
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

      <Dialog open={editDialogOpen} onClose={handleClose}>
        <DialogTitle>Guthaben bearbeiten</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Guthaben"
            type="number"
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
            error={errorMessage != ''}
            value={currentRecharge}
            onChange={(e) => { setCurrentRecharge(e.target.value); setErrorMessage('') }}
          />
          {errorMessage && (
            <Box mt={1} color="error.main" fontSize="0.9rem">
              {errorMessage}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingX: 3,
            paddingBottom: 2,
          }}>
          <Button
            onClick={handleClose}
            color="error"
            variant="contained">
            Abbrechen
          </Button>
          <Button
            onClick={handleApply}
            color="primary"
            variant="contained"
            disabled={currentRecharge.toString().trim() === ''}>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default UserManagement;
