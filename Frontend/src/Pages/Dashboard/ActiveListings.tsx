import React from 'react';
import type { Listing } from './types';
import styles from './activelistings.module.css';

const mockListings: Listing[] = [
  {
    id: 1,
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, CO',
    pricePerNight: 150,
    photoUrl: 'https://blog.lohono.com/wp-content/uploads/2024/05/Glass-House-41-scaled.jpg',
    isActive: true,
  },
  {
    id: 2,
    title: 'Downtown Apartment',
    location: 'New York, NY',
    pricePerNight: 90,
    photoUrl: 'https://www.summertimegoa.com/img/Summertime-Winner_of_the_World_Boutique_Hotel_Award_2016.jpg',
    isActive: true,
  },
  {
    id: 3,
    title: 'Beachside Bungalow',
    location: 'Miami, FL',
    pricePerNight: 200,
    photoUrl: 'https://www.buildofy.com/blog/content/images/2024/01/23-06-30-Gautham-Residence-122-1.jpg',
    isActive: false,
  },
];

const ActiveListings: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2>Your Listings</h2>
      <div className={styles.grid}>
        {mockListings.map(listing => (
          <div key={listing.id} className={styles.card}>
            <img src={listing.photoUrl} alt={listing.title} className={styles.photo} />
            <div className={styles.info}>
              <h3>{listing.title}</h3>
              <p>{listing.location}</p>
              <p>${listing.pricePerNight} / night</p>
              <p>
                Status:{' '}
                <span
                  style={{
                    color: listing.isActive ? '#2E8B57' : '#B22222',
                    fontWeight: 'bold',
                  }}
                >
                  {listing.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
              <div className={styles.actions}>
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveListings;
