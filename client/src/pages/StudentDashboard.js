import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchClubs, fetchEventsByClub } from '../api/api';
import AuthContext from '../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // This is inefficient. In a real app, you'd have a dedicated endpoint 
        // to get a user's clubs and their events.
        const { data: allClubs } = await fetchClubs();
        const myClubs = allClubs.filter(club => club.members.includes(user._id));
        setJoinedClubs(myClubs);

        const eventsPromises = myClubs.map(club => fetchEventsByClub(club._id));
        const eventsResults = await Promise.all(eventsPromises);
        const allEvents = eventsResults.flatMap(res => res.data);
        setUpcomingEvents(allEvents.filter(event => new Date(event.date) >= new Date()));

      } catch (err) {
        setError('Failed to fetch dashboard data.');
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Student Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>My Clubs</Typography>
          {joinedClubs.length > 0 ? (
            <List>
              {joinedClubs.map(club => (
                <ListItem key={club._id} button component={Link} to={`/clubs/${club._id}`}>
                  <ListItemText primary={club.name} />
                </ListItem>
              ))}
            </List>
          ) : <Typography>You haven't joined any clubs yet.</Typography>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Upcoming Events</Typography>
          {upcomingEvents.length > 0 ? (
            <List>
              {upcomingEvents.map(event => (
                <ListItem key={event._id}>
                  <ListItemText 
                    primary={event.title} 
                    secondary={`${new Date(event.date).toLocaleDateString()} - ${event.venue}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : <Typography>No upcoming events from your clubs.</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
