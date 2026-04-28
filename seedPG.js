const mongoose = require("mongoose");
const PG = require("./models/PG");

mongoose.connect("mongodb://127.0.0.1:27017/staymatch")
.then(async () => {

    console.log("Mongo Connected");

    await PG.deleteMany(); // optional: clear old data

    await PG.insertMany([
        {
            name: "Sunshine PG",
            city: "Dehradun",
            location: "Rajpur Road",
            price: 8000,
            contact: "9876543210",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            rating: 4.2,
            bookings: 3
        },
        {
            name: "Elite Boys Hostel",
            city: "Delhi",
            location: "North Campus",
            price: 12000,
            contact: "9123456780",
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
            rating: 4.5,
            bookings: 5
        },
        {
            name: "GreenView PG",
            city: "Pune",
            location: "Wakad",
            price: 7000,
            contact: "9988776655",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            rating: 3.9,
            bookings: 2
        },
        {
            name: "Urban Nest PG",
            city: "Bangalore",
            location: "Whitefield",
            price: 9500,
            contact: "9012345678",
            image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            rating: 4.3,
            bookings: 4
        },
        {
            name: "Comfort Stay Hostel",
            city: "Mumbai",
            location: "Andheri",
            price: 11000,
            contact: "8899776655",
            image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
            rating: 4.1,
            bookings: 6
        }
    ]);

    console.log("Dummy PG Data Inserted ✅");

    process.exit();

})
.catch(err => console.log(err));