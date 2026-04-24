import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'leaflet/dist/leaflet.css';

const GOOGLE_CLIENT_ID = "229019454102-5dnl4qi341b597477dhjclafiqhs2d9u.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
);

