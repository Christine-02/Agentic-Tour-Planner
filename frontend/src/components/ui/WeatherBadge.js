import React, { useState } from "react";
import {
  Box,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  VStack,
  HStack,
  Text,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { WiDaySunny, WiRain, WiCloudy, WiThunderstorm } from "react-icons/wi";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionBadge = motion(Badge);

const WeatherBadge = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [weatherState, setWeatherState] = useState("normal"); // normal, warning, alert

  // Mock weather data - in real app, this would come from an API
  const weatherData = {
    temperature: 22,
    condition: "sunny",
    alerts: [
      { type: "warning", message: "Heavy rain expected tomorrow" },
      { type: "info", message: "UV index high - wear sunscreen" },
    ],
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "sunny":
        return WiDaySunny;
      case "rainy":
        return WiRain;
      case "cloudy":
        return WiCloudy;
      case "stormy":
        return WiThunderstorm;
      default:
        return WiDaySunny;
    }
  };

  const getWeatherColor = (condition) => {
    switch (condition) {
      case "sunny":
        return "yellow.400";
      case "rainy":
        return "blue.400";
      case "cloudy":
        return "gray.400";
      case "stormy":
        return "purple.400";
      default:
        return "yellow.400";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "warning":
        return "orange.500";
      case "alert":
        return "red.500";
      case "info":
        return "blue.500";
      default:
        return "gray.500";
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
      case "alert":
        return FiAlertTriangle;
      case "info":
        return FiInfo;
      default:
        return FiInfo;
    }
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
      <PopoverTrigger>
        <MotionBox
          cursor="pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
        >
          <MotionBadge
            colorScheme="blue"
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            display="flex"
            alignItems="center"
            gap={2}
            animate={{
              scale: weatherState === "alert" ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: weatherState === "alert" ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <Icon
              as={getWeatherIcon(weatherData.condition)}
              color={getWeatherColor(weatherData.condition)}
              boxSize={4}
            />
            <Text fontSize="sm" fontWeight="medium">
              {weatherData.temperature}°C
            </Text>
            {weatherData.alerts.length > 0 && (
              <MotionBox
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon as={FiAlertTriangle} color="orange.500" boxSize={3} />
              </MotionBox>
            )}
          </MotionBadge>
        </MotionBox>
      </PopoverTrigger>

      <PopoverContent maxW="sm">
        <PopoverArrow />
        <PopoverBody p={4}>
          <VStack spacing={4} align="stretch">
            {/* Current Weather */}
            <HStack justify="space-between">
              <HStack>
                <Icon
                  as={getWeatherIcon(weatherData.condition)}
                  color={getWeatherColor(weatherData.condition)}
                  boxSize={6}
                />
                <VStack align="start" spacing={0}>
                  <Text fontSize="lg" fontWeight="bold">
                    {weatherData.temperature}°C
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    textTransform="capitalize"
                  >
                    {weatherData.condition}
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            {/* Alerts */}
            {weatherData.alerts.length > 0 && (
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Travel Alerts
                </Text>
                {weatherData.alerts.map((alert, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HStack
                      p={2}
                      bg={`${getAlertColor(alert.type)}.50`}
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderLeftColor={`${getAlertColor(alert.type)}.400`}
                    >
                      <Icon
                        as={getAlertIcon(alert.type)}
                        color={`${getAlertColor(alert.type)}.500`}
                        boxSize={4}
                      />
                      <Text fontSize="sm" color="gray.700">
                        {alert.message}
                      </Text>
                    </HStack>
                  </MotionBox>
                ))}
              </VStack>
            )}

            {/* Quick Actions */}
            <HStack
              justify="space-between"
              pt={2}
              borderTop="1px"
              borderColor="gray.200"
            >
              <Text fontSize="xs" color="gray.500">
                Last updated: 2 min ago
              </Text>
              <Text
                fontSize="xs"
                color="blue.500"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                View Details
              </Text>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default WeatherBadge;
