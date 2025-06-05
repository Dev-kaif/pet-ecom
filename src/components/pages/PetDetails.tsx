"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-md">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Pet Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-lg focus:outline-none hover:bg-opacity-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-lg focus:outline-none hover:bg-opacity-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

interface PetCardProps {
  image: string;
  name: string;
  gender: string;
  breed: string;
  location: string;
}

const PetCard: React.FC<PetCardProps> = ({
  image,
  name,
  gender,
  breed,
  location,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md p-4 flex-shrink-0 w-64 cursor-pointer"
    >
      <div className="relative mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded-md"
        />
        <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-primary">• Gender:</span> {gender}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-primary">• Breed:</span> {breed}
      </p>
      <p className="text-sm text-gray-600">
        <span className="font-medium text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 inline-block mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
        {location}
      </p>
    </motion.div>
  );
};

// Dummy data for demonstration
const petData = {
  id: "1",
  name: "The Adult Brown Tabby Cat",
  price: "$257.00",
  availableDate: "09, Sep 2023",
  breed: "Shih Tzu", // Mismatched with image, but using as per user provided text
  color: "Brown/white",
  gender: "Male",
  weight: "9-12lbs",
  puppyId: "6191-EP",
  dateOfBirth: "09, Jul 2023",
  images: [
    "/images/tabby_cat_1.jpg", // Placeholder, replace with actual paths
    "/images/tabby_cat_2.jpg",
    "/images/tabby_cat_3.jpg",
    "/images/tabby_cat_4.jpg",
  ],
  description:
    "When an unknown printer took a galley offer type anawaard scramyear make a type specimen. It has survived not centurieswhen an unknown printer took a galley of type and scrambled.",
  additionalInfo: [
    "6 Month Health Insurance",
    "Vaccine Completed",
    "100% Coverage",
    "24/7 emergency assistance",
    "Health Record Profile",
    "NYC sales tax",
  ],
  mapLocation: {
    address: "Barclays Center, 620 Atlantic Ave, Brooklyn, NY 11217",
    coords: { lat: 40.682662, lng: -73.974913 },
    link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.16870020476!2d-73.97758712395568!3d40.6826619713979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25bb38f29d2f1%3A0xb24683515320078!2sBarclays%20Center!5e0!3m2!1sen!2sin!4v1717502758170!5m2!1sen!2sin", // Example embed link
  },
};

const suggestedPets = [
  {
    image: "/images/french_bulldog.jpg",
    name: "Cute French Bulldog",
    gender: "Male",
    breed: "French",
    location: "Bakersfield, California",
  },
  {
    image: "/images/purebred_cat.jpg",
    name: "purebred pussycat",
    gender: "Female",
    breed: "Germany",
    location: "Central Park, New York",
  },
  {
    image: "/images/italian_rabbit.jpg",
    name: "Italian Rabbit",
    gender: "Male",
    breed: "Italy",
    location: "Birmingham, Alabama",
  },
  {
    image: "/images/macaw_russian.jpg",
    name: "Macaw Russian",
    gender: "Male",
    breed: "Canada",
    location: "Anchorage, Alaska",
  },
];

const PetDetailPage: React.FC = () => {
  // const router = useRouter();
  // const { id } = router.query;

  // In a real application, you'd fetch pet data based on `id`
  const pet = petData; // Using dummy data for now

  return (
    <section className="px-32 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column: Image Slider, Description, Additional Info */}
        <div className="lg:col-span-2">
          <ImageSlider images={pet.images} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{pet.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              More Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              {pet.additionalInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className="flex items-center text-gray-700"
                >
                  <span className="text-primary mr-2 text-lg">
                    <Check />
                  </span>
                  {info}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Price & Details, Add to Cart, Share, Map */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {pet.name}
            </h2>
            <p className="text-primary text-3xl font-bold mb-4">{pet.price}</p>

            <div className="grid grid-cols-1 gap-y-2 text-gray-700 mb-6">
              <p>
                <span className="font-semibold">Available Date:</span>{" "}
                {pet.availableDate}
              </p>
              <p>
                <span className="font-semibold">Breed:</span> {pet.breed}
              </p>
              <p>
                <span className="font-semibold">Color:</span> {pet.color}
              </p>
              <p>
                <span className="font-semibold">Gender:</span> {pet.gender}
              </p>
              <p>
                <span className="font-semibold">Weight:</span> {pet.weight}
              </p>
              <p>
                <span className="font-semibold">Puppy ID:</span> {pet.puppyId}
              </p>
              <p>
                <span className="font-semibold">Date of Birth:</span>{" "}
                {pet.dateOfBirth}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-secondary text-white py-3 rounded-md font-semibold text-lg hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Add to Cart
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Share This Post
            </h3>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.58-1.333h2.42v-3h-3.42c-3.411 0-5.58 2.061-5.58 5.667v1.333z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.459 0-6.255 2.796-6.255 6.255 0 .486.056.96.168 1.414-5.209-.262-9.856-2.73-12.96-6.49-.536.924-.844 1.99-.844 3.139 0 2.164 1.166 4.084 2.915 5.207-.857-.025-1.65-.262-2.35-.615v.08c0 3.053 2.169 5.592 5.068 6.182-.529.141-1.083.213-1.65.213-.403 0-.795-.039-1.177-.113.811 2.507 3.161 4.33 5.928 4.381-2.158 1.684-4.887 2.697-7.85 2.697-.512 0-1.02-.03-1.515-.087 2.78 1.791 6.096 2.841 9.697 2.841 11.696 0 18.17-9.096 18.17-17.065 0-.261-.005-.519-.014-.778 1.246-.893 2.339-1.994 3.195-3.238z" />
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-600 hover:text-green-500 transition-colors"
              >
                
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 18v-12l9 6-9 6z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 mt-8"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Map Location
            </h3>
            <div className="relative w-full h-64 rounded-md overflow-hidden mb-4">
              <iframe
                src={pet.mapLocation.link}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className="text-gray-700 mb-2">{pet.mapLocation.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${pet.mapLocation.coords.lat},${pet.mapLocation.coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View larger map
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          You May Also Like
        </h2>
        <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
          {suggestedPets.map((pet, index) => (
            <PetCard key={index} {...pet} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PetDetailPage;
