import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const Navadmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>Admin Dashboard</h1>
      <Button 
        label="Logout"
        icon="pi pi-sign-out"
        className="p-button-sm p-button-danger mt-2"
        onClick={handleLogout}
        style={{ backgroundColor: '#d9534f', borderColor: '#d9534f', fontSize: '14px', padding: '5px 10px' }}
      />
    </div>
  );
};

export default Navadmin;
