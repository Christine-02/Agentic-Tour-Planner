import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Flex,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  GridItem,
  Avatar,
  AvatarGroup,
  Divider,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiShare2,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiStar,
  FiFilter,
} from 'react-icons/fi';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

// TripCard component
const TripCard = ({ trip, onEdit, onDelete, onShare }) => {
  const bg = 'white';
  const borderColor = 'gray.200';

  return (
    <MotionCard
      bg={bg}
      borderColor={borderColor}
      whileHover={{ y: -4, boxShadow: 'xl' }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader pb={2}>
        <Flex align="center" justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="md">{trip.destination}</Heading>
            <HStack spacing={2} fontSize="sm" color="gray.600">
              <HStack>
                <FiCalendar />
                <Text>{trip.dates}</Text>
              </HStack>
              <HStack>
                <FiUsers />
                <Text>{trip.travelers} travelers</Text>
              </HStack>
            </HStack>
          </VStack>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuItem icon={<FiEdit3 />} onClick={() => onEdit(trip)}>
                Edit
              </MenuItem>
              <MenuItem icon={<FiShare2 />} onClick={() => onShare(trip)}>
                Share
              </MenuItem>
              <MenuItem
                icon={<FiTrash2 />}
                onClick={() => onDelete(trip)}
                color="red.500"
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          {/* Trip Image */}
          <Box
            h="120px"
            bg="linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)"
            borderRadius="md"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={2}
              right={2}
              bg="white"
              borderRadius="full"
              p={1}
            >
              <FiStar color="#fbbf24" size={16} />
            </Box>
            <VStack
              position="absolute"
              bottom={2}
              left={2}
              align="start"
              color="white"
            >
              <Text fontSize="sm" fontWeight="medium">
                {trip.days} days
              </Text>
              <Text fontSize="xs" opacity={0.9}>
                {trip.stops} stops
              </Text>
            </VStack>
          </Box>

          {/* Trip Stats */}
          <HStack justify="space-between" fontSize="sm" color="gray.600">
            <HStack>
              <FiMapPin />
              <Text>{trip.stops} stops</Text>
            </HStack>
            <HStack>
              <FiClock />
              <Text>{trip.duration}</Text>
            </HStack>
            <Badge colorScheme={trip.status === 'completed' ? 'green' : 'blue'}>
              {trip.status}
            </Badge>
          </HStack>

          {/* Group Members */}
          {trip.groupMembers && trip.groupMembers.length > 0 && (
            <Box>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Group Members
              </Text>
              <AvatarGroup size="sm" max={4}>
                {trip.groupMembers.map((member, index) => (
                  <Avatar key={index} name={member.name} src={member.avatar} />
                ))}
              </AvatarGroup>
            </Box>
          )}

          {/* Action Buttons */}
          <HStack spacing={2}>
            <Button
              as={Link}
              to={`/itinerary/${trip.id}`}
              size="sm"
              variant="gradient"
              flex={1}
            >
              View Itinerary
            </Button>
            <Button
              as={Link}
              to={`/group/${trip.id}`}
              size="sm"
              variant="outline"
              leftIcon={<FiUsers />}
            >
              Group
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

const SavedTripsPage = () => {
  const toast = useToast();
  const { getAuthHeaders } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load trips from API
  const loadTripsFromAPI = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/trips`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(
          `Failed to load trips: ${response.status} ${response.statusText}`
        );
      }

      const tripsData = await response.json();

      // Transform trips to match TripCard format
      const tripsArray = tripsData.map((trip) => {
        // Calculate days from itinerary
        const days = trip.itinerary?.days?.length || 0;

        // Calculate total stops
        const stops =
          trip.itinerary?.days?.reduce(
            (total, day) => total + (day.steps?.length || 0),
            0
          ) || 0;

        // Format dates
        const formatDate = (dateString) => {
          if (!dateString) return 'TBD';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        };

        const startDate = formatDate(trip.startDate);
        const endDate = formatDate(trip.endDate);
        const dates =
          trip.startDate && trip.endDate
            ? `${startDate} - ${endDate}`
            : startDate || 'TBD';

        // Calculate duration
        const duration =
          days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : 'TBD';

        return {
          id: trip._id || trip.id,
          destination: trip.destination || 'Unknown',
          dates: dates,
          travelers: trip.travelers || 1,
          days: days,
          stops: stops,
          duration: duration,
          status: trip.status || 'planned', // Default to planned
          groupMembers: trip.groupMembers || [], // Keep group structure for future use
          // Store full trip data for reference
          _fullData: trip,
        };
      });

      setTrips(tripsArray);
    } catch (error) {
      console.error('Error loading trips from API:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trips. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trips on mount and when navigating to this page
  useEffect(() => {
    loadTripsFromAPI();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (trip) => {
    toast({
      title: 'Edit Trip',
      description: `Editing ${trip.destination}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDelete = async (trip) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${trip.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      // Update state
      setTrips((prev) => prev.filter((t) => t.id !== trip.id));

      toast({
        title: 'Trip Deleted',
        description: `${trip.destination} has been removed.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete trip. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleShare = (trip) => {
    toast({
      title: 'Share Trip',
      description: `Sharing ${trip.destination}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Container maxW="7xl" py={8}>
      <MotionVStack
        spacing={8}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <MotionBox w="full" variants={itemVariants}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
            <VStack align="start" spacing={2}>
              <Heading fontSize="3xl" fontWeight="bold">
                My Trips
              </Heading>
              <Text color="gray.600">
                Manage and view all your travel plans
              </Text>
            </VStack>
            <Button
              as={Link}
              to="/planner"
              variant="gradient"
              leftIcon={<FiPlus />}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Plan New Trip
            </Button>
          </Flex>
        </MotionBox>

        {/* Search and Filter */}
        <MotionBox w="full" variants={itemVariants}>
          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="400px">
              <InputLeftElement>
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button
              variant="outline"
              leftIcon={<FiFilter />}
              onClick={() =>
                setFilterStatus(filterStatus === 'all' ? 'planned' : 'all')
              }
            >
              {filterStatus === 'all' ? 'All Trips' : 'Planned Only'}
            </Button>
          </HStack>
        </MotionBox>

        {/* Stats */}
        <MotionBox w="full" variants={itemVariants}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {trips.length}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Trips
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {trips.filter((t) => t.status === 'completed').length}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Completed
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {trips.filter((t) => t.status === 'planned').length}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Planned
                </Text>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {trips.reduce((total, trip) => total + trip.stops, 0)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Stops
                </Text>
              </CardBody>
            </Card>
          </Grid>
        </MotionBox>

        {/* Trips Grid */}
        <MotionBox w="full" variants={itemVariants}>
          <AnimatePresence>
            {filteredTrips.length > 0 ? (
              <MotionGrid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTrips.map((trip, index) => (
                  <GridItem key={trip.id}>
                    <TripCard
                      trip={trip}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onShare={handleShare}
                    />
                  </GridItem>
                ))}
              </MotionGrid>
            ) : (
              <MotionBox
                textAlign="center"
                py={20}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <VStack spacing={4}>
                  <Text fontSize="xl" color="gray.500">
                    No trips found
                  </Text>
                  <Text color="gray.400">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Start planning your first trip!'}
                  </Text>
                  {!searchTerm && (
                    <Button
                      as={Link}
                      to="/planner"
                      variant="gradient"
                      leftIcon={<FiPlus />}
                    >
                      Plan Your First Trip
                    </Button>
                  )}
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </MotionBox>
      </MotionVStack>
    </Container>
  );
};

export default SavedTripsPage;
