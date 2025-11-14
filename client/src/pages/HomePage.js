import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to CampusClubs
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The best place to discover and connect with clubs and organizations on your campus.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} to="/clubs" sx={{ mr: 2 }}>
            Explore Clubs
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/events">
            Upcoming Events
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
