import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserThunk } from '../../store/thunks/authThunks';
import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  useColorMode,
  useColorModeValue,
  HStack,
  IconButton,
  Image,
  Tooltip,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionAvatar = motion(Avatar);
const MotionImage = motion(Image);

const PRIMARY_COLOR = '#00754a'; // Starbucks-inspired green

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('#ffffff', '#0a0f0f');
  const borderColor = useColorModeValue('#e0e0e0', '#1a1a1a');
  const navShadow = useColorModeValue(
    '0 2px 8px rgba(0, 0, 0, 0.06)',
    '0 2px 8px rgba(0, 120, 90, 0.08)'
  );
  const menuBgColor = useColorModeValue('#ffffff', '#111');

  const handleLogout = () => dispatch(logoutUserThunk());

  const getFirstNameInitial = () => {
    if (!user) return '?';
    return (user.displayName || user.email || '?').trim().charAt(0).toUpperCase();
  };

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          px={4}
          py={3}
          position="sticky"
          top={0}
          zIndex={100}
          bg={bgColor}
          boxShadow={navShadow}
          borderBottomWidth={1}
          borderColor={borderColor}
          backdropFilter="blur(10px)"
        >
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <MotionFlex alignItems={'center'}>
              <MotionImage
                src="/karkhana-logo.png"
                alt="Karkhana Logo"
                boxSize="40px"
                mr={3}
                whileHover={{ scale: 1.1 }}
              />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={PRIMARY_COLOR}
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.03)", textDecoration: 'underline' }}
              >
                Project Cost Tracker
              </Text>
            </MotionFlex>

            <Flex alignItems={'center'}>
              <Tooltip label={colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}>
                <IconButton
                  size="md"
                  mr={4}
                  aria-label="Toggle Color Mode"
                  icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  color={PRIMARY_COLOR}
                  _hover={{ transform: "rotate(15deg)" }}
                  transition="all 0.3s ease"
                />
              </Tooltip>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                  _hover={{ transform: "scale(1.05)" }}
                >
                  <HStack>
                    <MotionAvatar
                      size="md"
                      name={getFirstNameInitial()}
                      bg={PRIMARY_COLOR}
                      color="white"
                      fontWeight="bold"
                      fontSize="lg"
                      whileHover={{ scale: 1.1 }}
                    />
                    <Text display={{ base: 'none', md: 'flex' }} color={PRIMARY_COLOR}>
                      {user?.displayName}
                    </Text>
                    <MotionFlex animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <FaChevronDown color={PRIMARY_COLOR} size={12} />
                    </MotionFlex>
                  </HStack>
                </MenuButton>

                <MenuList
                  boxShadow="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  bg={menuBgColor}
                >
                  <MenuItem
                    icon={<FaUser color={PRIMARY_COLOR} />}
                    _hover={{ bg: 'gray.100', color: PRIMARY_COLOR }}
                  >
                    {user?.email}
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={handleLogout}
                    icon={<FaSignOutAlt />}
                    color={PRIMARY_COLOR}
                    _hover={{ bg: 'gray.100', color: PRIMARY_COLOR }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default Navbar;