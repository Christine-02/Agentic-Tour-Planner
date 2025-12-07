import React from "react";
import {
  Box,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
  HStack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const LoadingSkeleton = ({ type = "itinerary" }) => {
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (type === "itinerary") {
    return (
      <MotionVStack
        spacing={6}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[1, 2, 3].map((day) => (
          <MotionCard
            key={day}
            variants={itemVariants}
            w="full"
            whileHover={{ y: -2 }}
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Day Header */}
                <HStack justify="space-between">
                  <VStack align="start" spacing={2}>
                    <Skeleton height="20px" width="100px" />
                    <Skeleton height="16px" width="150px" />
                  </VStack>
                  <Skeleton height="24px" width="60px" borderRadius="full" />
                </HStack>

                {/* Itinerary Items */}
                <VStack spacing={3} align="stretch">
                  {[1, 2, 3].map((item) => (
                    <Box
                      key={item}
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                    >
                      <HStack spacing={4} align="start">
                        <SkeletonCircle size="8" />
                        <VStack spacing={2} align="start" flex={1}>
                          <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={1}>
                              <Skeleton height="18px" width="200px" />
                              <HStack spacing={2}>
                                <Skeleton
                                  height="16px"
                                  width="80px"
                                  borderRadius="full"
                                />
                                <Skeleton height="16px" width="100px" />
                              </HStack>
                            </VStack>
                            <SkeletonCircle size="6" />
                          </HStack>
                          <SkeletonText noOfLines={2} spacing="2" />
                          <HStack spacing={4}>
                            <Skeleton height="14px" width="80px" />
                            <Skeleton height="14px" width="100px" />
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </MotionCard>
        ))}
      </MotionVStack>
    );
  }

  if (type === "trip-cards") {
    return (
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        display="grid"
        gridTemplateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <MotionCard key={card} variants={itemVariants} whileHover={{ y: -4 }}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Skeleton height="20px" width="150px" />
                    <HStack spacing={2}>
                      <Skeleton height="14px" width="100px" />
                      <Skeleton height="14px" width="80px" />
                    </HStack>
                  </VStack>
                  <SkeletonCircle size="6" />
                </HStack>

                <Skeleton height="120px" borderRadius="md" />

                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Skeleton height="14px" width="60px" />
                    <Skeleton height="14px" width="80px" />
                  </HStack>
                  <Skeleton height="20px" width="60px" borderRadius="full" />
                </HStack>

                <HStack spacing={2}>
                  <Skeleton height="32px" flex={1} />
                  <Skeleton height="32px" width="80px" />
                </HStack>
              </VStack>
            </CardBody>
          </MotionCard>
        ))}
      </MotionBox>
    );
  }

  if (type === "form") {
    return (
      <MotionCard
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        w="full"
        maxW="2xl"
        mx="auto"
      >
        <CardBody>
          <VStack spacing={6}>
            <VStack spacing={4} textAlign="center">
              <Skeleton height="32px" width="300px" />
              <Skeleton height="20px" width="400px" />
            </VStack>

            <VStack spacing={6} w="full">
              {[1, 2, 3, 4, 5].map((field) => (
                <Box key={field} w="full">
                  <Skeleton height="16px" width="100px" mb={2} />
                  <Skeleton height="40px" w="full" />
                </Box>
              ))}

              <Skeleton height="48px" w="full" />
            </VStack>
          </VStack>
        </CardBody>
      </MotionCard>
    );
  }

  return (
    <MotionBox variants={containerVariants} initial="hidden" animate="visible">
      <Skeleton height="200px" />
    </MotionBox>
  );
};

export default LoadingSkeleton;
