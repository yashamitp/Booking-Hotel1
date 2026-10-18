require("dotenv").config();
const mongoose = require("mongoose");
const Hotel = require("./models/hotelModel");
const Room = require("./models/roomModel");

const hotelsData = [
  {
    name: "The Oberoi Amarvilas",
    city: "Agra",
    address: "Taj East Gate Road, Near Taj Mahal, Agra, Uttar Pradesh",
    contact: "+91 562 223 6666",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Premier Room with Taj View",
        pricePerNight: 28500,
        amenities: ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Free Breakfast", "Air Conditioning", "Room Service"],
        totalRooms: 6,
        availableRooms: 5,
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        roomType: "Luxury Suite with Private Balcony",
        pricePerNight: 45000,
        amenities: ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Free Breakfast", "Air Conditioning", "Room Service", "Airport Shuttle"],
        totalRooms: 3,
        availableRooms: 3,
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Taj Exotica Resort & Spa",
    city: "Goa",
    address: "Calwaddo, Benaulim, Salcete, South Goa",
    contact: "+91 832 668 3333",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Deluxe Ocean View Villa",
        pricePerNight: 18500,
        amenities: ["Free WiFi", "Swimming Pool", "Beach Access", "Spa & Wellness", "Free Breakfast", "Bar & Lounge"],
        totalRooms: 8,
        availableRooms: 6,
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Rambagh Palace",
    city: "Jaipur",
    address: "Bhawani Singh Road, Rambagh, Jaipur, Rajasthan",
    contact: "+91 141 221 1919",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Royal Heritage Suite",
        pricePerNight: 32000,
        amenities: ["Free WiFi", "Butler Service", "Swimming Pool", "Spa & Wellness", "Fine Dining", "Air Conditioning"],
        totalRooms: 4,
        availableRooms: 3,
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Burj Al Arab Jumeirah",
    city: "Dubai",
    address: "Jumeirah St - Umm Suqeim 3, Dubai, UAE",
    contact: "+971 4 301 7777",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Duplex Panoramic Suite",
        pricePerNight: 65000,
        amenities: ["Free WiFi", "Infinity Pool", "Private Beach", "Butler Service", "Spa & Wellness", "Helipad Access"],
        totalRooms: 5,
        availableRooms: 4,
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Wildflower Hall, An Oberoi Resort",
    city: "Shimla",
    address: "Chharabra, Shimla, Himachal Pradesh",
    contact: "+91 177 264 8585",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Mountain Valley View Suite",
        pricePerNight: 22000,
        amenities: ["Free WiFi", "Heated Pool", "Mountain View", "Fireplace", "Spa & Wellness", "Free Breakfast"],
        totalRooms: 6,
        availableRooms: 5,
        images: [
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Aman Tokyo",
    city: "Tokyo",
    address: "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda City, Tokyo",
    contact: "+81 3 5224 3333",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Skyline Deluxe Room with Onsen",
        pricePerNight: 48000,
        amenities: ["Free WiFi", "Traditional Onsen", "Skyline View", "Spa & Wellness", "Fine Dining", "Air Conditioning"],
        totalRooms: 6,
        availableRooms: 4,
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Four Seasons Resort Bali",
    city: "Bali",
    address: "Sayan, Ubud, Bali, Indonesia",
    contact: "+62 361 977577",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Riverside Pool Villa",
        pricePerNight: 36000,
        amenities: ["Free WiFi", "Private Plunge Pool", "River View", "Spa & Wellness", "Yoga Pavilion", "Free Breakfast"],
        totalRooms: 5,
        availableRooms: 4,
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "The Plaza Hotel",
    city: "New York",
    address: "Fifth Avenue at Central Park South, New York, NY",
    contact: "+1 212 759 3000",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Central Park View Deluxe",
        pricePerNight: 55000,
        amenities: ["Free WiFi", "Central Park View", "Champagne Bar", "Concierge Service", "Fitness Center", "Room Service"],
        totalRooms: 8,
        availableRooms: 6,
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "Hôtel de Crillon",
    city: "Paris",
    address: "10 Place de la Concorde, 75008 Paris, France",
    contact: "+33 1 44 71 15 00",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Rosewood Palace Suite",
        pricePerNight: 62000,
        amenities: ["Free WiFi", "Eiffel Tower View", "Michelin Dining", "Spa & Wellness", "Butler Service", "Air Conditioning"],
        totalRooms: 4,
        availableRooms: 3,
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    name: "W Maldives",
    city: "Maldives",
    address: "Fesdu Island, North Ari Atoll, Maldives",
    contact: "+960 666 2222",
    ownerId: "admin",
    images: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200&auto=format&fit=crop",
    ],
    rooms: [
      {
        roomType: "Overwater Ocean Oasis with Glass Floor",
        pricePerNight: 78000,
        amenities: ["Free WiFi", "Overwater Villa", "Infinity Plunge Pool", "Direct Reef Access", "Floating Breakfast", "Spa & Wellness"],
        totalRooms: 6,
        availableRooms: 5,
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    let totalHotelsAdded = 0;
    let totalRoomsAdded = 0;

    for (const h of hotelsData) {
      // Check if hotel already exists
      let hotel = await Hotel.findOne({ name: h.name });
      if (!hotel) {
        hotel = await Hotel.create({
          name: h.name,
          city: h.city,
          address: h.address,
          contact: h.contact,
          ownerId: h.ownerId,
          images: h.images,
        });
        totalHotelsAdded++;
        console.log(`Created hotel: ${hotel.name} (${hotel.city})`);
      } else {
        console.log(`Hotel already exists: ${hotel.name}`);
      }

      // Add rooms for this hotel
      for (const r of h.rooms) {
        const existingRoom = await Room.findOne({ hotel: hotel._id, roomType: r.roomType });
        if (!existingRoom) {
          await Room.create({
            hotel: hotel._id,
            roomType: r.roomType,
            pricePerNight: r.pricePerNight,
            amenities: r.amenities,
            images: r.images,
            isAvailable: true,
            totalRooms: r.totalRooms,
            availableRooms: r.availableRooms,
          });
          totalRoomsAdded++;
          console.log(`  Added room: ${r.roomType} (₹${r.pricePerNight}/night)`);
        }
      }
    }

    const finalHotelCount = await Hotel.countDocuments();
    const finalRoomCount = await Room.countDocuments();
    console.log(`\nSeed completed successfully! Total Hotels: ${finalHotelCount}, Total Rooms: ${finalRoomCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();
