import React from 'react';
import type{ Booking } from './types';
import styles from './upcomingtrips.module.css';

const mockBookings: Booking[] = [
  {
    id: 1,
    propertyId: 101,
    propertyName: 'Cozy Mountain Cabin',
    startDate: '2025-08-10',
    endDate: '2025-08-15',
    status: 'Confirmed',
    price: 750,
  },
  {
    id: 2,
    propertyId: 102,
    propertyName: 'Downtown Apartment',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    status: 'Pending',
    price: 450,
  },
];

const statusColors: Record<string, string> = {
  Confirmed: '#2E8B57',
  Pending: '#DAA520',
  Cancelled: '#B22222',
};

const UpcomingTrips: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2>Upcoming Trips</h2>
      {mockBookings.length === 0 ? (
        <p>No upcoming trips.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Property</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.propertyName}</td>
                <td>
                  {new Date(booking.startDate).toLocaleDateString()} -{' '}
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td style={{ color: statusColors[booking.status] }}>{booking.status}</td>
                <td>${booking.price.toFixed(2)}</td>
                <td>
                  {booking.status === 'Confirmed' && (
                    <button className={styles.cancelBtn}>Cancel</button>
                  )}
                  {booking.status === 'Pending' && <button disabled>Pending</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default UpcomingTrips;
