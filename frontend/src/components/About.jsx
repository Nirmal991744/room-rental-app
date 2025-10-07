import React from "react";

function About() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        About Room Rental System
      </h1>

      <div className="max-w-3xl text-gray-700 text-lg leading-relaxed text-center">
        <p className="mb-4">
          The{" "}
          <span className="font-semibold text-blue-600">
            Room Rental System
          </span>{" "}
          is a platform designed to simplify the process of finding and managing
          rental rooms. It connects
          <span className="font-medium"> owners </span> who have available rooms
          with
          <span className="font-medium"> seekers </span> looking for comfortable
          accommodation.
        </p>

        <p className="mb-4">
          Owners can easily post room details, including location, rent, and
          images, while seekers can browse and book rooms that best suit their
          needs. The system ensures a smooth and transparent experience for both
          parties.
        </p>

        <h2 className="text-2xl font-semibold text-blue-700 mt-6 mb-3">
          Key Features
        </h2>
        <ul className="text-left list-disc list-inside space-y-2">
          <li>🔑 Secure login and registration for owners and seekers</li>
          <li>🏠 Easy room posting with images and location details</li>
          <li>📍 Location-based room search and filtering</li>
          <li>💬 Seamless communication between owners and seekers</li>
          <li>📱 Fully responsive design for mobile and desktop users</li>
        </ul>

        <p className="mt-8 text-gray-600 italic">
          Our mission is to make finding and renting rooms easier, faster, and
          more reliable for everyone.
        </p>
      </div>
    </div>
  );
}

export default About;
