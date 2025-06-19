import React, { useState } from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    VStack,
} from "@chakra-ui/react";

const FootprintForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        material: "",
        brand: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Callback to Dashboard
        setFormData({ name: "", type: "", material: "", brand: "" }); // Clear form
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Winter Jacket"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select name="type" value={formData.type} onChange={handleChange}>
                        <option value="">Select type</option>
                        <option value="shirt">Shirt</option>
                        <option value="jacket">Jacket</option>
                        <option value="jeans">Jeans</option>
                        <option value="dress">Dress</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Material</FormLabel>
                    <Input
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="e.g., Cotton, Polyester"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Brand</FormLabel>
                    <Input
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g., H&M, Zara"
                    />
                </FormControl>

                <Button colorScheme="green" type="submit">
                    Add Item
                </Button>
            </VStack>
        </Box>
    );
};

export default FootprintForm;
