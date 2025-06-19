// src/pages/Login.jsx
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    VStack,
    useToast,
    Flex,
    Text,
    Image,
    Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Login = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                loginData.email,
                loginData.password
            );
            const user = userCredential.user;

            toast({
                title: 'Login successful',
                description: `Welcome, ${user.email}!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (error) {
            toast({
                title: 'Login failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(
                auth,
                signupData.email,
                signupData.password
            );
            toast({
                title: 'Sign-up successful',
                description: 'You can now log in!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setSignupData({ email: '', password: '' });
        } catch (error) {
            toast({
                title: 'Sign-up failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            toast({
                title: 'Google Sign-In successful',
                description: `Welcome, ${user.displayName || user.email}!`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (error) {
            toast({
                title: 'Google Sign-In failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box minH="100vh" bg="gray.50">
            <Box bg="teal.400" py={8} textAlign="center" color="white">
                <Heading>Welcome to Carbon Tracker 🌱</Heading>
                <Text fontSize="lg" mt={2}>Track and reduce your clothing carbon footprint</Text>
            </Box>

            <Flex direction={{ base: 'column', md: 'row' }} maxW="6xl" mx="auto" mt={10} p={6} gap={10}>
                {/* Login Card */}
                <Box flex={1} p={6} borderWidth="1px" borderRadius="xl" boxShadow="lg" bg="black">
                    <Heading size="lg" textAlign="center" mb={6}>Login</Heading>
                    <form onSubmit={handleLogin}>
                        <VStack spacing={4}>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                            </FormControl>
                            <Button colorScheme="teal" type="submit" w="full">
                                Log In
                            </Button>
                            <Button onClick={handleGoogleLogin} colorScheme="red" w="full">
                                Sign in with Google
                            </Button>
                        </VStack>
                    </form>
                </Box>

                <Divider orientation="vertical" display={{ base: 'none', md: 'block' }} />

                {/* Sign-up Card */}
                <Box flex={1} p={6} borderWidth="1px" borderRadius="xl" boxShadow="lg" bg="black">
                    <Heading size="lg" textAlign="center" mb={6}>New here?</Heading>
                    <Text textAlign="center" mb={4}>Create an account to start tracking 🌍</Text>
                    <form onSubmit={handleSignup}>
                        <VStack spacing={4}>
                            <FormControl id="new-email" isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                />
                            </FormControl>
                            <FormControl id="new-password" isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    placeholder="Create a password"
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                />
                            </FormControl>
                            <Button colorScheme="green" type="submit" w="full">
                                Sign Up
                            </Button>
                        </VStack>
                    </form>
                </Box>
            </Flex>

            <Box textAlign="center" mt={10}>
                <Image
                    src="https://cdn-icons-png.flaticon.com/512/3317/3317911.png"
                    alt="Eco Icon"
                    mx="auto"
                    boxSize="80px"
                />
                <Text color="gray.600" mt={2}>
                    🌍 Every small step counts. Join us in creating a sustainable future!
                </Text>
            </Box>
        </Box>
    );
};

export default Login;
