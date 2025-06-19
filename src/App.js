import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from './pages/Login';
import Wardrobe from './pages/Wardrobe';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Home from "./Home";
import Dashboard from "./Dashboard";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navBg = useColorModeValue("gray.100", "gray.900");

  return (
    <>
      <Flex bg={navBg} p={4} align="center" shadow="md">
        <Heading size="md" mr={4}>
          Carbon Tracker
        </Heading>
        <Button as={Link} to="/login" variant="outline" colorScheme="teal" ml={2}>
          Login
        </Button>

        <Button as={Link} to="/" variant="ghost" mr={2}>
          Home
        </Button>
        <Button as={Link} to="/dashboard" variant="ghost" mr={2}>
          Dashboard
        </Button>
        <Button as={Link} to="/wardrobe" variant="ghost" mr={2}>
          Wardrobe
        </Button>
        <Spacer />
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? "Dark" : "Light"}
        </Button>
      </Flex>

      <Box p={6}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
