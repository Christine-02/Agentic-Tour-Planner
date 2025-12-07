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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  FiEdit3,
  FiTrash2,
  FiClock,
  FiMapPin,
  FiMoreVertical,
  FiPlus,
  FiShare2,
  FiUsers,
  FiCalendar,
  FiArrowLeft,
} from 'react-icons/fi';

// Import sortable item component
import SortableItineraryItem from '../components/ui/SortableItineraryItem';
import { API_BASE_URL } from '../constants';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionCard = motion(Card);

const ItineraryViewPage = () => {
  const { tripId } = useParams();
  const toast = useToast();
  const { getAuthHeaders } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);

  // Load itinerary data from API
  const [itinerary, setItinerary] = useState({
    city: 'Loading...',
    days: [
      {
        day: 1,
        date: new Date().toISOString().split('T')[0],
        steps: [],
      },
    ],
  });

  // Load itinerary from API when tripId changes
  useEffect(() => {
    const loadItinerary = async () => {
      if (!tripId) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to load trip');
        }

        const trip = await response.json();

        if (trip && trip.itinerary) {
          setItinerary(trip.itinerary);
        } else {
          throw new Error('Trip itinerary not found');
        }
      } catch (error) {
        console.error('Error loading itinerary:', error);
        toast({
          title: 'Trip Not Found',
          description: `Trip with ID ${tripId} not found. Please plan a new trip.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setItinerary({
          city: 'City Not Found',
          days: [
            {
              day: 1,
              date: new Date().toISOString().split('T')[0],
              steps: [],
            },
          ],
        });
      }
    };

    loadItinerary();
  }, [tripId, toast]);

  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    duration_mins: 60,
    desc: '',
    time: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const dayIndex = parseInt(active.id.split('-')[0]);
      const oldIndex = parseInt(active.id.split('-')[1]);
      const newIndex = parseInt(over.id.split('-')[1]);

      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((day, index) => {
          if (index === dayIndex) {
            return {
              ...day,
              steps: arrayMove(day.steps, oldIndex, newIndex),
            };
          }
          return day;
        }),
      }));

      toast({
        title: 'Itinerary Updated',
        description: 'Item order has been changed.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      category: item.category,
      duration_mins: item.duration_mins,
      desc: item.desc,
      time: item.time,
    });
    onOpen();
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((day) => ({
        ...day,
        steps: day.steps.map((step) =>
          step.id === editingItem.id ? { ...step, ...editForm } : step
        ),
      })),
    }));

    toast({
      title: 'Item Updated',
      description: 'Itinerary item has been updated.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    onClose();
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.map((day) => ({
        ...day,
        steps: day.steps.filter((step) => step.id !== itemId),
      })),
    }));

    toast({
      title: 'Item Deleted',
      description: 'Itinerary item has been removed.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Landmarks: 'blue',
      Museums: 'purple',
      Architecture: 'green',
      Neighborhoods: 'orange',
      Food: 'red',
      Nature: 'teal',
    };
    return colors[category] || 'gray';
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
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
    <Container maxW="6xl" py={8}>
      <MotionVStack
        spacing={8}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breadcrumb */}
        <MotionBox w="full" variants={itemVariants}>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/saved">
                Saved Trips
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text>{itinerary.city}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        </MotionBox>

        {/* Header */}
        <MotionBox w="full" variants={itemVariants}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
            <VStack align="start" spacing={2}>
              <HStack>
                <Button
                  as={Link}
                  to="/saved"
                  variant="ghost"
                  leftIcon={<FiArrowLeft />}
                  size="sm"
                >
                  Back
                </Button>
              </HStack>
              <Heading fontSize="3xl" fontWeight="bold">
                {itinerary.city}
              </Heading>
              <HStack spacing={4} color="gray.600">
                <HStack>
                  <FiCalendar />
                  <Text fontSize="sm">{itinerary.days.length} days</Text>
                </HStack>
                <HStack>
                  <FiMapPin />
                  <Text fontSize="sm">
                    {itinerary.days.reduce(
                      (total, day) => total + day.steps.length,
                      0
                    )}{' '}
                    stops
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            <HStack spacing={2}>
              <Button variant="outline" leftIcon={<FiShare2 />} size="sm">
                Share
              </Button>
              <Button
                variant="outline"
                leftIcon={<FiUsers />}
                size="sm"
                as={Link}
                to={`/group/${tripId}`}
              >
                Group Planning
              </Button>
            </HStack>
          </Flex>
        </MotionBox>

        {/* Itinerary Days */}
        <VStack spacing={8} w="full">
          {itinerary.days.map((day, dayIndex) => (
            <MotionCard key={day.day} variants={itemVariants} w="full">
              <CardHeader>
                <Flex align="center" justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Heading size="md">Day {day.day}</Heading>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </VStack>
                  <Badge colorScheme="blue" variant="subtle">
                    {day.steps.length} stops
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={day.steps.map((_, index) => `${dayIndex}-${index}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <VStack spacing={4} align="stretch">
                      {day.steps.map((step, stepIndex) => (
                        <SortableItineraryItem
                          key={step.id}
                          id={`${dayIndex}-${stepIndex}`}
                          step={step}
                          onEdit={() => handleEditItem(step)}
                          onDelete={() => handleDeleteItem(step.id)}
                          categoryColor={getCategoryColor(step.category)}
                          formatTime={formatTime}
                        />
                      ))}
                    </VStack>
                  </SortableContext>
                </DndContext>
              </CardBody>
            </MotionCard>
          ))}
        </VStack>

        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Itinerary Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="Landmarks">Landmarks</option>
                    <option value="Museums">Museums</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Neighborhoods">Neighborhoods</option>
                    <option value="Food">Food</option>
                    <option value="Nature">Nature</option>
                  </Select>
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Input
                      type="number"
                      value={editForm.duration_mins}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          duration_mins: parseInt(e.target.value),
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Time</FormLabel>
                    <Input
                      type="time"
                      value={editForm.time}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editForm.desc}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, desc: e.target.value }))
                    }
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} w="full" justify="end">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </MotionVStack>
    </Container>
  );
};

export default ItineraryViewPage;
