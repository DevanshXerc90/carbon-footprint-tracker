import React from "react";
import { useFrame } from "@react-three/fiber";

export function Tree() {
    const treeRef = React.useRef();

    // Optional: Slight animation
    useFrame(() => {
        if (treeRef.current) {
            treeRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={treeRef}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Leaves */}
            <mesh position={[0, 1.3, 0]}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </group>
    );
}
