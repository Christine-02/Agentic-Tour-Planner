import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  FiClock,
  FiMapPin,
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiGripVertical,
} from 'react-icons/fi';

const MotionBox = motion(Box);

const SortableItineraryItem = ({
  id,
  step,
  onEdit,
  onDelete,
  categoryColor,
  formatTime,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const bg = 'white';
  const borderColor = 'gray.200';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <MotionBox
      ref={setNodeRef}
      style={style}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      opacity={isDragging ? 0.5 : 1}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <HStack spacing={4} align="start">
        {/* Drag Handle */}
        <Box
          {...attributes}
          {...listeners}
          cursor="grab"
          p={1}
          _hover={{ bg: 'gray.100' }}
          borderRadius="md"
          _active={{ cursor: 'grabbing' }}
        >
          <Icon as={FiMoreVertical} color="gray.400" />
        </Box>

        {/* Time Badge */}
        <VStack spacing={1} align="center" minW="80px">
          <Badge
            colorScheme="blue"
            variant="subtle"
            fontSize="xs"
            px={2}
            py={1}
          >
            {step.start_time || step.time || '09:00'}
            {step.end_time && ` - ${step.end_time}`}
          </Badge>
          <Text fontSize="xs" color="gray.500">
            {formatTime(step.duration_mins)}
          </Text>
        </VStack>

        {/* Content */}
        <VStack spacing={2} align="start" flex={1}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold" fontSize="md">
                {step.name}
              </Text>
              <HStack spacing={2}>
                <Badge
                  colorScheme={categoryColor}
                  variant="subtle"
                  fontSize="xs"
                >
                  {step.category}
                </Badge>
                {step.travel_from_prev_mins > 0 && (
                  <HStack spacing={1}>
                    <Icon as={FiMapPin} color="gray.400" boxSize={3} />
                    <Text fontSize="xs" color="gray.500">
                      {formatTime(step.travel_from_prev_mins)} travel
                    </Text>
                  </HStack>
                )}
              </HStack>
            </VStack>

            {/* Actions Menu */}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem icon={<FiEdit3 />} onClick={onEdit}>
                  Edit
                </MenuItem>
                <MenuItem
                  icon={<FiTrash2 />}
                  onClick={onDelete}
                  color="red.500"
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {step.desc && (
            <Text fontSize="sm" color="gray.600" lineHeight="short">
              {step.desc}
            </Text>
          )}

          {/* Duration and Travel Time */}
          <HStack spacing={4} fontSize="xs" color="gray.500">
            <HStack spacing={1}>
              <Icon as={FiClock} />
              <Text>Duration: {formatTime(step.duration_mins)}</Text>
            </HStack>
            {step.travel_from_prev_mins > 0 && (
              <HStack spacing={1}>
                <Icon as={FiMapPin} />
                <Text>Travel: {formatTime(step.travel_from_prev_mins)}</Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </HStack>
    </MotionBox>
  );
};

export default SortableItineraryItem;
