import React from 'react';

export default function AdminPanel({
  setTrainName, setTrainId, setTiming, setTotalSeats,
  setTicketPrice, handleAddTrain, downloadCSV
}) {
  return (
    <div className="admin-section">
      <h2>Add Train</h2>
      <input placeholder="Train Name" onChange={(e) => setTrainName(e.target.value)} />
      <input placeholder="Train ID" onChange={(e) => setTrainId(e.target.value)} />
      <input placeholder="Timing" onChange={(e) => setTiming(e.target.value)} />
      <input placeholder="Total Seats" type="number" defaultValue={50} onChange={(e) => setTotalSeats(+e.target.value)} />
      <input placeholder="Ticket Price (₹)" type="number" defaultValue={100} onChange={(e) => setTicketPrice(+e.target.value)} />
      <button onClick={handleAddTrain}>Add Train</button>
      <button onClick={downloadCSV} style={{ marginLeft: '10px' }}>Download Bookings CSV</button>
    </div>
  );
}
