import React, { useState } from "react";
import { Box, Input, Button, VStack, FormControl, FormLabel } from "@chakra-ui/react";

export default function AddItemForm({ onAdd }) {
    const [name, setName] = useState("");
    const [carbonSaved, setCarbonSaved] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Send POST request to backend
        fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, carbonSaved }),
        })
            .then((res) => res.json())
            .then((data) => {
                onAdd({ id: Date.now(), name, carbonSaved }); // update frontend UI
                setName("");
                setCarbonSaved("");
            })
            .catch((err) => console.error("Error adding item:", err));
    };

    return (
        <Box maxW="400px" p={4} border="1px solid" borderRadius="md" borderColor="gray.200" mt={6}>
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Item Name</FormLabel>
                        <Input
                            placeholder="e.g. T-shirt"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Carbon Saved (kg CO₂)</FormLabel>
                        <Input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 3.5"
                            value={carbonSaved}
                            onChange={(e) => setCarbonSaved(e.target.value)}
                            required
                        />
                    </FormControl>

                    <Button type="submit" colorScheme="green" width="full">
                        Add Item
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}
