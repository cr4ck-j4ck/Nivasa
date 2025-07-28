import React from 'react';
import { type Review } from './types';
import styles from './reviewlist.module.css';

const mockReviews: Review[] = [
  {
    id: 1,
    guestName: 'John Doe',
    rating: 5,
    comment: 'Amazing host, very responsive and helpful!',
    date: '2025-06-15',
  },
  {
    id: 2,
    guestName: 'Jane Smith',
    rating: 4,
    comment: 'Great place to stay, clean and cozy.',
    date: '2025-05-28',
  },
];

const ReviewsList: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2>Recent Reviews</h2>
      {mockReviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className={styles.reviewList}>
          {mockReviews.map(review => (
            <li key={review.id} className={styles.reviewItem}>
              <div className={styles.header}>
                <strong>{review.guestName}</strong>{' '}
                <span>{'⭐'.repeat(review.rating)}</span>{' '}
                <span className={styles.date}>
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReviewsList;
