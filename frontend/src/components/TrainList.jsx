import React from 'react';

export default function TrainList({ trains, fetchSeatDetails, getUserRole, handleDeleteTrain }) {
  return (
    <ul>
      {trains.map((t, i) => (
        <li key={i}>
          {t.trainName} - {t.trainId} - {t.timing} - ₹{t.ticketPrice}
          <button onClick={() => fetchSeatDetails(t.trainId)}>View Seats</button>
          {getUserRole() === 'admin' && (
            <button
              onClick={() => handleDeleteTrain(t.trainId)}
              style={{ marginLeft: '10px', backgroundColor: 'red' }}
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
