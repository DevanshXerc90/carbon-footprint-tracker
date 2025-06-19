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
    const [newItem, setNewItem] = useState({ name: "", footprint: "" });
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
                console.log("📄 Fetching wardrobe from:", userDocRef.path);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log("✅ Wardrobe data fetched:", data);
                    setWardrobe(data.wardrobe || []);
                    setTotalFootprint(data.totalCarbonFootprint || 0);
                } else {
                    console.warn("⚠️ No wardrobe document found. Creating new.");
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

    const addItem = async () => {
        if (!newItem.name || !newItem.footprint) {
            toast({
                title: "Please fill in all fields",
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const footprintValue = parseFloat(newItem.footprint);
        if (isNaN(footprintValue) || footprintValue < 0) {
            toast({
                title: "Enter a valid carbon footprint value",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        const updatedWardrobe = [...wardrobe, { ...newItem, footprint: footprintValue }];
        const updatedTotal = totalFootprint + footprintValue;

        setWardrobe(updatedWardrobe);
        setTotalFootprint(updatedTotal);
        setNewItem({ name: "", footprint: "" });

        try {
            const userDocRef = doc(db, "users", user.uid);
            console.log("📤 Adding item to Firestore:", newItem);
            await updateDoc(userDocRef, {
                wardrobe: updatedWardrobe,
                totalCarbonFootprint: updatedTotal,
            });
            console.log("✅ Item added successfully.");
            toast({
                title: "Item added",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error("❌ Failed to add item:", error.message);
            toast({
                title: "Failed to add item",
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
            console.log("🗑️ Deleting item:", itemToRemove);
            await updateDoc(userDocRef, {
                wardrobe: updatedWardrobe,
                totalCarbonFootprint: updatedTotal,
            });
            console.log("✅ Item removed successfully.");
            toast({
                title: "Item removed",
                status: "info",
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error("❌ Failed to remove item:", error.message);
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
                    placeholder="Carbon footprint (kg CO2e)"
                    value={newItem.footprint}
                    type="number"
                    onChange={(e) => setNewItem({ ...newItem, footprint: e.target.value })}
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
