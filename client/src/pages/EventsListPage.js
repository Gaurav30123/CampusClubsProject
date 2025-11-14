import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../api/api';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

const EventsListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getEvents = async () => {
      try {
        const { data } = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to fetch events.');
      }
      setLoading(false);
    };
    getEvents();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={event.banner}
                alt={event.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography color="text.secondary">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {event.venue}
                </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Club: {event.clubId.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventsListPage;
