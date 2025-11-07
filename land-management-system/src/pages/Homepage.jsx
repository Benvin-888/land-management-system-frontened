import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Globe, Star, ArrowRight, Menu, X, 
  ChevronRight, Play, CheckCircle, Zap, 
  Facebook, Twitter, Instagram, Linkedin, Youtube,  
} from 'lucide-react';
import '../styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [plotNumber, setPlotNumber] = useState("");
  const [location, setLocation] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const typingRef = useRef(null);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeSection, setActiveSection] = useState('hero');

  const handleSearch = () => {
    const plots = {
      "001": "Mombasa, Kenya",
      "002": "Kwale, Kenya",
      "003": "Kilifi, Kenya",
      "004": "Tana River, Kenya",
      "005": "Lamu, Kenya",
      "006": "Taita-Taveta, Kenya",
      "007": "Garissa, Kenya",
      "008": "Wajir, Kenya",
      "009": "Mandera, Kenya",
      "010": "Marsabit, Kenya",
      "011": "Isiolo, Kenya",
      "012": "Meru, Kenya",
      "013": "Tharaka-Nithi, Kenya",
      "014": "Embu, Kenya",
      "015": "Kitui, Kenya",
      "016": "Machakos, Kenya",
      "017": "Makueni, Kenya",
      "018": "Nyandarua, Kenya",
      "019": "Nyeri, Kenya",
      "020": "Kirinyaga, Kenya",
      "021": "Murang’a, Kenya",
      "022": "Kiambu, Kenya",
      "023": "Turkana, Kenya",
      "024": "West Pokot, Kenya",
      "025": "Samburu, Kenya",
      "026": "Trans Nzoia, Kenya",
      "027": "Uasin Gishu, Kenya",
      "028": "Elgeyo-Marakwet, Kenya",
      "029": "Nandi, Kenya",
      "030": "Baringo, Kenya",
      "031": "Laikipia, Kenya",
      "032": "Nakuru, Kenya",
      "033": "Narok, Kenya",
      "034": "Kajiado, Kenya",
      "035": "Kericho, Kenya",
      "036": "Bomet, Kenya",
      "037": "Kakamega, Kenya",
      "038": "Vihiga, Kenya",
      "039": "Bungoma, Kenya",
      "040": "Busia, Kenya",
      "041": "Siaya, Kenya",
      "042": "Kisumu, Kenya",
      "043": "Homa Bay, Kenya",
      "044": "Migori, Kenya",
      "045": "Kisii, Kenya",
      "046": "Nyamira, Kenya",
      "047": "Nairobi, Kenya"
    };
    setLocation(plots[plotNumber] || "Kenya");
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  // Track currently visible section and show a small on-screen indicator.
  useEffect(() => {
    if (typeof window === 'undefined' || !document) return;

    const sectionElements = Array.from(document.querySelectorAll('section[id]'));
    if (!sectionElements.length) return;

    // IntersectionObserver to update activeSection when user scrolls
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry with highest intersectionRatio
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target && visible.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { root: null, rootMargin: '0px', threshold: [0.25, 0.5, 0.75] }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Close mobile menu on manual scroll
    const onScroll = () => setIsMenuOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Create a small floating indicator element that updates with activeSection
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const mapLabel = (id) => {
      switch (id) {
        case 'hero': return 'Home';
        case 'features': return 'Features';
        case 'how-it-works': return 'How It Works';
        case 'pricing': return 'Pricing';
        default: return id;
      }
    };

    const indicator = document.createElement('div');
    indicator.setAttribute('aria-hidden', 'true');
    indicator.style.position = 'fixed';
    indicator.style.top = '86px';
    indicator.style.right = '18px';
    indicator.style.background = 'rgba(15,23,42,0.95)';
    indicator.style.color = '#fff';
    indicator.style.padding = '6px 10px';
    indicator.style.borderRadius = '18px';
    indicator.style.fontSize = '12px';
    indicator.style.zIndex = '9999';
    indicator.style.boxShadow = '0 6px 18px rgba(2,6,23,0.4)';
    indicator.style.transition = 'transform 200ms ease, opacity 200ms ease';
    indicator.style.pointerEvents = 'none';
    indicator.textContent = mapLabel(activeSection);

    document.body.appendChild(indicator);

    return () => {
      indicator.remove();
    };
  }, [activeSection]);

  // Optional: add keyboard support to jump between sections (ArrowUp / ArrowDown)
  useEffect(() => {
    const sectionIds = Array.from(document.querySelectorAll('section[id]')).map(s => s.id);
    if (!sectionIds.length) return;

    const onKeyDown = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();

      const currentIndex = sectionIds.indexOf(activeSection);
      const nextIndex = e.key === 'ArrowDown' ? Math.min(sectionIds.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      const nextSection = sectionIds[nextIndex];
      if (nextSection) scrollToSection(nextSection);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSection]);
  useEffect(() => {
    const texts = [
      "Analyzing land...",
      "generating design...",
      "estimating cost...",
      "checking compliance...",
      "Sign In and start your project today!",
      "Sign In and start your project today!"

    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        charIndex--;
        typingSpeed = 50;
      } else {
        charIndex++;
        typingSpeed = 100;
      }

      if (typingRef.current) {
        typingRef.current.textContent = currentText.substring(0, charIndex);
        typingRef.current.style.borderRight = '2px solid #00ff88';
      }

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }

      setTimeout(type, typingSpeed);
    };

    const timer = setTimeout(type, 1000);
    return () => clearTimeout(timer);
  }, []);

  const pricingPlans = [
    { 
      name: "Free", 
      price: "KSh 5000/mo", 
      features: ["Basic 2D Plan", "Cost Preview", "1 Demo Project"] 
    },
    { 
      name: "Pro", 
      price: "KSh 8000/mo", 
      popular: true, 
      features: ["3D View", "PDF/DWG Exports", "5 Projects/Month", "Priority Support"] 
    },
    { 
      name: "Architect Pro", 
      price: "15000/mo", 
      features: ["Unlimited Projects", "Collaboration Tools", "Compliance Check", "Team Management"] 
    }
  ];

  const features = [
    {
      icon: Globe,
      title: "Site Analysis",
      description: "AI-driven site suitability, zoning and regulation checks for your plot."
    },
    {
      icon: MapPin,
      title: "Plot Mapping",
      description: "Convert plot numbers to geolocation and visualize parcel boundaries."
    },
    {
      icon: Star,
      title: "Design Generation",
      description: "Automatically generate optimized 2D/3D building plans based on requirements."
    },
    {
      icon: Zap,
      title: "Cost Estimation",
      description: "Fast construction cost estimates and material breakdowns."
    }
  ];

  return (
    <div className="homepage">
      {/* Enhanced Navigation Bar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-icon">🏗️</div>
            <span className="logo-text">LandVision AI</span>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <button className="nav-link" onClick={() => scrollToSection('features')}>Features</button>
            <button className="nav-link" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button className="nav-link" onClick={() => navigate('/Aboutus')}>About Us</button>
            <button className="nav-link" onClick={() => navigate('/')}>Log out</button>
            
            <div className="nav-buttons">
              <button className="btn-secondary" onClick={() => navigate('/Signup')}>Sign in</button>
              <button className="btn-primary" onClick={() => navigate('/Signup')}>Get Started</button>
            </div>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element element-1">🏗️</div>
            <div className="floating-element element-2">📊</div>
            <div className="floating-element element-3">🧩</div>
            <div className="floating-element element-4">⚡</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge">
              <Zap size={16} />
              <span>AI-Powered Land Development</span>
            </div>
            
            <h1 className="hero-title">
              From plot number to building plan — 
              <span className="gradient-text"> powered by AI</span>
            </h1>
            
            <p className="hero-description">
              Transform your land into professional architectural plans with our intelligent AI platform. 
              Fast, accurate, and regulation-compliant.
            </p>

            <div className="typing-animation">
              <span ref={typingRef} className="typing-text"></span>
            </div>

            <div className="hero-buttons">
              <button className="btn-primary btn-large" onClick={() => scrollToSection('features')}>
                Generate Your Plan Now
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary btn-large"onClick={() => navigate('/Signup')}>
                <Play size={20} />
                Signin to Get Started
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">2,000+</div>
                <div className="stat-label">Plans Generated</div>
              </div>
              <div className="stat">
                <div className="stat-number">900+</div>
                <div className="stat-label">Verified Land Parcels</div>
              </div>
              <div className="stat">
                <div className="stat-number">KSh 1.4B+</div>
                <div className="stat-label">Estimated Projects</div>
              </div>
            </div>
          </div>

          <div className="hero-demo">
            <div className="demo-preview">
              <div className="demo-card">
                <div className="demo-header">
                  <Globe className="demo-icon" />
                  <span className="demo-title">Interactive Kenya Map</span>
                </div>

                <div className="demo-content">
                  <div className="demo-placeholder">
                    <MapPin className="placeholder-icon" />
                    
                    <div className="plot-input">
                      <input
                        type="text"
                        placeholder="Enter plot number (e.g., 001)"
                        value={plotNumber}
                        onChange={(e) => setPlotNumber(e.target.value)}
                      />
                      <button onClick={handleSearch} className="search-btn">
                        Search
                      </button>
                    </div>

                    {location ? (
                      <div className="map-display">
                        <iframe
                          title="Kenya Map"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            location
                          )}&output=embed`}
                          width="100%"
                          height="300"
                          style={{
                            borderRadius: "10px",
                            border: "none",
                            marginTop: "1.5rem",
                          }}
                        ></iframe>
                      </div>
                    ) : (
                      <p className="placeholder-text">
                        Enter your county code number to see magic happen
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">AI-Powered Features</h2>
            <p className="section-subtitle">Everything you need to transform your land into reality</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-link">
                  <span>Learn more</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get started</h2>
            <p className="section-subtitle">Sign in to to start your Project Today</p>
          </div>
          </div>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to get your professional building plan</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Input Your Plot Details</h3>
                <p>Enter your plot number or coordinates and basic requirements</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis & Design</h3>
                <p>Our AI scans regulations and generates optimized designs</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Your Plan & Estimate</h3>
                <p>Receive 2D/3D plans and cost estimates instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Start free and upgrade as you grow</p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">{plan.price}</div>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <CheckCircle size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`plan-button ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="logo-icon">🏗️</div>
                  <span className="logo-text">LandVision AI</span>
                </div>
                <p className="footer-tagline">
                  Building the future of African land development with AI-powered solutions.
                </p>
                <div className="footer-newsletter">
                  <h4>Stay Updated</h4>
                  <div className="newsletter-form">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="newsletter-input"
                    />
                    <button className="newsletter-btn">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="footer-links-grid">
                <div className="footer-column">
                  <h4>Product</h4>
                  <ul>
                    <li><button onClick={() => scrollToSection('features')}>Features</button></li>
                    <li><button onClick={() => scrollToSection('pricing')}>Pricing</button></li>
                    <li><button onClick={() => scrollToSection('hero')}>Live Demo</button></li>
                    <li><a href="#updates">What's New</a></li>
                    <li><a href="#api">API</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Resources</h4>
                  <ul>
                    <li><a href="#blog">Blog</a></li>
                    <li><a href="#guides">Guides</a></li>
                    <li><a href="#webinars">Webinars</a></li>
                    <li><a href="#documentation">Documentation</a></li>
                    <li><a href="#support">Help Center</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Company</h4>
                  <ul>
                    <li><button onClick={() => navigate('/about')}>About Us</button></li>
                    <li><a href="#careers">Careers</a></li>
                    <li><a href="#partners">Partners</a></li>
                    <li><a href="#press">Press</a></li>
                    <li><button onClick={() => navigate('/contact')}>Contact</button></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Legal</h4>
                  <ul>
                    <li><a href="#privacy">Privacy Policy</a></li>
                    <li><a href="#terms">Terms of Service</a></li>
                    <li><a href="#security">Security</a></li>
                    <li><a href="#compliance">Compliance</a></li>
                    <li><a href="#cookies">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <div className="copyright">
                  <p>&copy; {new Date().getFullYear()} LandVision AI. All rights reserved.</p>
                </div>
                
                <div className="footer-legal-links">
                  <a href="#privacy">Privacy</a>
                  <a href="#terms">Terms</a>
                  <a href="#cookies">Cookies</a>
                </div>
                
                <div className="social-links">
                  <a href="https://facebook.com/" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <Facebook size={20} />
                  </a>
                  <a href="https://twitter.com/" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <Twitter size={20} />
                  </a>
                  <a href="https://instagram.com/" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <Instagram size={20} />
                  </a>
                  <a href="https://linkedin.com/" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={20} />
                  </a>
                  <a href="https://youtube.com/" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;