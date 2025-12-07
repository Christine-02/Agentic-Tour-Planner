import React, { useState } from 'react';
import {
  Box,
  Flex,
  Container,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  Badge,
  Checkbox,
  Divider,
  Progress,
  useToast,
  Heading,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const TripPlannerPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { getAuthHeaders } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    interests: [],
    dayHours: 8,
  });

  const interestOptions = [
    { value: 'museums', label: 'Museums & Art' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'nature', label: 'Nature & Outdoors' },
    { value: 'history', label: 'History & Culture' },
    { value: 'nightlife', label: 'Nightlife & Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'adventure', label: 'Adventure & Sports' },
    { value: 'photography', label: 'Photography' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'beaches', label: 'Beaches & Water' },
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget ($500-1000)' },
    { value: 'mid-range', label: 'Mid-range ($1000-2500)' },
    { value: 'luxury', label: 'Luxury ($2500+)' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestChange = (values) => {
    setFormData((prev) => ({
      ...prev,
      interests: values,
    }));
  };

  const validateForm = () => {
    if (!formData.destination) {
      toast({
        title: 'Destination required',
        description: 'Please enter your travel destination.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: 'Dates required',
        description: 'Please select your travel dates.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (formData.interests.length === 0) {
      toast({
        title: 'Interests required',
        description: 'Please select at least one interest.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('http://localhost:5000/api/ai/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          dates: {
            start: formData.startDate,
            end: formData.endDate,
          },
          interests: formData.interests,
          day_hours: formData.dayHours,
        }),
      });

      const result = await response.json();

      setProgress(100);

      if (result.error) {
        toast({
          title: 'Planning Error',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Transform API response to match ItineraryViewPage format
        const transformedItinerary = {
          city: result.city || formData.destination,
          days: result.itinerary
            ? result.itinerary.map((day, index) => ({
                day: day.day || index + 1,
                date: formData.startDate
                  ? new Date(
                      new Date(formData.startDate).getTime() +
                        index * 24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split('T')[0]
                  : new Date(Date.now() + index * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0],
                steps: day.steps.map((step, stepIndex) => ({
                  id: `${index}-${stepIndex}`,
                  name: step.name || '',
                  category: step.category || '',
                  duration_mins: step.duration_mins || 60,
                  travel_from_prev_mins: step.travel_from_prev_mins || 0,
                  lat: step.lat || 0,
                  lng: step.lng || 0,
                  desc: step.desc || '',
                  time: step.start_time || step.time || '09:00',
                  start_time: step.start_time || step.time || '09:00',
                  end_time: step.end_time || '10:00',
                })),
              }))
            : [],
        };

        // Save trip to database via API
        try {
          const tripData = {
            destination: result.city || formData.destination,
            startDate: formData.startDate,
            endDate: formData.endDate,
            travelers: formData.travelers || 1,
            interests: formData.interests || [],
            itinerary: transformedItinerary,
            status: 'planned',
            groupMembers: [], // Empty for now, ready for future group functionality
          };

          const saveResponse = await fetch(`${API_BASE_URL}/api/trips`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(tripData),
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save trip');
          }

          const savedTrip = await saveResponse.json();
          const tripId = savedTrip._id || savedTrip.id;

          toast({
            title: 'Trip Planned!',
            description: 'Your personalized itinerary has been created.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          setTimeout(() => {
            navigate(`/itinerary/${tripId}`);
          }, 1000);
        } catch (saveError) {
          console.error('Error saving trip:', saveError);
          toast({
            title: 'Trip Planned',
            description:
              'Itinerary created, but failed to save. You can still view it.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
          // Still navigate to view the itinerary even if save failed
          const tempId = Math.random().toString(36).substr(2, 9);
          setTimeout(() => {
            navigate(`/itinerary/${tempId}`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error planning trip:', error);
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the planning service.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Container maxW="800px" py={10}>
      <VStack textAlign="center" spacing={3} mb={8}>
        <Heading>Plan Your Perfect Trip</Heading>
        <Text color="gray.500">
          Tell us about your travel preferences and we'll create a personalized
          itinerary.
        </Text>
      </VStack>

      <Card mb={8}>
        <CardHeader>
          <Heading size="md">Trip Details</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>
                <FiMapPin /> Destination
              </FormLabel>
              <Input
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange('destination', e.target.value)
                }
              />
            </FormControl>

            <HStack>
              <FormControl>
                <FormLabel>
                  <FiCalendar /> Start Date
                </FormLabel>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange('startDate', e.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  <FiCalendar /> End Date
                </FormLabel>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </FormControl>
            </HStack>

            <HStack>
              <FormControl>
                <FormLabel>
                  <FiUsers /> Travelers
                </FormLabel>
                <Select
                  value={formData.travelers}
                  onChange={(e) =>
                    handleInputChange('travelers', parseInt(e.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'People'}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Budget Range</FormLabel>
                <Select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                >
                  <option value="">Select budget</option>
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>
                <FiClock /> Hours per day
              </FormLabel>
              <Select
                value={formData.dayHours}
                onChange={(e) =>
                  handleInputChange('dayHours', parseInt(e.target.value))
                }
              >
                <option value={6}>6 hours (Relaxed)</option>
                <option value={8}>8 hours (Balanced)</option>
                <option value={10}>10 hours (Active)</option>
                <option value={12}>12 hours (Intensive)</option>
              </Select>
            </FormControl>

            <Divider />

            <FormControl>
              <FormLabel>What are you interested in?</FormLabel>
              <Text fontSize="sm" color="gray.500">
                Select all that apply to help us personalize your itinerary
              </Text>
              <VStack align="stretch" mt={2}>
                {interestOptions.map((interest) => (
                  <Checkbox
                    key={interest.value}
                    isChecked={formData.interests.includes(interest.value)}
                    onChange={(e) => {
                      const newInterests = e.target.checked
                        ? [...formData.interests, interest.value]
                        : formData.interests.filter(
                            (i) => i !== interest.value
                          );
                      handleInterestChange(newInterests);
                    }}
                  >
                    {interest.label}
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>

            {formData.interests.length > 0 && (
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Selected interests:
                </Text>
                <HStack spacing={2} wrap="wrap">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} colorScheme="blue">
                      {
                        interestOptions.find((opt) => opt.value === interest)
                          ?.label
                      }
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}

            <MotionButton
              colorScheme="blue"
              size="lg"
              width="100%"
              onClick={handleSubmit}
              isLoading={isLoading}
              rightIcon={!isLoading && <FiArrowRight />}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Create My Itinerary
            </MotionButton>

            {isLoading && (
              <Box textAlign="center" mt={4}>
                <Text color="gray.500">
                  AI is planning your perfect trip...
                </Text>
                <Progress value={progress} size="sm" mt={2} mb={1} />
                <HStack justify="space-between" fontSize="sm" color="gray.400">
                  <Text>✓ Analyzing destination</Text>
                  <Text>✓ Matching interests</Text>
                  <Text>✓ Optimizing schedule</Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      <Card bg="blue.50" borderColor="blue.200">
        <CardBody>
          <Heading size="sm" mb={3}>
            💡 Planning Tips
          </Heading>
          <VStack align="flex-start" spacing={2}>
            <Text>Be specific with your destination</Text>
            <Text>Select multiple interests for variety</Text>
            <Text>Choose realistic energy levels</Text>
            <Text>You can modify your itinerary later</Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default TripPlannerPage;
