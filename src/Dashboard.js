import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Divider,
    VStack,
    Text,
} from "@chakra-ui/react";
import FootprintForm from "./components/FootprintForm";
import TreeVisualization from "./components/TreeVisualization";

export default function Dashboard() {
    const [carbonScore, setCarbonScore] = useState(null);
    const [itemsTracked, setItemsTracked] = useState(0);
    const [totalSaved, setTotalSaved] = useState(0);
    const [items, setItems] = useState([]);

    // Fetch existing items from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/users")
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setItemsTracked(data.length);
                const total = data.reduce((sum, item) => sum + parseFloat(item.carbonSaved || 0), 0);
                setTotalSaved(parseFloat(total.toFixed(2)));
            })
            .catch((err) => console.error("Error fetching items:", err));
    }, []);

    const handleFormSubmit = (data) => {
        // Estimate score (temporary logic; replace with ML/API later)
        let score = 10;
        if (data.material.toLowerCase() === "polyester") score += 5;
        if (data.brand.toLowerCase() === "h&m") score += 3;
        if (data.type.toLowerCase() === "jacket") score += 4;

        const carbonSaved = parseFloat((score * 0.1).toFixed(2));
        setCarbonScore(score);

        // Save to backend
        fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name || "Item",
                carbonSaved,
            }),
        })
            .then((res) => res.json())
            .then((newItem) => {
                const updatedItems = [...items, newItem];
                setItems(updatedItems);
                setItemsTracked(updatedItems.length);
                const total = updatedItems.reduce(
                    (sum, item) => sum + parseFloat(item.carbonSaved || 0),
                    0
                );
                setTotalSaved(parseFloat(total.toFixed(2)));
            })
            .catch((err) => console.error("Error saving item:", err));
    };

    return (
        <Box>
            <Heading mb={4}>Your Dashboard</Heading>
            <Divider mb={6} />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
                <Stat p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                    <StatLabel>Total Carbon Saved</StatLabel>
                    <StatNumber>{totalSaved} kg CO₂</StatNumber>
                    <StatHelpText>Compared to fast fashion</StatHelpText>
                </Stat>

                <Stat p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                    <StatLabel>Items Tracked</StatLabel>
                    <StatNumber>{itemsTracked}</StatNumber>
                    <StatHelpText>This month</StatHelpText>
                </Stat>
            </SimpleGrid>

            <TreeVisualization totalSaved={totalSaved} itemsTracked={itemsTracked} />

            <Box mb={6}>
                <Heading size="md" mb={4}>
                    Add New Clothing Item
                </Heading>
                <FootprintForm onSubmit={handleFormSubmit} />
            </Box>

            {carbonScore !== null && (
                <Box mt={6} p={4} bg="gray.50" borderRadius="md">
                    <Text fontSize="lg" fontWeight="semibold">
                        Estimated Carbon Footprint: {carbonScore} kg CO₂
                    </Text>
                </Box>
            )}
        </Box>
    );
}
