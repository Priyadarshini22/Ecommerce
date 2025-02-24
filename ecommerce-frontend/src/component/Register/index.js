// import React, { useState } from 'react';
// import axios from 'axios';
// import './index.css';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [email,setEmail] = useState('');
//   const handleRegister = async () => {
//     try {
//       await axios.post('https://localhost:7195/api/Auth/register', { username, password, email });
//       alert('Registration successful');
//     } catch (error) {
//       console.error('Registration failed:', error);
//     }
//   };

//   return (
// <div className="register-container">
// <form className="register-form">
//   <h2>Register</h2>
//   <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
//   <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
//   <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//   <button onClick={handleRegister}>Register</button>
// </form>
// </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import axios from 'axios';
import './index.css';  // Use the correct CSS import
import { useNavigate } from 'react-router-dom';  // to handle navigation

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User'); // Default role is 'User'
  const [dob, setDob] = useState(''); // State for Date of Birth
  
  const navigate = useNavigate();  // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing on submit

    try {
      const data = { username, password, email, role };
      if (role === 'Admin') {
        debugger
        data.dob = dob; // Include dob if the role is 'Admin'
      }

      await axios.post('https://localhost:7195/api/Auth/register', data);
      navigate('/login');
      alert('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registeration unsuccessful")
    }
  };

  const navigateToLogin = () => {
    navigate('/login');  // Navigates to the login page using useNavigate
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register</h2>

        <label htmlFor="username">Username</label>
        <input 
          id="username"
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />

        <label htmlFor="role">Role</label>
        <select 
          id="role" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        {role === 'Admin' && (
          <>
            <label htmlFor="dob">Date of Birth</label>
            <input 
              id="dob"
              type="date" 
              placeholder="Date of Birth" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
            />
          </>
        )}

        <button type="submit" disabled={!username || !password || !email || (role === 'Admin' && !dob)}>Register</button>
      </form>

      <div className="login-link">
        <button onClick={navigateToLogin}>Already registered? Login here</button>
      </div>
    </div>
  );
};

export default Register;
