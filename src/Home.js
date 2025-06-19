import React from "react";
import {
    Box,
    Heading,
    Text,
    Button,
    Image,
    VStack,
    HStack,
    Container,
    useColorModeValue,
    SimpleGrid,
    chakra,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(chakra.div);

export default function Home() {
    const bgGradient = useColorModeValue(
        "linear(to-r, teal.400, green.300)",
        "linear(to-r, teal.600, green.500)"
    );
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.700", "gray.300");

    return (
        <Box minH="100vh" bgGradient={bgGradient} py={{ base: 10, md: 20 }}>
            {/* HERO SECTION */}
            <Container maxW="container.lg" centerContent>
                <MotionBox
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    textAlign="center"
                    color="white"
                >
                    <Image
                        src="https://cdn-icons-png.flaticon.com/512/3317/3317911.png"
                        alt="Eco Icon"
                        boxSize="120px"
                        mx="auto"
                        mb={6}
                        filter="drop-shadow(0 0 6px rgba(0,0,0,0.4))"
                    />
                    <Heading
                        fontSize={{ base: "3xl", md: "5xl" }}
                        fontWeight="extrabold"
                        mb={4}
                        textShadow="2px 2px 6px rgba(0,0,0,0.4)"
                    >
                        Welcome to Carbon Tracker 🌿
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "2xl" }} maxW="600px" mx="auto" mb={8}>
                        Track your clothing carbon footprint in real-time and make impactful, sustainable choices.
                    </Text>
                    <Button
                        as={Link}
                        to="/dashboard"
                        size="lg"
                        colorScheme="teal"
                        bg="white"
                        color="teal.600"
                        fontWeight="bold"
                        px={10}
                        _hover={{ bg: "teal.300", color: "white" }}
                        boxShadow="md"
                    >
                        Go to Dashboard
                    </Button>
                </MotionBox>
            </Container>

            {/* INFO SECTION */}
            <Container maxW="container.lg" mt={20} px={{ base: 4, md: 0 }}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16} alignItems="center">
                    <MotionBox
                        bg={cardBg}
                        p={8}
                        rounded="xl"
                        shadow="lg"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Heading mb={6} color={textColor} fontSize={{ base: "2xl", md: "3xl" }}>
                            What is Carbon Footprint?
                        </Heading>
                        <Text fontSize="lg" mb={4} color={textColor} lineHeight="tall">
                            A <strong>carbon footprint</strong> is the total amount of greenhouse gases,
                            mainly carbon dioxide, released into the atmosphere by your activities.
                        </Text>
                        <Text fontSize="lg" mb={4} color={textColor} lineHeight="tall">
                            Every step in clothing production — from growing cotton to manufacturing and shipping — creates carbon emissions.
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="teal.500">
                            Understanding your footprint helps you make eco-friendly choices and reduce your impact on our planet 🌍
                        </Text>
                    </MotionBox>

                    <MotionBox
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        textAlign="center"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                            alt="Nature and sustainability"
                            rounded="2xl"
                            shadow="xl"
                            mx="auto"
                            maxW="400px"
                        />
                    </MotionBox>
                </SimpleGrid>
            </Container>

            {/* CALL TO ACTION BANNER */}
            <Box
                mt={24}
                py={10}
                bg="teal.600"
                color="white"
                textAlign="center"
                rounded="xl"
                mx={{ base: 4, md: "auto" }}
                maxW="container.md"
                boxShadow="2xl"
            >
                <Heading mb={4} fontSize={{ base: "xl", md: "3xl" }}>
                    Ready to reduce your carbon footprint today?
                </Heading>
                <Button
                    as={Link}
                    to="/dashboard"
                    size="lg"
                    colorScheme="teal"
                    bg="white"
                    color="teal.600"
                    fontWeight="bold"
                    px={10}
                    _hover={{ bg: "teal.300", color: "white" }}
                    boxShadow="md"
                >
                    Start Tracking Now
                </Button>
            </Box>
        </Box>
    );
}
