import React, { useState, useEffect } from 'react';
import '../styles/Landingpage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    'https://images.unsplash.com/photo-1591389703635-e15a07b842d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
    'https://cdn.houseplansservices.com/product/en7524og2vsuqc1s97f4uds82l/w800x533.jpg?v=2',
    'https://cdn.houseplansservices.com/product/i9dk59igvlcni8ua4a6tmh50q1/w560x373.jpg?v=4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="landing-page">
      {/* Background Carousel */}
      <div className="background-carousel">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Main Content */}
      <div className="content">
        <h1 className="glowing-title">LandVisionAi</h1>
        <p className="vision-text">
          Creating affordable blueprints for your dream house
        </p>

        {/* Cards Container */}
        <div className="cards-container">
          <div className="card admin-card">
            <div className="card-icon">⚙️</div>
            <h3>Admin</h3>
            <p>Manage projects and users</p>
            <button className="card-btn" onClick={() => navigate('/admin')}>Access Portal</button>
          </div>

          <div className="card guest-card">
            <div className="card-icon">👤</div>
            <h3>Guest</h3>
            <p>Generate your blueprint today</p>
            <button className="card-btn" onClick={() => navigate('/homepage')}>Welcome</button>
          </div>

          <div className="card architect-card">
            <div className="card-icon">🏗️</div>
            <h3>Architecture</h3>
            <p>Professional tools & resources</p>
            <button className="card-btn">View Tools</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;