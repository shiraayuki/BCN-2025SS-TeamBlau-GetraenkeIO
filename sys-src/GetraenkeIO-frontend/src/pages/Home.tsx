import { Box, Typography, Card, CardContent } from '@mui/material';

const Home = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      px={3}
      sx={{ backgroundColor: 'white' }}
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 900,
          width: '90%',
          borderRadius: 3,
          padding: 4,
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent>
          <Typography
            variant="h2"
            component="h1"
            color="primary"
            fontWeight="bold"
            gutterBottom
            align="center"
          >
            Willkommen bei GetränkeIO
          </Typography>

          <Typography
            variant="body1"
            sx={{ fontSize: '1.15rem', lineHeight: 1.6, color: '#333', textAlign: 'center' }}
          >
            GetränkeIO ist deine digitale Plattform zum unkomplizierten Kauf von Getränken.
            <br />
            <br />
            Auf der Seite <strong>"Getränke"</strong> kannst du dein aktuelles Guthaben einsehen sowie verfügbare Getränke mit Preis und Bestand anzeigen lassen.
            <br />
            <br />
            Mit einem Klick auf <strong>"Buchen"</strong> kannst du ein Getränk direkt kaufen.
            <br />
            <br />
            Unter <strong>"Kaufverlauf"</strong> findest du eine Übersicht über alle deine bisherigen Bestellungen.
            <br />
            <br />
            Das Aufladen deines Guthabens erfolgt durch den jeweiligen Getränkewart.
            <br />
            <br />
            Die Navigation erfolgt bequem über die Seitenleiste links.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
