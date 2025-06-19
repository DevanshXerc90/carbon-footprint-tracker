const express = require("express");
const router = express.Router();
const User = require("../models/User");
const carbonEmissionMap = require("../utils/carbonData");


// POST /api/users/:username/add-item
router.post("/:username/add-item", async (req, res) => {
    try {
        const { username } = req.params;
        const { itemType, material, quantity } = req.body;



        console.log("itemType:", itemType);
        console.log("material:", material);
        console.log("carbonEmissionMap keys:", Object.keys(carbonEmissionMap));

        if (!itemType || !material || !quantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const itemTypeMap = carbonEmissionMap[itemType];

        if (!itemTypeMap) {
            return res.status(400).json({ error: `Unknown itemType: ${itemType}` });
        }

        const emissionFactor = itemTypeMap[material.toLowerCase()];
        if (!emissionFactor) {
            return res.status(400).json({ error: `Unknown material: ${material}` });
        }


        console.log("Received:", { itemType, material });
        console.log("Lookup:", {
            itemTypeLower: itemType.toLowerCase(),
            materialLower: material.toLowerCase(),
            emissionFactor,
        });
        if (!emissionFactor) {
            console.log("Unknown material:", material);
            return res.status(400).json({ error: `Unknown material: ${material}` });
        }

        const carbonFootprint = emissionFactor * quantity;

        let user = await User.findOne({ username });

        if (!user) {
            user = new User({ username, wardrobe: [] });
        }

        user.wardrobe.push({
            itemType,
            material,
            quantity,
            carbonFootprint,
        });

        await user.save();

        res.status(200).json({ message: "Item added", user });
    } catch (err) {
        console.error("ERROR in POST /add-item:", err);  // 🔥 Log the full error
        res.status(500).json({ error: "Server error" });
    }
});

// GET /api/users/:username/total-carbon
router.get("/:username/total-carbon", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalCarbon = user.wardrobe.reduce(
            (sum, item) => sum + (item.carbonFootprint || 0),
            0
        );

        res.json({ totalCarbon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
