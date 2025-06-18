import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { PointOfSale } from '@mui/icons-material';
import { publicAxios } from '../api/axiosInstance';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// Definiere den Typ für ein Getränk
interface Drink {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
}

// Definiere den Typ für ein Nutzer
interface User {
    id: string;
    name: string;
    guthaben: number;
    is_admin: boolean;
}

// Komponente für ein einzelnes Getränk
const DrinkCard: React.FC<{
    drink: Drink;
    onBookDrink: (drinkId: number) => void;
}> = ({ drink, onBookDrink }) => {
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            width: '250px',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
            }
        }}>
            <CardMedia
                component="img"
                height="250"
                image={drink.imageUrl}
                alt={drink.name}
                sx={{
                    mt: '10px',
                    objectFit: 'contain'
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {drink.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                        {drink.price.toFixed(2)} €
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} color={drink.stock > 5 ? "success.main" : "warning.main"}>
                        Vorrat: {drink.stock}
                    </Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<PointOfSale />}
                    onClick={() => onBookDrink(drink.id)}
                    fullWidth
                    disabled={drink.stock === 0}
                >
                    {drink.stock === 0 ? 'Ausverkauft' : 'Buchen'}
                </Button>
            </CardActions>
        </Card>
    );
};

// Getränkeübersicht 
const DrinkOverview: React.FC = () => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userData = useSelector((state: RootState) => state.user.userData);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // API-Call für Getränkeübersicht & Nutzer(Guthaben)
    useEffect(() => {
        const fetchData = async () => {
            if (!userData?.credentials) return;

            const auth = {
                username: userData.credentials.username,
                password: userData.credentials.password,
            };

            try {
                const [drinksRes, userRes] = await Promise.all([
                    publicAxios.get('/drinks/', { auth }),
                    publicAxios.get('/users/me', { auth }),
                ]);

                setDrinks(
                    drinksRes.data.map((drink: any) => ({
                        id: drink.id,
                        name: drink.name,
                        imageUrl: drink.imageUrl,
                        price: parseFloat(drink.cost),
                        stock: drink.count,
                    }))
                );

                setUser({
                    id: userRes.data.id,
                    name: userRes.data.name,
                    guthaben: parseFloat(userRes.data.guthaben),
                    is_admin: userRes.data.is_admin,
                });

            } catch (err) {
                console.error('Fehler beim Laden:', err);
                setError('Daten konnten nicht geladen werden.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userData]);

    // API-Call für Getränk buchen
    const handleBookDrink = async (drinkId: number) => {
        const selectedDrink = drinks.find(drink => drink.id === drinkId);
        if (!selectedDrink || !userData?.credentials) return;

        try {
            await publicAxios.post('/transactions/', {
                drink_id: drinkId,
                amount: 1,
            }, {
                auth: {
                    username: userData.credentials.username,
                    password: userData.credentials.password,
                },
            });

            setDrinks(prev =>
                prev.map(drink =>
                    drink.id === drinkId
                        ? { ...drink, stock: drink.stock - 1 }
                        : drink
                )
            );

            setUser(prev =>
                prev
                    ? { ...prev, guthaben: prev.guthaben - selectedDrink.price }
                    : prev
            );

            setSnackbar({
                open: true,
                message: `${selectedDrink.name} wurde gebucht`,
                severity: 'success',
            });
        } catch (err) {
            console.error('Fehler beim Buchen des Getränks:', err);
            setSnackbar({
                open: true,
                message: 'Buchung fehlgeschlagen',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
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

    // Layout und Styling
    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    height: '100vh',
                    padding: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'left',
                                color: 'primary.main',
                            }}
                        >
                            Getränkeübersicht
                        </Typography>

                        <Box
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'white',
                                px: 3,
                                py: 1,
                                borderRadius: '12px',
                                boxShadow: 2,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            {user ? (
                                <>
                                    <AccountBalanceWalletIcon sx={{ color: 'white' }} />
                                    Guthaben: {user.guthaben.toFixed(2)} €
                                </>
                            ) : (
                                <>
                                    <AccountBalanceWalletIcon sx={{ color: 'white' }} />
                                    Guthaben: ...
                                </>
                            )}

                        </Box>

                    </Box>

                    <Grid container spacing={6}>
                        {drinks.map(drink => (
                            <Grid>
                                <DrinkCard drink={drink} onBookDrink={handleBookDrink} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default DrinkOverview;
