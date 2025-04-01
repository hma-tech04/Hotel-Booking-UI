// src/pages/Admin/UsersManagement.js
import React, { useEffect, useState } from 'react';
import HeaderAdmin from '../../components/HeaderAdmin';
import FooterAdmin from '../../components/FooterAdmin';

function UsersManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Giả sử có API hoặc dữ liệu mẫu
    const dummyUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
    setUsers(dummyUsers);
  }, []);

  return (
    <>
      <HeaderAdmin />
      <div className="container">
        <h2>Users Management</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => alert(`View user ${user.id}`)}>View</button>
                  <button onClick={() => alert(`Delete user ${user.id}`)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FooterAdmin />
    </>
  );
}

export default UsersManagement;
