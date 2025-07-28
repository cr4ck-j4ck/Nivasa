import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './earning.module.css';

const data = [
  { month: 'Jan', earnings: 400 },
  { month: 'Feb', earnings: 700 },
  { month: 'Mar', earnings: 1200 },
  { month: 'Apr', earnings: 1500 },
  { month: 'May', earnings: 1000 },
  { month: 'Jun', earnings: 1800 },
  { month: 'Jul', earnings: 2200 },
  { month: 'Aug', earnings: 2600 },
  { month: 'Sep', earnings: 2400 },
  { month: 'Oct', earnings: 2800 },
  { month: 'Nov', earnings: 3000 },
  { month: 'Dec', earnings: 3500 },
];

const EarningsChart: React.FC = () => {
  return (
    <section className={styles.section}>
      <h2>Earnings (Last 12 Months)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Line type="monotone" dataKey="earnings" stroke="#2E8B57" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default EarningsChart;
