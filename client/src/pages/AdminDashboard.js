import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchClubs, createEvent, createAnnouncement } from '../api/api';
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
  Button,
  CircularProgress,
  Alert,
  TextField,
  Box
} from '@mui/material';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for forms
  const [eventClub, setEventClub] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [announcementClub, setAnnouncementClub] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data: allClubs } = await fetchClubs();
        setMyClubs(allClubs.filter(club => club.adminId._id === user._id));
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
        await createEvent({ clubId: eventClub, title: eventTitle, description: 'TBD', date: new Date(), time: 'TBD', venue: 'TBD' });
        alert('Event created!');
        // clear form
        setEventClub('');
        setEventTitle('');
    } catch (error) {
        alert('Failed to create event');
    }
  }

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
        await createAnnouncement({ clubId: announcementClub, title: announcementTitle, content: announcementContent });
        alert('Announcement posted!');
        // clear form
        setAnnouncementClub('');
        setAnnouncementTitle('');
        setAnnouncementContent('');
    } catch (error) {
        alert('Failed to post announcement');
    }
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>My Clubs</Typography>
          {myClubs.length > 0 ? (
            <List>
              {myClubs.map(club => (
                <ListItem key={club._id} button component={Link} to={`/clubs/${club._id}`}>
                  <ListItemText primary={club.name} secondary={`${club.members.length} members`} />
                </ListItem>
              ))}
            </List>
          ) : <Typography>You haven't created any clubs yet.</Typography>}
           <Button component={Link} to="/clubs/create" variant="contained" sx={{mt: 2}}>Create New Club</Button>
        </Grid>

        <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>Quick Actions</Typography>
            
            {/* Create Event Form */}
            <Box component="form" onSubmit={handleCreateEvent} sx={{mb: 4}}>
                <Typography variant="h6">Create Event</Typography>
                <TextField select fullWidth label="Select Club" value={eventClub} onChange={e => setEventClub(e.target.value)} SelectProps={{ native: true }} sx={{mb: 1}}><option value=""></option>{myClubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</TextField>
                <TextField fullWidth label="Event Title" value={eventTitle} onChange={e => setEventTitle(e.target.value)} sx={{mb: 1}}/>
                <Button type="submit" variant="contained">Create Event</Button>
            </Box>

            {/* Create Announcement Form */}
            <Box component="form" onSubmit={handleCreateAnnouncement}>
                <Typography variant="h6">Post Announcement</Typography>
                <TextField select fullWidth label="Select Club" value={announcementClub} onChange={e => setAnnouncementClub(e.target.value)} SelectProps={{ native: true }} sx={{mb: 1}}><option value=""></option>{myClubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</TextField>
                <TextField fullWidth label="Announcement Title" value={announcementTitle} onChange={e => setAnnouncementTitle(e.target.value)} sx={{mb: 1}}/>
                <TextField fullWidth multiline rows={3} label="Content" value={announcementContent} onChange={e => setAnnouncementContent(e.target.value)} sx={{mb: 1}}/>
                <Button type="submit" variant="contained">Post Announcement</Button>
            </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
