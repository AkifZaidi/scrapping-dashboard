require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const userModel = require("./models/user");
const carModel = require("./models/scrapper");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["https://scrapping-dashboard-llc7.vercel.app"], 
    // origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());


app.use(cookieParser());


mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));


// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Office Dashboard API!");
});

app.post('/register', async function (req, res) {
    const { name, email, password } = req.body;
    console.log(req.body, "user created in console");

    let AuthenticateUser = await userModel.findOne({ email });

    if (AuthenticateUser) {
        return res.send("User already exists");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        console.log(user);

        var token = jwt.sign({ email, userId: user._id }, 'dashBoard@');
        // res.cookie("token", token);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: "Error creating user" });
    }
});

app.post("/user", async (req, res) => {
    let User = await userModel.find();
    console.log(User);
    res.json(User);
});

app.get("/user/profile", IsLoggedIn, async (req, res) => {
    try {
        const userId = req.user.userId; // Extract userId from the JWT payload
        const user = await userModel.findById(userId).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email === "QHH@gmail.com" && password === "QHH@") {
        const token = jwt.sign({ email, role: 'admin' }, 'dashBoard@');
        res.cookie("token", token);
        return res.send({ role: 'admin', token });
    }

    let loginUser = await userModel.findOne({ email });
    if (!loginUser) {
        return res.status(403).send({ role: 'unauthorized', message: "Unauthorized access" });
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);
    if (isMatch) {
        const token = jwt.sign({ email, userId: loginUser._id }, 'dashBoard@', { expiresIn: '1h' });
        // res.cookie("token", token);
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });
        return res.send({ role: 'user' });
    } else {
        return res.status(403).send({ role: 'unauthorized', message: "Unauthorized access" });
    }
});

app.post('/scrape', async (req, res) => {
    try {
        const { number, carName, location, price } = req.body;
        if (!number && !carName && !location && !price) {
            return res.status(400).json({ message: "Input is required" });
        }
        const newCar = new carModel({ carName, number, location, price });
        await newCar.save();
        console.log(`Received data: ${newCar}`);
        res.status(201).json({ message: 'Car details saved successfully!', newCar });
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get('/cars', async (req, res) => {
    try {
        const cars = await carModel.find();
        console.log("Cars:", cars);
        const uniqueCars = [];
        const duplicateCars = [];
        const numberMap = new Map();

        cars.forEach(car => {
            if (numberMap.has(car.number)) {
                duplicateCars.push(car);
            } else {
                numberMap.set(car.number, true);
                uniqueCars.push(car);
            }
        });

        res.json({ uniqueCars, duplicateCars });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars data' });
    }
});

app.get('/selectedCars', async (req, res) => {
    try {
        const selectedCars = JSON.parse(req.query.selectedCars || '[]');
        console.log("Selected Cars:", selectedCars);
        
        const cars = await carModel.find({ _id: { $in: selectedCars } });
        console.log("Selected Cars:", cars);
        
        res.json({ selectedCarsData: cars });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars data' });
    }
})

app.post('/upload', async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({ message: "Invalid data format" });
    }

    try {
        const operations = data.map(car => ({
            updateOne: {
                filter: { number: car.number }, // Match based on car number
                update: { $set: car },          // Update existing or insert new
                upsert: true                    // Insert if not found
            }
        }));

        await carModel.bulkWrite(operations);

        res.status(200).json({
            message: "Cars inserted/updated successfully.",
            savedCount: data.length,
        });
    } catch (error) {
        console.error("Error saving cars:", error);
        res.status(500).json({ message: "Failed to save car data." });
    }
});

app.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        const result = await userModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

cron.schedule('0 * * * *', async () => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    try {
        await carModel.deleteMany({ createdAt: { $lte: twelveHoursAgo } });
        await localStorage.removeItem("cars");
        await localStorage.removeItem("selectedCars");
        console.log('Deleted cars older than 12 hours');
    } catch (error) {
        console.error('Error deleting old car data:', error);
    }
});

async function IsLoggedIn(req, res, next) {
    console.log("Cookies:", req.cookies); // Log cookies
    if (!req.cookies.token) {
        return res.send("Something Went Wrong: No token provided");
    }
    try {
        const data = jwt.verify(req.cookies.token, "dashBoard@");
        console.log("Decoded JWT data:", data);
        if (!data.userId) {
            return res.send("Invalid token: No userId in token");
        }
        req.user = data;
        next();
    } catch (err) {
        return res.status(403).send("Invalid token");
    }
}

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});