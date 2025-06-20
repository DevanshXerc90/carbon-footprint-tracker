import { useEffect, useState } from "react";
import {
    Box,
    Heading,
    VStack,
    Input,
    Button,
    Text,
    HStack,
    useToast,
    Divider,
    IconButton,
    Flex,
} from "@chakra-ui/react";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { DeleteIcon } from "@chakra-ui/icons";

const Wardrobe = () => {
    const [wardrobe, setWardrobe] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", weight: "" });
    const [totalFootprint, setTotalFootprint] = useState(0);
    const toast = useToast();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            console.log("👤 No user found. Waiting for auth...");
            return;
        }

        const fetchWardrobe = async () => {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setWardrobe(data.wardrobe || []);
                    setTotalFootprint(data.totalCarbonFootprint || 0);
                } else {
                    await setDoc(userDocRef, {
                        wardrobe: [],
                        totalCarbonFootprint: 0,
                    });
                }
            } catch (err) {
                console.error("❌ Firestore fetch error:", err.message);
            }
        };

        fetchWardrobe();
    }, [user]);

    const fetchClothingCarbonEmissions = async (weightKg) => {
        const apiKey = process.env.REACT_APP_CLIMATIQ_API_KEY;
        if (!apiKey) {
            console.error("❌ Missing API key.");
            return null;
        }

        const payload = {
            emission_factor: {
                activity_id: "consumer_goods-type_clothing_general",
            },
            parameters: {
                weight: Number(weightKg),
                weight_unit: "kg",
            },
        };

        try {
            const response = await fetch("https://beta4.api.climatiq.io/estimate", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "API call failed");
            }

            return data.co2e;
        } catch (err) {
            console.error("❌ Climatiq API error:", err.message);
            return null;
        }
    };

    const addItem = async () => {
        if (!newItem.name || !newItem.weight) {
            toast({
                title: "Please fill in all fields",
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const weightValue = parseFloat(newItem.weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            toast({
                title: "Enter a valid weight in kg",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const footprint = await fetchClothingCarbonEmissions(weightValue);
        if (footprint === null) {
            toast({
                title: "Failed to calculate footprint",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const item = { name: newItem.name, weight: weightValue, footprint };
        const updatedWardrobe = [...wardrobe, item];
        const updatedTotal = totalFootprint + footprint;

        setWardrobe(updatedWardrobe);
        setTotalFootprint(updatedTotal);
        setNewItem({ name: "", weight: "" });

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                wardrobe: updatedWardrobe,
                totalCarbonFootprint: updatedTotal,
            });
            toast({
                title: "Item added",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error("❌ Firestore update error:", error.message);
            toast({
                title: "Failed to save item",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const deleteItem = async (index) => {
        const itemToRemove = wardrobe[index];
        const updatedWardrobe = wardrobe.filter((_, i) => i !== index);
        const updatedTotal = totalFootprint - itemToRemove.footprint;

        setWardrobe(updatedWardrobe);
        setTotalFootprint(updatedTotal);

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                wardrobe: updatedWardrobe,
                totalCarbonFootprint: updatedTotal,
            });
            toast({
                title: "Item removed",
                status: "info",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to remove item",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box maxW="600px" mx="auto" p={6}>
            <Heading mb={6} textAlign="center">Your Wardrobe</Heading>

            <VStack spacing={4} mb={6}>
                <Input
                    placeholder="Clothing item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <Input
                    placeholder="Weight (in kg)"
                    value={newItem.weight}
                    type="number"
                    onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                />
                <Button colorScheme="teal" onClick={addItem} w="full">
                    Add Item
                </Button>
            </VStack>

            <Divider />

            <VStack spacing={3} mt={6} align="stretch">
                {wardrobe.length === 0 && <Text>No items in your wardrobe yet.</Text>}

                {wardrobe.map((item, idx) => (
                    <Flex
                        key={idx}
                        p={3}
                        bg="gray.100"
                        borderRadius="md"
                        justify="space-between"
                        align="center"
                    >
                        <Text fontWeight="semibold">{item.name}</Text>
                        <HStack spacing={4}>
                            <Text>{item.footprint.toFixed(2)} kg CO2e</Text>
                            <IconButton
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                aria-label="Delete item"
                                size="sm"
                                onClick={() => deleteItem(idx)}
                            />
                        </HStack>
                    </Flex>
                ))}
            </VStack>

            <Box mt={6} textAlign="center">
                <Text fontSize="lg" fontWeight="bold">
                    Total Carbon Footprint: {totalFootprint.toFixed(2)} kg CO2e
                </Text>
            </Box>
        </Box>
    );
};

export default Wardrobe;
