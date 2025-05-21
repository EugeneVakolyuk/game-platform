import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './components/Chat';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
    return (
        <Router>
            <div style={{ textAlign: 'center' }}>
                <header>
                    <h1>Платформа настільних ігор</h1>
                    <nav>
                        <Link to="/">Головна</Link> |{' '}
                        <Link to="/register">Реєстрація</Link> |{' '}
                        <Link to="/login">Вхід</Link>
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;