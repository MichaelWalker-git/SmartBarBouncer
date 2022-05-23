import React from 'react';
import './App.css';
import {Video} from "./components/video";
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material';

function App() {
    const theme = createTheme();

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <main>
                    {/* Hero unit */}
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            pt: 8,
                            pb: 6,
                        }}
                    >
                        <Container maxWidth="sm">
                            <Typography
                                component="h1"
                                variant="h2"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                Smart Bar Bouncer
                            </Typography>
                            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                                Something short and leading about the collection below—its contents,
                                the creator, etc. Make it short and sweet, but not too short so folks
                                don&apos;t simply skip over it entirely.
                            </Typography>

                        </Container>
                    </Box>
                    <Container sx={{py: 8}} maxWidth="md">
                        <Grid container spacing={4}>
                            <Grid item key={"12"} xs={12} sm={6} md={4}>
                                <Video/>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </ThemeProvider>
        </div>
    );
}

export default App;
