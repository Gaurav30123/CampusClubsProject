import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

// Auth
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Clubs
export const fetchClubs = () => API.get('/clubs');
export const fetchClub = (id) => API.get(`/clubs/${id}`);
export const createClub = (newClub) => API.post('/clubs', newClub);
export const updateClub = (id, updatedClub) => API.patch(`/clubs/${id}`, updatedClub);
export const deleteClub = (id) => API.delete(`/clubs/${id}`);
export const joinClub = (id) => API.post(`/clubs/${id}/join`);
export const leaveClub = (id) => API.post(`/clubs/${id}/leave`);

// Events
export const fetchEvents = () => API.get('/events');
export const fetchEventsByClub = (clubId) => API.get(`/events/club/${clubId}`);
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, updatedEvent) => API.patch(`/events/${id}`, updatedEvent);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Announcements
export const fetchAnnouncementsByClub = (clubId) => API.get(`/announcements/club/${clubId}`);
export const createAnnouncement = (newAnnouncement) => API.post('/announcements', newAnnouncement);
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);
