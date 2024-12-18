const validateOrderInput = (req, res, next) => {
    const { name, address, city, postalCode, country } = req.body;
    if (!name || !address || !city || !postalCode || !country) {
        return res.status(400).send("All fields are required");
    }
    next();
};

router.post("/place-order", validateOrderInput, async (req, res) => {
    // Rest of the code...
});
