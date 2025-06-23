import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import TrainList from './components/TrainList';
import AdminPanel from './components/AdminPanel';
import SeatBooking from './components/SeatBooking';
import { API } from './utils/api';

function App() {
  const [view, setView] = useState('login');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [trainName, setTrainName] = useState('');
  const [trainId, setTrainId] = useState('');
  const [timing, setTiming] = useState('');
  const [totalSeats, setTotalSeats] = useState(50);
  const [ticketPrice, setTicketPrice] = useState(100);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch trains
  const fetchTrains = async () => {
    const res = await fetch(`${API}/trains`);
    const data = await res.json();
    setTrains(data);
  };

  const fetchSeatDetails = async (trainId) => {
    const res = await fetch(`${API}/train-seats/${trainId}`, {
      headers: { Authorization: token }
    });
    const data = await res.json();
    setSelectedTrain(data);
    setSelectedSeats([]);
    setMessage('');
  };

  const fetchMyBookings = async () => {
    const res = await fetch(`${API}/my-bookings`, {
      headers: { Authorization: token }
    });
    if (res.status === 403) return;
    const data = await res.json();
    setBookings(data);
  };

  const downloadCSV = async () => {
    const res = await fetch(`${API}/export-bookings`, {
      headers: { Authorization: token }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
  };

  useEffect(() => {
    if (token) {
      fetchTrains();
      setUsername(getUsername());
    }
  }, [token]);

  const handleAddTrain = async () => {
    await fetch(`${API}/trains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ trainName, trainId, timing, totalSeats, ticketPrice })
    });
    fetchTrains();
    setMessage(`Train "${trainName}" added successfully.`);
  };

  const handleDeleteTrain = async (trainId) => {
    await fetch(`${API}/trains/${trainId}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    });
    fetchTrains();
    setSelectedTrain(null);
    setMessage('Train deleted successfully.');
  };

  const handleBookMultipleSeats = async () => {
    for (let seatNumber of selectedSeats) {
      await fetch(`${API}/book/${selectedTrain.trainId}/${seatNumber}`, {
        method: 'POST',
        headers: { Authorization: token }
      });
    }
    setMessage(`Payment Success! Booked ${selectedSeats.length} seats. Total Paid: ₹${selectedSeats.length * selectedTrain.ticketPrice}`);
    fetchSeatDetails(selectedTrain.trainId);
    fetchMyBookings();
  };

  const getUserRole = () => {
    try {
      return JSON.parse(atob(token.split('.')[1])).role;
    } catch {
      return null;
    }
  };

  const getUsername = () => {
    try {
      return JSON.parse(atob(token.split('.')[1])).username;
    } catch {
      return '';
    }
  };

  const toggleSeatSelection = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter(n => n !== seatNumber) : [...prev, seatNumber]
    );
  };

  if (!token) {
    return (
      <AuthForm
        setToken={setToken}
        view={view}
        setView={setView}
        setMessage={setMessage}
      />
    );
  }

  return (
    <div className="app">
      <h1>Train List</h1>
      {message && <p className="message">{message}</p>}

      <TrainList
        trains={trains}
        fetchSeatDetails={fetchSeatDetails}
        getUserRole={getUserRole}
        handleDeleteTrain={handleDeleteTrain}
      />

      {getUserRole() === 'admin' && (
        <AdminPanel
          setTrainName={setTrainName}
          setTrainId={setTrainId}
          setTiming={setTiming}
          setTotalSeats={setTotalSeats}
          setTicketPrice={setTicketPrice}
          handleAddTrain={handleAddTrain}
          downloadCSV={downloadCSV}
        />
      )}

      {selectedTrain && (
        <SeatBooking
          selectedTrain={selectedTrain}
          username={username}
          selectedSeats={selectedSeats}
          toggleSeatSelection={toggleSeatSelection}
          handleBookMultipleSeats={handleBookMultipleSeats}
        />
      )}

      {getUserRole() === 'user' && (
        <div style={{ marginTop: '30px' }}>
          <h2>My Bookings</h2>
          <button onClick={fetchMyBookings}>Show My Bookings</button>
          <ul>
            {bookings.map((b, i) => (
              <li key={i}>{b.trainName} ({b.trainId}) - Seat {b.seatNumber}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="logout-btn" onClick={() => {
        localStorage.removeItem('token');
        setToken(null);
      }}>
        Logout
      </button>
    </div>
  );
}

export default App;
