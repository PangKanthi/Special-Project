import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token'); // Check for authentication token
    if (!token) {
        // Redirect to login if token does not exist
        return <Navigate to="/login" replace />;
    }
    // Render the children (protected components) if authenticated
    return children;
}

export default ProtectedRoute;
