// src/api/climatiq.js

const CLIMATIQ_API_KEY = process.env.REACT_APP_CLIMATIQ_API_KEY;

export async function fetchClothingCarbonEmissions({ item, weight }) {
    const url = "https://beta4.api.climatiq.io/estimate";

    const payload = {
        emission_factor: {
            activity_id: "consumer_goods-type_clothing", // Example ID, can be more specific
        },
        parameters: {
            weight: weight, // in kilograms
            weight_unit: "kg",
        },
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.co2e; // CO2 equivalent in kg
    } catch (error) {
        console.error("Climatiq API Error:", error);
        return null;
    }
}
