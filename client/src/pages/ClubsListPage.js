import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchClubs } from '../api/api';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

const ClubsListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getClubs = async () => {
      try {
        const { data } = await fetchClubs();
        setClubs(data);
      } catch (err) {
        setError('Failed to fetch clubs.');
      }
      setLoading(false);
    };
    getClubs();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Explore Clubs</Typography>
      <Grid container spacing={4}>
        {clubs.map((club) => (
          <Grid item key={club._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={club.banner}
                alt={club.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {club.name}
                </Typography>
                <Typography>
                  {club.description.substring(0, 100)}...
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button component={Link} to={`/clubs/${club._id}`} size="small">View Details</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClubsListPage;
