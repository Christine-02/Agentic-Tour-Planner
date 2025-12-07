import React, { useState, useEffect } from "react";
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
  Avatar,
  AvatarGroup,
  IconButton,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Spacer,
  Divider,
  Progress,
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
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  FiUsers,
  FiMessageCircle,
  FiThumbsUp,
  FiThumbsDown,
  FiPlus,
  FiArrowLeft,
  FiShare2,
  FiClock,
  FiMapPin,
  FiEdit3,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionCard = motion(Card);
const MotionHStack = motion(HStack);

const GroupPlanningPage = () => {
  const { tripId } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newComment, setNewComment] = useState("");

  // Mock group data
  const [groupData, setGroupData] = useState({
    tripName: "Paris Adventure",
    members: [
      {
        id: 1,
        name: "You",
        avatar: "https://bit.ly/dan-abramov",
        isOnline: true,
      },
      {
        id: 2,
        name: "Sarah",
        avatar: "https://bit.ly/kent-c-dodds",
        isOnline: true,
      },
      {
        id: 3,
        name: "Mike",
        avatar: "https://bit.ly/ryan-florence",
        isOnline: false,
      },
      {
        id: 4,
        name: "Emma",
        avatar: "https://bit.ly/prosper-baba",
        isOnline: true,
      },
    ],
    itinerary: [
      {
        id: "1",
        name: "Eiffel Tower",
        time: "09:00",
        votes: { up: 3, down: 1 },
        comments: [
          {
            id: 1,
            user: "Sarah",
            text: "Perfect timing for photos!",
            time: "2h ago",
          },
          { id: 2, user: "Mike", text: "Maybe too early?", time: "1h ago" },
        ],
      },
      {
        id: "2",
        name: "Louvre Museum",
        time: "12:00",
        votes: { up: 4, down: 0 },
        comments: [
          { id: 3, user: "Emma", text: "Love this choice!", time: "3h ago" },
        ],
      },
    ],
    liveUpdates: [
      {
        id: 1,
        user: "Sarah",
        action: "voted up",
        item: "Eiffel Tower",
        time: "2m ago",
      },
      {
        id: 2,
        user: "Mike",
        action: "commented on",
        item: "Louvre Museum",
        time: "5m ago",
      },
      {
        id: 3,
        user: "Emma",
        action: "suggested",
        item: "Notre-Dame Cathedral",
        time: "10m ago",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState("itinerary");

  const handleVote = (itemId, voteType) => {
    setGroupData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item) =>
        item.id === itemId
          ? {
              ...item,
              votes: {
                ...item.votes,
                [voteType]: item.votes[voteType] + 1,
              },
            }
          : item,
      ),
    }));

    toast({
      title: "Vote Recorded",
      description: `You ${voteType === "up" ? "liked" : "disliked"} this item.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: "You",
      text: newComment,
      time: "now",
    };

    setGroupData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item) =>
        item.id === activeTab
          ? {
              ...item,
              comments: [...item.comments, comment],
            }
          : item,
      ),
    }));

    setNewComment("");
    onClose();

    toast({
      title: "Comment Added",
      description: "Your comment has been shared with the group.",
      status: "success",
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
        ease: "easeOut",
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
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/itinerary/${tripId}`}>
                {groupData.tripName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <Text>Group Planning</Text>
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
                  to={`/itinerary/${tripId}`}
                  variant="ghost"
                  leftIcon={<FiArrowLeft />}
                  size="sm"
                >
                  Back to Itinerary
                </Button>
              </HStack>
              <Heading fontSize="3xl" fontWeight="bold">
                Group Planning Hub
              </Heading>
              <HStack spacing={4} color="gray.600">
                <HStack>
                  <FiUsers />
                  <Text fontSize="sm">{groupData.members.length} members</Text>
                </HStack>
                <HStack>
                  <Box w={2} h={2} bg="green.400" borderRadius="full" />
                  <Text fontSize="sm">
                    {groupData.members.filter((m) => m.isOnline).length} online
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            <HStack spacing={2}>
              <Button variant="outline" leftIcon={<FiShare2 />} size="sm">
                Invite Friends
              </Button>
            </HStack>
          </Flex>
        </MotionBox>

        {/* Group Members */}
        <MotionCard variants={itemVariants} w="full">
          <CardHeader>
            <Heading size="md">Group Members</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={4}>
              <AvatarGroup size="md" max={4}>
                {groupData.members.map((member) => (
                  <Avatar
                    key={member.id}
                    name={member.name}
                    src={member.avatar}
                    border={member.isOnline ? "2px solid" : "none"}
                    borderColor={member.isOnline ? "green.400" : "transparent"}
                  />
                ))}
              </AvatarGroup>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium">
                  {groupData.members.map((m) => m.name).join(", ")}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {groupData.members.filter((m) => m.isOnline).length} members
                  online
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </MotionCard>

        {/* Tabs */}
        <MotionBox w="full" variants={itemVariants}>
          <HStack spacing={4} borderBottom="1px" borderColor="gray.200">
            <Button
              variant={activeTab === "itinerary" ? "solid" : "ghost"}
              colorScheme={activeTab === "itinerary" ? "blue" : "gray"}
              onClick={() => setActiveTab("itinerary")}
            >
              Itinerary
            </Button>
            <Button
              variant={activeTab === "updates" ? "solid" : "ghost"}
              colorScheme={activeTab === "updates" ? "blue" : "gray"}
              onClick={() => setActiveTab("updates")}
            >
              Live Updates
            </Button>
          </HStack>
        </MotionBox>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "itinerary" && (
            <MotionVStack
              key="itinerary"
              spacing={6}
              w="full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {groupData.itinerary.map((item, index) => (
                <MotionCard
                  key={item.id}
                  variants={itemVariants}
                  w="full"
                  whileHover={{ y: -2 }}
                >
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {/* Item Header */}
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <Text fontWeight="semibold" fontSize="lg">
                              {item.name}
                            </Text>
                            <Badge colorScheme="blue" variant="subtle">
                              {item.time}
                            </Badge>
                          </HStack>
                          <HStack spacing={2} fontSize="sm" color="gray.600">
                            <HStack>
                              <FiMapPin />
                              <Text>Landmark</Text>
                            </HStack>
                            <HStack>
                              <FiClock />
                              <Text>2 hours</Text>
                            </HStack>
                          </HStack>
                        </VStack>

                        {/* Vote Buttons */}
                        <HStack spacing={2}>
                          <IconButton
                            icon={<FiThumbsUp />}
                            size="sm"
                            variant="ghost"
                            colorScheme="green"
                            onClick={() => handleVote(item.id, "up")}
                          />
                          <Text fontSize="sm" fontWeight="medium">
                            {item.votes.up}
                          </Text>
                          <IconButton
                            icon={<FiThumbsDown />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleVote(item.id, "down")}
                          />
                          <Text fontSize="sm" fontWeight="medium">
                            {item.votes.down}
                          </Text>
                        </HStack>
                      </HStack>

                      {/* Comments */}
                      {item.comments.length > 0 && (
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>
                            Comments ({item.comments.length})
                          </Text>
                          <VStack spacing={2} align="stretch">
                            {item.comments.map((comment) => (
                              <Box
                                key={comment.id}
                                p={3}
                                bg="gray.50"
                                borderRadius="md"
                                borderLeft="3px solid"
                                borderLeftColor="blue.400"
                              >
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {comment.user}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {comment.time}
                                  </Text>
                                </HStack>
                                <Text fontSize="sm" color="gray.700">
                                  {comment.text}
                                </Text>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      )}

                      {/* Add Comment Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<FiMessageCircle />}
                        onClick={() => {
                          setActiveTab(item.id);
                          onOpen();
                        }}
                      >
                        Add Comment
                      </Button>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </MotionVStack>
          )}

          {activeTab === "updates" && (
            <MotionVStack
              key="updates"
              spacing={4}
              w="full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Text fontSize="lg" fontWeight="semibold">
                Live Activity Feed
              </Text>
              {groupData.liveUpdates.map((update, index) => (
                <MotionCard
                  key={update.id}
                  variants={itemVariants}
                  w="full"
                  whileHover={{ y: -2 }}
                >
                  <CardBody>
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        name={update.user}
                        src={`https://bit.ly/${update.user.toLowerCase()}`}
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm">
                          <Text as="span" fontWeight="medium">
                            {update.user}
                          </Text>{" "}
                          {update.action}{" "}
                          <Text as="span" fontWeight="medium">
                            {update.item}
                          </Text>
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {update.time}
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </MotionCard>
              ))}
            </MotionVStack>
          )}
        </AnimatePresence>

        {/* Add Comment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Your Comment</FormLabel>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this item..."
                    rows={4}
                  />
                </FormControl>
                <HStack spacing={4} w="full" justify="end">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleAddComment}>
                    Post Comment
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

export default GroupPlanningPage;
