// Updated CostSummary.js using Indigo theme
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  useColorModeValue,
  Image,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaReceipt } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionStat = motion(Stat);

const PRIMARY_COLOR = '#4B0082';
const SECONDARY_COLOR = '#6A0DAD';

const CostSummary = () => {
  const { items } = useSelector((state) => state.items);
  const { otherCosts } = useSelector((state) => state.otherCosts);

  const bgGradient = useColorModeValue(
    `linear(to-r, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`,
    `linear(to-r, ${PRIMARY_COLOR}, ${SECONDARY_COLOR})`
  );

  // Calculate totals
  const calculations = useMemo(() => {
    const itemsTotal = items.reduce((sum, item) => sum + Number(item.cost), 0);
    const otherCostsTotal = otherCosts.reduce((sum, cost) => sum + Number(cost.amount), 0);
    const total = itemsTotal + otherCostsTotal;
    return {
      itemsTotal,
      otherCostsTotal,
      total,
    };
  }, [items, otherCosts]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      mb={8}
    >
      <MotionBox
        borderRadius="2xl"
        boxShadow="xl"
        p={{ base: 6, md: 8 }}
        bgGradient={bgGradient}
        color="white"
        overflow="hidden"
        position="relative"
      >
        <MotionFlex alignItems="center" justifyContent="space-between">
          <MotionStat
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatLabel fontSize="lg" fontWeight="medium">
              Total Project Cost
            </StatLabel>
            <StatNumber
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, white, whiteAlpha.800)"
              bgClip="text"
              letterSpacing="tight"
              textShadow="0 0 5px rgba(255,255,255,0.3)"
            >
              {formatCurrency(calculations.total)}
            </StatNumber>
            <StatHelpText color="whiteAlpha.800" fontWeight="medium">
              A breakdown of your project expenses
            </StatHelpText>
          </MotionStat>

          <MotionBox
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            display="flex"
          >
            <Image
              src="/karkhana-logo.png"
              alt="Karkhana Logo"
              boxSize={{ base: 16, md: 20 }}
              objectFit="contain"
            />
          </MotionBox>
        </MotionFlex>
      </MotionBox>

      <MotionFlex mt={4} gap={4} direction={{ base: 'column', md: 'row' }}>
        <MotionBox
          flex="1"
          p={4}
          borderRadius="lg"
          bg="white"
          boxShadow="md"
          borderWidth={1}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <MotionFlex alignItems="center" justifyContent="space-between">
            <Stat>
              <StatLabel color={PRIMARY_COLOR} fontWeight="medium">
                Items Total
              </StatLabel>
              <StatNumber fontSize="2xl">
                {formatCurrency(calculations.itemsTotal)}
              </StatNumber>
              <StatHelpText>{items.length} items</StatHelpText>
            </Stat>
            <MotionBox
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              display="flex"
            >
              <Icon as={FaShoppingCart} color={PRIMARY_COLOR} boxSize={6} />
            </MotionBox>
          </MotionFlex>
        </MotionBox>

        <MotionBox
          flex="1"
          p={4}
          borderRadius="lg"
          bg="white"
          boxShadow="md"
          borderWidth={1}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <MotionFlex alignItems="center" justifyContent="space-between">
            <Stat>
              <StatLabel color={SECONDARY_COLOR} fontWeight="medium">
                Other Costs Total
              </StatLabel>
              <StatNumber fontSize="2xl">
                {formatCurrency(calculations.otherCostsTotal)}
              </StatNumber>
              <StatHelpText>{otherCosts.length} other costs</StatHelpText>
            </Stat>
            <MotionBox
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              display="flex"
            >
              <Icon as={FaReceipt} color={SECONDARY_COLOR} boxSize={6} />
            </MotionBox>
          </MotionFlex>
        </MotionBox>
      </MotionFlex>
    </MotionBox>
  );
};

export default CostSummary;