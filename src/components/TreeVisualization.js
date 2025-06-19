import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Tree } from "./models/Tree";

export default function TreeVisualization() {
    return (
        <Box h="400px" borderRadius="md" overflow="hidden" border="1px solid" borderColor="gray.200">
            <Text fontSize="md" fontWeight="semibold" p={2}>
                Your Emission-Saving Tree 🌳
            </Text>
            <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <OrbitControls />
                <Tree />
            </Canvas>
        </Box>
    );
}
