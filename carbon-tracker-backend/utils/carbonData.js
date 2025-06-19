// Approximate carbon emission values (kg CO2e per item)
const carbonEmissionMap = {
    "T-Shirt": {
        cotton: 5.0,
        polyester: 7.5,
        wool: 10.0,
    },
    "Jeans": {
        cotton: 20.0,
        denim: 15.0,
    },
    "Jacket": {
        leather: 50.0,
        polyester: 30.0,
    },
    // Add more items & materials as needed
};

module.exports = carbonEmissionMap;
