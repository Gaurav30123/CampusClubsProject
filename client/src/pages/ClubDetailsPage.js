import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClub, joinClub, leaveClub, deleteClub, fetchAnnouncementsByClub, fetchEventsByClub } from '../api/api';
import AuthContext from '../context/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isMember = club?.members.some(member => member._id === user?._id);
  const isAdmin = club?.adminId._id === user?._id;

  useEffect(() => {
    const getClubData = async () => {
      try {
        setLoading(true);
        const { data: clubData } = await fetchClub(id);
        setClub(clubData);

        const { data: announcementsData } = await fetchAnnouncementsByClub(id);
        setAnnouncements(announcementsData);

        const { data: eventsData } = await fetchEventsByClub(id);
        setEvents(eventsData);

      } catch (err) {
        setError('Failed to fetch club details.');
      }
      setLoading(false);
    };
    getClubData();
  }, [id]);

  const handleJoin = async () => {
    try {
      await joinClub(id);
      // Refresh data
      const { data } = await fetchClub(id);
      setClub(data);
    } catch (err) {
      setError('Failed to join club.');
    }
  };

  const handleLeave = async () => {
    try {
      await leaveClub(id);
      // Refresh data
      const { data } = await fetchClub(id);
      setClub(data);
    } catch (err) {
      setError('Failed to leave club.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this club?')) {
        try {
            await deleteClub(id);
            navigate('/clubs');
        } catch (err) {
            setError('Failed to delete club.');
        }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!club) return <Typography>Club not found.</Typography>;

  return (
    <Container>
        <Box sx={{ my: 4 }}>
            <img src={club.banner} alt={club.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            <Typography variant="h3" component="h1" gutterBottom>{club.name}</Typography>
            <Typography variant="h6" color="text.secondary">Category: {club.category}</Typography>
            <Typography paragraph sx={{ mt: 2 }}>{club.description}</Typography>
            <Typography variant="body2">Admin: {club.adminId.name}</Typography>

            {user && (
                <Box sx={{ mt: 2 }}>
                    {!isMember && user.role === 'student' && <Button variant="contained" onClick={handleJoin}>Join Club</Button>}
                    {isMember && user.role === 'student' && <Button variant="outlined" onClick={handleLeave}>Leave Club</Button>}
                    {isAdmin && <Button variant="contained" color="secondary" onClick={handleDelete} sx={{ ml: 2 }}>Delete Club</Button>}
                    {isAdmin && <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate(`/clubs/edit/${id}`)}>Edit Club</Button>}
                </Box>
            )}
        </Box>

        <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>Announcements</Typography>
                {announcements.length > 0 ? (
                    <List>
                        {announcements.map(ann => (
                            <ListItem key={ann._id} alignItems="flex-start">
                                <ListItemText primary={ann.title} secondary={<>{ann.content}<br/>-{ann.authorId.name}</>} />
                            </ListItem>
                        ))}
                    </List>
                ) : <Typography>No announcements yet.</Typography>}

                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Upcoming Events</Typography>
                {events.length > 0 ? (
                    <List>
                        {events.map(event => (
                            <ListItem key={event._id}>
                                <ListItemText primary={event.title} secondary={`${new Date(event.date).toLocaleDateString()} at ${event.time} - ${event.venue}`} />
                            </ListItem>
                        ))}
                    </List>
                ) : <Typography>No events scheduled.</Typography>}
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h5" gutterBottom>Members ({club.members.length})</Typography>
                <List>
                    {club.members.map(member => (
                        <ListItem key={member._id}>
                            <ListItemText primary={member.name} />
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    </Container>
  );
};

export default ClubDetailsPage;
