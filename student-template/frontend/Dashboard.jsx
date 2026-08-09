import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryAlerts = async () => {
      try {
        const response = await fetch('/api/inventory/alerts');

        if (!response.ok) {
          throw new Error('Failed to fetch inventory alerts');
        }

        const data = await response.json();
        setInventoryData(data);
      } catch (error) {
        console.error('Error fetching inventory alerts:', error);
        setInventoryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryAlerts();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (inventoryData.length === 0) {
    return <p>All inventory levels are healthy.</p>;
  }

  return (
    <div>
      <h2>Inventory Alerts</h2>

      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
          </tr>
        </thead>

        <tbody>
          {inventoryData.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.quantity}</td>
              <td>{item.reorder_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
