import React from 'react';
import { Route, Navigate } from 'react-router-dom';
    
export default function ProtectedRoute({ component: React.Component, ...rest }) {
          const isAuthenticated = // Check the user's authentication status here
    
          return (
            <Route {...rest}>
              {isAuthenticated ? <Component /> : <Navigate to="/login" />}
            </Route>
          );
        }
       