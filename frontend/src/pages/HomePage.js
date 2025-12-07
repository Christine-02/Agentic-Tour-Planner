import React from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi';

const HomePage = () => {
  const bgGradient = {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
  };

  const features = [
    {
      icon: FiMapPin,
      title: 'Smart Itinerary',
      description: 'AI-powered trip planning with personalized recommendations',
    },
    {
      icon: FiUsers,
      title: 'Group Planning',
      description: 'Collaborate with friends and family in real-time',
    },
    {
      icon: FiCalendar,
      title: 'Flexible Scheduling',
      description: 'Drag and drop to customize your perfect timeline',
    },
  ];

  const popularDestinations = [
    {
      name: 'Paris, France',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/330px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
      rating: 4.8,
      price: '$1,200',
      duration: '5 days',
    },
    {
      name: 'Tokyo, Japan',
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      rating: 4.9,
      price: '$1,800',
      duration: '7 days',
    },
    {
      name: 'New York, USA',
      image:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
      rating: 4.7,
      price: '$1,500',
      duration: '4 days',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div
        style={bgGradient}
        className="text-white py-5 position-relative overflow-hidden"
      >
        <Container className="position-relative" style={{ zIndex: 1 }}>
          <div className="text-center">
            <Badge pill bg="light" text="dark" className="mb-4">
              ✨ AI-Powered Travel Planning
            </Badge>
            <h1>
              Plan Your Perfect
              <br />
              <span className="text-warning">Adventure</span>
            </h1>
            <p className="lead">
              Discover amazing destinations, create personalized itineraries,
              and travel with confidence using our smart travel assistant.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Link to="/planner">
                <Button variant="primary" size="lg">
                  Start Planning <FiArrowRight />
                </Button>
              </Link>
              <Button variant="outline-light" size="lg">
                View Examples
              </Button>
            </div>
            <div className="d-flex justify-content-center gap-5 mt-5">
              <div>
                <h3>Instant</h3>
                <p>Itinerary Generation</p>
              </div>
              <div>
                <h3>200+</h3>
                <p>Destinations</p>
              </div>
              <div>
                <h3>100+</h3>
                <p>Activities</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2>Why Choose TourPlanner?</h2>
          <p className="lead text-muted">
            We combine the power of AI with human expertise to create
            unforgettable travel experiences.
          </p>
        </div>
        <Row>
          {features.map((feature, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-3">
                    <feature.icon size={40} />
                  </div>
                  <h5>{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Popular Destinations */}
      <div className="bg-light py-5">
        <Container>
          <div className="text-center mb-5">
            <h2>Popular Destinations</h2>
            <p className="lead text-muted">
              Get inspired by our most popular travel destinations
            </p>
          </div>
          <Row>
            {popularDestinations.map((destination, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Img variant="top" src={destination.image} />
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <Card.Title>{destination.name}</Card.Title>
                      <span>
                        <FiStar className="text-warning" /> {destination.rating}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <small>{destination.duration}</small>
                      <small>{destination.price}</small>
                    </div>
                    <Button variant="outline-primary" className="mt-3 w-100">
                      Plan Trip <FiArrowRight />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="py-5">
        <div
          style={bgGradient}
          className="text-white p-5 rounded-3 text-center"
        >
          <h2>Ready to Start Your Journey?</h2>
          <p className="lead">
            Join thousands of travelers who trust TourPlanner to create their
            perfect itineraries.
          </p>
          <Link to="/planner">
            <Button variant="light" size="lg">
              Create Your Trip <FiArrowRight />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
