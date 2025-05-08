import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    name: '',
    password: '',
    email: '',
    mobileNumber: '',
  });

  // Fetch Users from the API
  useEffect(() => {
    axios
      .get('http://localhost:5000/getuser')
      .then((response) => {
        console.log(response, 'getting');
        setUsers(response.data);
         // Directly setting the fetched data
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Wrapping formData in "data" key as per requirement
    const payload = {
      data: formData,
    };

    axios
      .post('http://localhost:5000/adduser', payload)
      .then((response) => {
        // Refresh the users list
        setUsers([...users, response.data.data]); // Assuming "data" key in response
        setFormData({ user: '', name: '', password: '', email: '', mobileNumber: '' });
        window.location.href='/admin'
        toast.success('user added successfully')
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log(users, 'gbkk');

  return (
    <div className="App">


      <main>
        <section className="form-section">
          <h2>Add User</h2>
          <form onSubmit={handleSubmit}>
            <label>
              User:
              <input
                type="text"
                name="user"
                placeholder="user...."
                value={formData.user}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                placeholder="name....."
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                placeholder="password......"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                placeholder="email......."
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Mobile Number:
              <input
                type="text"
                name="mobileNumber"
                placeholder="mobilenumber......"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Add User</button>
          </form>
        </section>

        <section className="table-section">
          <h2>Users List</h2>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((data) => (
                  <tr key={data._id}>
                    <td>{data.user}</td>
                    <td>{data.name}</td>
                    <td>{data.email}</td>
                    <td>{data.mobileNumber}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
