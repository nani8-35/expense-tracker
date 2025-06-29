import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button
} from '@chakra-ui/react';
import Navbar from '../Layout/Navbar';
import CostSummary from './CostSummary';
import ItemsList from '../Items/ItemsList';
import OtherCostsList from '../OtherCosts/OtherCostsList';
import { fetchItemsThunk } from '../../store/thunks/itemsThunks';
import { fetchOtherCostsThunk } from '../../store/thunks/otherCostsThunks';
import { setupFirestore } from '../../firebase';
import { motion, AnimatePresence } from 'framer-motion';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const fadeSlideScale = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error: itemsError } = useSelector((state) => state.items);
  const { error: otherCostsError } = useSelector((state) => state.otherCosts);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [firebaseError, setFirebaseError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const result = await setupFirestore(user.uid);
          if (!result.success) {
            setFirebaseError('Failed to initialize database. Please try refreshing.');
          }
          await dispatch(fetchItemsThunk(user.uid));
          await dispatch(fetchOtherCostsThunk(user.uid));
        } catch (error) {
          setFirebaseError(`Error: ${error.message}`);
        }
      } else {
        setFirebaseError('Not authenticated. Please sign in again.');
      }
    };
    fetchData();
  }, [dispatch, user]);

  const handleRetry = async () => {
    setFirebaseError(null);
    if (user) {
      try {
        await setupFirestore(user.uid);
        await dispatch(fetchItemsThunk(user.uid));
        await dispatch(fetchOtherCostsThunk(user.uid));
      } catch (error) {
        setFirebaseError(`Retry failed: ${error.message}`);
      }
    }
  };

  const showError = firebaseError || itemsError || otherCostsError;

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />

      <MotionContainer
        maxW="container.lg"
        py={8}
        initial="initial"
        animate="animate"
        variants={fadeSlideScale}
      >
        <AnimatePresence>
          {showError && (
            <MotionBox
              key="alert"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              mb={6}
            >
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>
                  {firebaseError || itemsError || otherCostsError}
                </AlertDescription>
                <Button ml="auto" size="sm" onClick={handleRetry}>
                  Retry
                </Button>
              </Alert>
            </MotionBox>
          )}
        </AnimatePresence>

        <VStack spacing={8} align="stretch">
          <MotionBox {...fadeSlideScale}><CostSummary /></MotionBox>
          <MotionBox {...fadeSlideScale} transition={{ ...fadeSlideScale.transition, delay: 0.1 }}>
            <ItemsList />
          </MotionBox>
          <MotionBox {...fadeSlideScale} transition={{ ...fadeSlideScale.transition, delay: 0.2 }}>
            <OtherCostsList />
          </MotionBox>
        </VStack>
      </MotionContainer>
    </Box>
  );
};

export default Dashboard;