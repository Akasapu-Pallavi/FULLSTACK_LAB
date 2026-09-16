// ========================
// REGISTER
// ========================
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const userData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            address: document.getElementById("address").value
        };

        try {

            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            document.getElementById("message").textContent = result.message;

            if (response.ok) {
                registerForm.reset();
            }

        } catch (error) {

            document.getElementById("message").textContent =
                "Something went wrong. Please try again.";

            console.error(error);
        }
    });
}

// ========================
// LOGIN
// ========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const loginData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            document.getElementById("loginMessage").textContent =
                result.message;

            if (response.ok) {
                window.location.href = "dashboard.html";
            }

        } catch (error) {
            document.getElementById("loginMessage").textContent =
                "Something went wrong. Please try again.";

            console.error(error);
        }
    });
}

// ========================
// BOOKING
// ========================

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    console.log("Booking script loaded successfully");

    // ========================
    // SEAT SELECTION
    // ========================

    const seats = document.querySelectorAll(".seat");

    let selectedSeats = [];

    seats.forEach(function (seat) {

        seat.addEventListener("click", function () {

            const tickets =
                parseInt(document.getElementById("tickets").value);

            // Check whether number of tickets is entered
            if (!tickets || tickets < 1) {

                alert("Please enter the number of tickets first.");

                return;
            }

            const seatNumber = seat.dataset.seat;

            // If seat is already selected, unselect it
            if (seat.classList.contains("selected")) {

                seat.classList.remove("selected");

                selectedSeats = selectedSeats.filter(function (selectedSeat) {

                    return selectedSeat !== seatNumber;

                });

            }

            // If seat is not selected, select it
            else {

                // Don't allow more seats than tickets
                if (selectedSeats.length >= tickets) {

                    alert(
                        "You can select only " +
                        tickets +
                        " seats."
                    );

                    return;
                }

                seat.classList.add("selected");

                selectedSeats.push(seatNumber);
            }

            // Display selected seats
            document.getElementById("selectedSeatsMessage").textContent =
                "Selected Seats: " +
                (
                    selectedSeats.length > 0
                        ? selectedSeats.join(", ")
                        : "None"
                );

        });

    });


    // ========================
    // BOOKING FORM SUBMIT
    // ========================

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const tickets =
            parseInt(document.getElementById("tickets").value);

        const bookingData = {

            movie: document.getElementById("movie").value,

            date: document.getElementById("date").value,

            time: document.getElementById("time").value,

            tickets: tickets,

            seat: selectedSeats.join(", ")

        };


        // Make sure correct number of seats are selected
        if (selectedSeats.length !== tickets) {

            document.getElementById("bookingMessage").textContent =
                "Please select exactly " +
                tickets +
                " seats.";

            return;
        }


        console.log("Sending booking:", bookingData);


        try {

            const response = await fetch("/booking", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookingData)

            });


            const result = await response.json();


            console.log("Server response:", result);


            if (response.ok) {

                if (result.booking) {

                    localStorage.setItem(
                        "booking",
                        JSON.stringify(result.booking)
                    );


                    console.log(
                        "Booking saved in localStorage"
                    );


                    window.location.href =
                        "confirmation.html";

                }

                else {

                    document.getElementById(
                        "bookingMessage"
                    ).textContent =
                        "Booking saved, but booking details were not received.";

                    console.error(
                        "result.booking is missing:",
                        result
                    );

                }

            }

            else {

                document.getElementById(
                    "bookingMessage"
                ).textContent =
                    result.message ||
                    "Booking failed.";

            }

        }

        catch (error) {

            document.getElementById(
                "bookingMessage"
            ).textContent =
                "Something went wrong. Please try again.";

            console.error(
                "Booking error:",
                error
            );

        }

    });

}


// ========================
// CONFIRMATION PAGE
// ========================

const bookingIdElement =
    document.getElementById("bookingId");

if (bookingIdElement) {

    const savedBooking =
        localStorage.getItem("booking");

    if (savedBooking) {

        try {

            const bookingData =
                JSON.parse(savedBooking);

            document.getElementById("bookingId").textContent =
                bookingData.bookingId;

            document.getElementById("movie").textContent =
                bookingData.movie;

            document.getElementById("date").textContent =
                bookingData.date;

            document.getElementById("time").textContent =
                bookingData.time;

            document.getElementById("tickets").textContent =
                bookingData.tickets;

            document.getElementById("seat").textContent =
                bookingData.seat;

        } catch (error) {

            console.error(
                "Unable to read booking details:",
                error
            );

        }

    }

}

// ========================
// LOGOUT
// ========================

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {

    logoutLink.addEventListener("click", function (event) {

        event.preventDefault();

        // Remove saved booking information
        localStorage.removeItem("booking");

        // Go back to login page
        window.location.href = "login.html";
    });
}