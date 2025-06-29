import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChakraProvider,
  extendTheme,
  Spinner,
  Center,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import { auth, setupFirestore } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess } from './store/slices/authSlice';
import Dashboard from './components/Dashboard/Dashboard';
import AuthContainer from './components/Auth/AuthContainer';

// Starbucks green base color
const PRIMARY_COLOR = '#00704A';

// Chakra theme with Starbucks Green branding
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#e3f2ec',
      100: '#c1e0d1',
      200: '#9dceb5',
      300: '#78bc99',
      400: '#57ad82',
      500: PRIMARY_COLOR,
      600: '#006243',
      700: '#00563b',
      800: '#004832',
      900: '#00341f',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0e1a16' : '#f5f9f7',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
        fontFamily: 'Inter, sans-serif',
      },
    }),
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: PRIMARY_COLOR,
          color: 'white',
          _hover: { bg: '#00563b' },
        },
        ghost: {
          color: PRIMARY_COLOR,
        },
      },
    },
    Spinner: {
      baseStyle: {
        color: PRIMARY_COLOR,
      },
    },
    Text: {
      baseStyle: {
        color: PRIMARY_COLOR,
      },
    },
  },
});

function App() {
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const result = await setupFirestore(user.uid);

          if (!result.success) {
            toast({
              title: 'Database access error',
              description: 'Please try signing out and in again.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }

          dispatch(
            loginSuccess({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            })
          );
        }
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Authentication Error',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        if (initializing) setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch, initializing, toast]);

  if (initializing) {
    return (
      <ChakraProvider theme={theme}>
        <Center h="100vh">
          <Spinner size="xl" thickness="4px" />
        </Center>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider theme={theme}>
        <Center h="100vh" flexDirection="column">
          <Box p={8} borderRadius="md" bg="red.100" color="red.800">
            <Text fontWeight="bold">Error initializing app:</Text>
            <Text>{error}</Text>
            <Text mt={4}>Please refresh the page to try again.</Text>
          </Box>
        </Center>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      {isAuthenticated ? <Dashboard /> : <AuthContainer />}
    </ChakraProvider>
  );
}

export default App;