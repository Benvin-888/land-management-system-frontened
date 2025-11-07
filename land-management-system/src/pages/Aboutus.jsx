import React, { useState, useEffect, useRef } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../styles/Aboutus.css';

// Modern Icons
import { 
  FaLinkedin, FaTwitter, FaInstagram, FaGithub, FaFacebook, FaYoutube,
  FaRocket, FaBullseye, FaEye, FaHandshake, FaLeaf, FaUserShield,
  FaHome, FaMapMarkerAlt, FaMoneyBillWave, FaGlobeAmericas,
 FaCloud, FaMap, FaRobot, FaHouseUser,
  FaAward, FaChartLine, FaUsers, FaHandHoldingHeart
} from 'react-icons/fa';

import { 
  HiMenu, HiX, HiSparkles, HiLightningBolt, HiChip,
  HiTrendingUp, HiStar, HiShieldCheck, HiGlobe
} from 'react-icons/hi';
import { 
  SiMapbox, SiGooglemaps, SiFirebase, SiMongodb,
  SiReact, SiNodedotjs, SiThreedotjs
} from 'react-icons/si';

const AboutUs = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [counters, setCounters] = useState({
    plans: 0,
    plots: 0,
    value: 0,
    counties: 0
  });

  const [animatedSections, setAnimatedSections] = useState({});
  const sectionRefs = useRef({});

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation effect
  useEffect(() => {
    const targetValues = {
      plans: 2500,
      plots: 800,
      value: 1500,
      counties: 5
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const interval = setInterval(() => {
      setCounters(prev => ({
        plans: Math.min(prev.plans + Math.ceil(targetValues.plans / steps), targetValues.plans),
        plots: Math.min(prev.plots + Math.ceil(targetValues.plots / steps), targetValues.plots),
        value: Math.min(prev.value + Math.ceil(targetValues.value / steps), targetValues.value),
        counties: Math.min(prev.counties + Math.ceil(targetValues.counties / steps), targetValues.counties)
      }));
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const coreValues = [
    {
      icon: <FaRocket className="value-icon-svg" />,
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge AI technology"
    },
    {
      icon: <FaBullseye className="value-icon-svg" />,
      title: "Accuracy",
      description: "Precision in every land assessment and plan"
    },
    {
      icon: <FaEye className="value-icon-svg" />,
      title: "Transparency",
      description: "Clear processes and honest communication"
    },
    {
      icon: <FaHandshake className="value-icon-svg" />,
      title: "Collaboration",
      description: "Working together with landowners and communities"
    },
    {
      icon: <FaLeaf className="value-icon-svg" />,
      title: "Sustainability",
      description: "Environmentally conscious land development"
    },
    {
      icon: <FaUserShield className="value-icon-svg" />,
      title: "Empowerment",
      description: "Enabling landowners with accessible tools"
    }
  ];

  const teamMembers = [
    {
      name: "Alex Kimani",
      role: "Founder & CEO",
      quote: "Building Africa's future, one plot at a time.",
      initials: "AK"
    },
    {
      name: "Sarah Mwangi",
      role: "Lead AI Engineer",
      quote: "Transforming raw data into intelligent solutions.",
      initials: "SM"
    },
    {
      name: "David Ochieng",
      role: "GIS Specialist",
      quote: "Mapping possibilities for sustainable development.",
      initials: "DO"
    },
    {
      name: "Grace Otieno",
      role: "Product Designer",
      quote: "Creating experiences that empower landowners.",
      initials: "GO"
    }
  ];

  const partners = [
    { name: "Mapbox", logo: <SiMapbox className="partner-logo-svg" /> },
    { name: "Google Maps", logo: <SiGooglemaps className="partner-logo-svg" /> },
    { name: "Kenya Land Registry", logo: <HiGlobe className="partner-logo-svg" /> },
    { name: "Cloudinary", logo: <FaCloud className="partner-logo-svg" /> },
    { name: "Render", logo: <HiLightningBolt className="partner-logo-svg" /> },
    { name: "Firebase", logo: <SiFirebase className="partner-logo-svg" /> },
    { name: "OpenTopoData", logo: <FaMap className="partner-logo-svg" /> }
  ];

  const techStack = [
    { name: "React", icon: <SiReact className="tech-icon" /> },
    { name: "Node.js", icon: <SiNodedotjs className="tech-icon" /> },
    { name: "MongoDB", icon: <SiMongodb className="tech-icon" /> },
    { name: "Three.js", icon: <SiThreedotjs className="tech-icon" /> },
    { name: "Mapbox", icon: <SiMapbox className="tech-icon" /> },
    { name: "GPT AI", icon: <FaRobot className="tech-icon" /> }
  ];

  const testimonials = [
    {
      name: "James Kariuki",
      location: "Nairobi",
      text: "I generated my 3-bedroom plan in 45 seconds! LandVision AI saved me weeks of work and thousands in architect fees.",
      avatar: "JK"
    },
    {
      name: "Fatima Hassan",
      location: "Mombasa",
      text: "As a first-time landowner, I was overwhelmed. LandVision made the process simple and gave me confidence in my project.",
      avatar: "FH"
    },
    {
      name: "Robert Odhiambo",
      location: "Kisumu",
      text: "The accuracy of the terrain analysis helped me avoid costly foundation issues. This technology is revolutionary.",
      avatar: "RO"
    }
  ];

  const impactStats = [
    { icon: <FaHome className="impact-icon-svg" />, value: counters.plans, label: "Plans Generated", suffix: "+" },
    { icon: <FaMapMarkerAlt className="impact-icon-svg" />, value: counters.plots, label: "Verified Land Plots", suffix: "+" },
    { icon: <FaMoneyBillWave className="impact-icon-svg" />, value: counters.value, label: "Total Project Value", prefix: "KSh ", suffix: "M+" },
    { icon: <FaGlobeAmericas className="impact-icon-svg" />, value: counters.counties, label: "Counties Covered", suffix: "+" }
  ];

  return (
    <div className="about-container">
      {/* Enhanced Navigation Bar */}
      <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <HiSparkles className="logo-sparkle" />
            LandVision<span className="nav-logo-accent">AI</span>
          </div>

          <div className="nav-links">
            <Link to="/homepage" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link-active">About</Link>

          </div>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link" onClick={toggleMenu}>Home</Link>
              <Link to="/about" className="mobile-nav-link-active" onClick={toggleMenu}>About</Link>
              <Link to="/gallery" className="mobile-nav-link" onClick={toggleMenu}>Gallery</Link>
              <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMenu}>Dashboard</Link>
              <Link to="/contact" className="mobile-nav-link" onClick={toggleMenu}>Contact</Link>
              <button className="mobile-nav-cta">
                <FaRocket className="cta-rocket" />
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section 
        id="hero" 
        className={`hero-section ${animatedSections.hero ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.hero = el}
      >
        <div className="hero-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="hero-grid-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <HiSparkles className="badge-sparkle" />
            AI-Powered Land Planning
          </div>
          <h1 className="hero-title">
            Reimagining <span className="hero-highlight">Land Planning</span> with Artificial Intelligence
          </h1>
          <p className="hero-subtitle">
            From plot number to building plan — LandVision AI makes it instant, intelligent, and affordable.
          </p>
          <div className="hero-actions">
            <button 
              className="hero-cta primary-cta"
              onClick={() => document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' })}
            >
              <FaRocket className="cta-icon" />
              Explore Our Vision
            </button>
            <button className="hero-cta secondary-cta"onClick={() => navigate('/signup')}>
              <FaHandshake className="cta-icon" />
              Sign in to Get Started
            </button>
          </div>
          
          <div className="hero-stats-preview">
            <div className="stat-preview">
              <strong>2,500+</strong>
              <span>Plans Generated</span>
            </div>
            <div className="stat-preview">
              <strong>98%</strong>
              <span>Accuracy Rate</span>
            </div>
            <div className="stat-preview">
              <strong>45s</strong>
              <span>Average Time</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Enhanced Our Story Section */}
      <section 
        id="our-story" 
        className={`story-section ${animatedSections['our-story'] ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current['our-story'] = el}
      >
        <div className="story-container">
          <div className="section-header">
            <h2 className="section-title">
              <HiSparkles className="title-sparkle" />
              Our Story & Mission
            </h2>
            <p className="section-subtitle">From vision to reality - transforming land planning across Africa</p>
          </div>
          
          <div className="story-timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-icon">
                  <FaBullseye />
                </div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <h3>The Problem</h3>
                <p>Complex, expensive land planning processes preventing homeowners from realizing their dreams</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-icon">
                  <HiLightningBolt />
                </div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <h3>The Insight</h3>
                <p>AI and geospatial technology could automate and democratize architectural planning</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-icon">
                  <HiChip />
                </div>
                <div className="timeline-line"></div>
              </div>
              <div className="timeline-content">
                <h3>The Solution</h3>
                <p>LandVision AI - An intelligent platform blending AI, GIS, and architectural design</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker">
                <div className="timeline-icon">
                  <FaGlobeAmericas />
                </div>
              </div>
              <div className="timeline-content">
                <h3>The Mission</h3>
                <p>Empowering every African landowner with accessible, intelligent planning tools</p>
              </div>
            </div>
          </div>
          
          <div className="mission-statement">
            <HiSparkles className="mission-sparkle" />
            <p>"Empowering landowners through intelligent automation — where innovation meets real-world land planning."</p>
            <div className="mission-author">— LandVision AI Team</div>
          </div>
        </div>
      </section>

      {/* Enhanced Vision & Core Values */}
      <section 
        id="vision"
        className={`vision-section ${animatedSections.vision ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.vision = el}
      >
        <div className="vision-container">
          <div className="section-header">
            <h2 className="section-title">
              <HiStar className="title-sparkle" />
              Vision & Core Values
            </h2>
            <p className="section-subtitle">To revolutionize Africa's land planning through AI, GIS, and automation</p>
          </div>
          
          <div className="values-grid">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className={`value-card ${animatedSections.vision ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="value-icon-container">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
          
          <div className="vision-footer">
            <HiShieldCheck className="vision-badge" />
            <p className="vision-footer-text">Our values define every algorithm we build</p>
          </div>
        </div>
      </section>

      {/* Enhanced Technology & Innovation */}
      <section 
        id="tech"
        className={`tech-section ${animatedSections.tech ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.tech = el}
      >
        <div className="tech-container">
          <div className="section-header">
            <h2 className="section-title">
              <HiChip className="title-sparkle" />
              Technology & Innovation
            </h2>
            <p className="section-subtitle">We blend AI, GIS, and cloud computing to automate architecture</p>
          </div>
          
          <div className="tech-stack">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item">
                <div className="tech-icon-container">
                  {tech.icon}
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
          
          <div className="tech-process">
            <div className="process-step">
              <div className="step-icon">
                <FaMap className="step-svg" />
              </div>
              <h4>Plot Input</h4>
              <p>Land details & requirements</p>
            </div>
            
            <div className="process-arrow">
              <HiTrendingUp className="arrow-svg" />
            </div>
            
            <div className="process-step">
              <div className="step-icon">
                <FaRobot className="step-svg" />
              </div>
              <h4>AI Engine</h4>
              <p>Intelligent processing</p>
            </div>
            
            <div className="process-arrow">
              <HiTrendingUp className="arrow-svg" />
            </div>
            
            <div className="process-step">
              <div className="step-icon">
                <FaHouseUser className="step-svg" />
              </div>
              <h4>Output Plan</h4>
              <p>Ready-to-use design</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Impact & Achievements */}
      <section 
        id="impact"
        className={`impact-section ${animatedSections.impact ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.impact = el}
      >
        <div className="impact-container">
          <div className="section-header">
            <h2 className="section-title">
              <FaChartLine className="title-sparkle" />
              Impact & Achievements
            </h2>
            <p className="section-subtitle">Transforming landscapes and lives across Africa</p>
          </div>
          
          <div className="impact-grid">
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className="impact-card"
              >
                <div className="impact-icon-container">
                  {stat.icon}
                </div>
                <h3 className="impact-value">
                  {stat.prefix}{stat.value}{stat.suffix}
                </h3>
                <p className="impact-label">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="impact-map-preview">
            <div className="map-visual">
              <FaGlobeAmericas className="map-icon" />
              <div className="map-points">
                <div className="map-point point-1"></div>
                <div className="map-point point-2"></div>
                <div className="map-point point-3"></div>
                <div className="map-point point-4"></div>
                <div className="map-point point-5"></div>
              </div>
            </div>
            <p className="impact-footer-text">Serving communities across 5+ counties and growing</p>
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section 
        id="team"
        className={`team-section ${animatedSections.team ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.team = el}
      >
        <div className="team-container">
          <div className="section-header">
            <h2 className="section-title">
              <FaUsers className="title-sparkle" />
              Meet the Team
            </h2>
            <p className="section-subtitle">The brilliant minds behind LandVision AI</p>
          </div>
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="team-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="team-avatar">
                  {member.initials}
                  <div className="avatar-glow"></div>
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-quote">"{member.quote}"</p>
                <div className="team-social">
                  <FaLinkedin className="social-icon" />
                  <FaTwitter className="social-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Partners Section */}
      <section 
        id="partners"
        className={`partners-section ${animatedSections.partners ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.partners = el}
      >
        <div className="partners-container">
          <div className="section-header">
            <h2 className="section-title">
              <FaHandshake className="title-sparkle" />
              Partners & Collaborations
            </h2>
            <p className="section-subtitle">
              We collaborate with trusted global and local partners to ensure accuracy, security, and scalability
            </p>
          </div>
          
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="partner-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="partner-logo-container">
                  {partner.logo}
                </div>
                <p className="partner-name">{partner.name}</p>
              </div>
            ))}
          </div>
          
          <div className="partners-footer">
            <HiShieldCheck className="partners-badge" />
            <p className="partners-footer-text">Powered by industry leaders and trusted partners</p>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section 
        id="testimonials"
        className={`testimonials-section ${animatedSections.testimonials ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.testimonials = el}
      >
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-title">
              <FaAward className="title-sparkle" />
              Customer Testimonials
            </h2>
            <p className="section-subtitle">Hear from landowners who transformed their dreams into reality</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {testimonial.avatar}
                  </div>
                  <div className="testimonial-info">
                    <h3>{testimonial.name}</h3>
                    <p className="testimonial-location">{testimonial.location}</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} className="star filled" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-footer">
                  <FaHandHoldingHeart className="testimonial-heart" />
                  <span>Verified Customer</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="testimonials-cta">
            <button className="testimonials-btn">
              <FaUsers className="btn-icon" />
              Read More Success Stories
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Social Impact */}
      <section 
        id="social"
        className={`impact-social-section ${animatedSections.social ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.social = el}
      >
        <div className="impact-social-container">
          <div className="section-header">
            <h2 className="section-title">
              <FaLeaf className="title-sparkle" />
              Social Impact & Sustainability
            </h2>
            <p className="section-subtitle">Building a better future through technology</p>
          </div>
          
          <div className="impact-social-grid">
            <div className="impact-social-card">
              <div className="impact-social-icon">
                <FaMoneyBillWave />
              </div>
              <h3 className="impact-social-title">Reducing Costs</h3>
              <p className="impact-social-text">Cutting design costs by 70% for homeowners across Africa</p>
            </div>
            
            <div className="impact-social-card">
              <div className="impact-social-icon">
                <FaUsers />
              </div>
              <h3 className="impact-social-title">Tech Jobs</h3>
              <p className="impact-social-text">Creating 50+ tech-driven jobs in the African ecosystem</p>
            </div>
            
            <div className="impact-social-card">
              <div className="impact-social-icon">
                <FaChartLine />
              </div>
              <h3 className="impact-social-title">Smart Growth</h3>
              <p className="impact-social-text">Promoting sustainable urban development practices</p>
            </div>
          </div>
          
          <div className="impact-social-quote">
            <FaLeaf className="quote-icon" />
            <p className="impact-social-quote-text">
              "We believe intelligent design can make housing fairer, more accessible, and sustainable for all communities."
            </p>
            <div className="quote-author">— Our Commitment to Africa</div>
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section 
        id="cta"
        className={`cta-section ${animatedSections.cta ? 'animate-in' : ''}`}
        ref={el => sectionRefs.current.cta = el}
      >
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to turn your land into a plan?</h2>
            <p className="cta-subtitle">
              Join thousands of landowners who are already using LandVision AI to transform their properties into dream homes.
            </p>
            
            <div className="cta-buttons">
              <button className="cta-primary">
                <FaRocket className="cta-icon" />
                Start Free Trial
              </button>
              <button className="cta-secondary">
                <FaHandshake className="cta-icon" />
                Book a Demo
              </button>
            </div>
            
            <div className="cta-features">
              <div className="cta-feature">
                <HiShieldCheck className="feature-icon" />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <FaUsers className="feature-icon" />
                <span>2,500+ successful projects</span>
              </div>
              <div className="cta-feature">
                <FaAward className="feature-icon" />
                <span>98% customer satisfaction</span>
              </div>
            </div>
          </div>
          
          <div className="cta-trust">
            <p className="cta-trust-text">Trusted by 2,500+ landowners across Africa</p>
            <p className="cta-contact">
              <FaHandshake className="contact-icon" />
              contact@landvision.ai • +254 718 922 875
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>
                <HiSparkles className="logo-sparkle" />
                LandVision<span className="footer-brand-accent">AI</span>
              </h3>
              <p className="footer-description">
                Empowering landowners through intelligent automation — where innovation meets real-world land planning.
              </p>
              <div className="footer-social">
                <FaLinkedin className="footer-social-icon" />
                <FaTwitter className="footer-social-icon" />
                <FaInstagram className="footer-social-icon" />
                <FaGithub className="footer-social-icon" />
                <FaFacebook className="footer-social-icon" />
                <FaYoutube className="footer-social-icon" />
              </div>
            </div>
            
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/gallery" className="footer-link">Gallery</Link></li>
                <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms-of-use" className="footer-link">Terms of Use</Link></li>
                <li><Link to="/cookie-policy" className="footer-link">Cookie Policy</Link></li>
                <li><Link to="/data-security" className="footer-link">Data Security</Link></li>
              </ul>
            </div>
            
            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for the latest updates on AI & Real Estate Tech.</p>
              <div className="footer-newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="footer-newsletter-input"
                />
                <button className="footer-newsletter-button">
                  <FaRocket className="newsletter-icon" />
                  Subscribe
                </button>
              </div>
              <div className="newsletter-trust">
                <HiShieldCheck className="trust-icon" />
                <span>No spam, unsubscribe anytime</span>
              </div>
            </div>
          </div>
          
          <div className="footer-divider">
            <p>
              <FaGlobeAmericas className="globe-icon" />
              © 2025 LandVision AI. Built for Africa. Designed for the World.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;