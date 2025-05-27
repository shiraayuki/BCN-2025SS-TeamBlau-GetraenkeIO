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
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CustomSidebar from '../components/HomeSidebar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Definiere den Typ für ein Getränk
interface Drink {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
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
                    startIcon={<PointOfSaleIcon />}
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

// Getränkeübersicht (Dummy-Daten)
const DrinkOverview: React.FC = () => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const mockDrinks: Drink[] = [
                    { id: 1, name: 'Cola', price: 1.50, imageUrl: '/drinks/cola.png', stock: 24 },
                    { id: 2, name: 'Fanta', price: 1.50, imageUrl: '/drinks/fanta.png', stock: 18 },
                    { id: 3, name: 'Bier', price: 1.00, imageUrl: '/drinks/bier.png', stock: 12 },
                    { id: 4, name: 'Apfelschorle', price: 1.20, imageUrl: '/api/placeholder/300/200', stock: 5 },
                    { id: 5, name: 'Wasser', price: 1.00, imageUrl: '/api/placeholder/300/200', stock: 36 },
                    { id: 6, name: 'Energy Drink', price: 2.50, imageUrl: '/api/placeholder/300/200', stock: 0 }
                ];
                setTimeout(() => {
                    setDrinks(mockDrinks);
                    setLoading(false);
                }, 800);
            } catch (err) {
                console.error('Fehler beim Laden der Getränke:', err);
                setError('Getränke konnten nicht geladen werden.');
                setLoading(false);
            }
        };

        fetchDrinks();
    }, []);


    // Snackbar wenn Getränk gebucht wurde
    const handleBookDrink = (drinkId: number) => {
        const selectedDrink = drinks.find(drink => drink.id === drinkId);

        if (selectedDrink) {
            console.log(`${selectedDrink.name} gebucht`);
            setSnackbar({
                open: true,
                message: `${selectedDrink.name} wurde gebucht`,
                severity: 'success'
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

    return (
        <Box sx={{ display: 'flex' }}>
            <CustomSidebar />

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
                            <AccountBalanceWalletIcon sx={{ color: 'white' }} />
                            Guthaben: 10,00 €
                        </Box>

                    </Box>

                    <Grid container spacing={6}>
                        {drinks.map(drink => (
                            <Grid item key={drink.id} xs={12} sm={6} md={4}>
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
