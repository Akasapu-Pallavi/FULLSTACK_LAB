const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = 3000;

const bookingsFile = path.join(__dirname, "bookings.json");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// REGISTER
app.post("/register", (req, res) => {

    const newUser = req.body;

    fs.readFile("users.json", "utf8", (error, data) => {

        if (error) {
            return res.status(500).json({
                message: "Unable to read user data"
            });
        }

        const users = JSON.parse(data);

        users.push(newUser);

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            (error) => {

                if (error) {
                    return res.status(500).json({
                        message: "Unable to save user data"
                    });
                }

                res.status(201).json({
                    message: "Registration successful!"
                });
            }
        );
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    fs.readFile("users.json", "utf8", (error, data) => {

        if (error) {
            return res.status(500).json({
                message: "Unable to read user data"
            });
        }

        const users = JSON.parse(data);

        const user = users.find(
            (user) =>
                user.username === username &&
                user.password === password
        );

        if (user) {
            return res.status(200).json({
                message: "Login successful!"
            });
        }

        res.status(401).json({
            message: "Invalid username or password"
        });
    });
});

// BOOKING


// ========================
// BOOKING
// ========================

app.post("/booking", (req, res) => {

    const newBooking = req.body;

    // Create a booking ID
    newBooking.bookingId = "ST" + Date.now();

    fs.readFile(bookingsFile, "utf8", (error, data) => {

        if (error) {
            console.error("Error reading bookings.json:", error);

            return res.status(500).json({
                message: "Unable to read booking data"
            });
        }

        let bookings;

        try {

            bookings = data.trim() === ""
                ? []
                : JSON.parse(data);

        } catch (error) {

            console.error("Invalid JSON in bookings.json:");
            console.error(data);

            return res.status(500).json({
                message: "Invalid booking data"
            });
        }

        // Add new booking
        bookings.push(newBooking);

        fs.writeFile(
            bookingsFile,
            JSON.stringify(bookings, null, 2),
            (error) => {

                if (error) {

                    console.error("Error saving booking:", error);

                    return res.status(500).json({
                        message: "Unable to save booking"
                    });
                }

                console.log("Booking saved:", newBooking);

                res.status(201).json({
                    message: "Booking successful! 🎉",
                    booking: newBooking
                });

            }
        );

    });

});

// START SERVER

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});