import React from 'react';

export default function SeatBooking({ selectedTrain, username, selectedSeats, toggleSeatSelection, handleBookMultipleSeats }) {
  return (
    <div>
      <h2>Seats for Train: {selectedTrain.trainName}</h2>
      <p>Total: {selectedTrain.totalSeats} | Booked: {selectedTrain.bookedCount} | Price: ₹{selectedTrain.ticketPrice}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {selectedTrain.seats.map(seat => (
          <div key={seat.number} style={{ margin: 5 }}>
            <button
              style={{
                backgroundColor: seat.bookedBy
                  ? (seat.bookedBy === username ? 'green' : 'gray')
                  : (selectedSeats.includes(seat.number) ? 'orange' : 'lightblue'),
                color: '#fff'
              }}
              disabled={!!seat.bookedBy}
              onClick={() => toggleSeatSelection(seat.number)}
            >
              Seat {seat.number}
              {seat.bookedBy ? `\n(${seat.bookedBy})` : ''}
            </button>
          </div>
        ))}
      </div>
      {selectedSeats.length > 0 && (
        <div>
          <p>Selected: {selectedSeats.join(', ')} | Total: ₹{selectedSeats.length * selectedTrain.ticketPrice}</p>
          <button onClick={handleBookMultipleSeats}>Book Selected Seats</button>
        </div>
      )}
    </div>
  );
}
