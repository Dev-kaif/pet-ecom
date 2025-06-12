"use client";
import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Calendar, Clock, MoveRight, ChevronDown } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="relative mb-72">
      <div className="relative pt-20 lg:pt-24 xl:pt-30 pb-72 overflow-hidden bg-secondary-50">
        {/* Background paw print 1 (top-left) */}
        <div className="absolute top-8 left-0 z-0 hidden md:block">
          <Image
            src="/images/testimonial/testimonial_shape01.png"
            alt="Paw icon background"
            width={120}
            height={120}
            className="w-50 h-50 "
          />
        </div>
        <div className="absolute bottom-0 left-2 hidden md:block">
          <Image
            src="/images/testimonial/testimonial_shape02.png"
            alt="Paw icon background"
            width={120}
            height={120}
            className="w-26 h-26"
          />
        </div>

        {/* Background paw print 2 (bottom-right) */}
        <div className="absolute bottom-80 right-8 z-0 hidden md:block">
          <Image
            src="/images/testimonial/testimonial_shape03.png"
            alt="Paw icon background"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>

        <div className="container mx-auto px-4 custom-container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            <div className="w-full lg:w-6/12 flex flex-col items-center lg:items-end text-center lg:text-left">
              <div className="w-full max-w-lg">
                <div className="flex justify-center mb-4 relative ">
                  <Image
                    height={100}
                    width={100}
                    className="w-20 h-20"
                    alt="qoute"
                    src={"/images/testimonial/quote.svg"}
                  />
                </div>
                <h3 className="text-3xl lg:text-4xl text-center font-extrabold text-primary mb-4">
                  Pet Health Important
                </h3>
                <p className="text-lg lg:text-xl text-center font-medium text-primary italic leading-relaxed mb-8">
                  &quot;I was genuinely impressed with how they cared for my
                  pet&apos;s health like their own. From diet consultation to
                  grooming tips, everything was so well-explained and
                  personalized. My dog is happier and healthier!&quot;
                </p>
                <div className="flex items-center justify-center space-x-4">
                  {" "}
                  <Image
                    src="/images/testimonial/testiminal.png"
                    alt="Uraney Jacke"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div className="text-left">
                    {" "}
                    {/* Force text left-align within this div */}
                    <h5 className="text-xl font-semibold text-secondary">
                      Ritika Gupta
                    </h5>
                    <span className="text-gray-600 text-sm">
                      Pet Parent, Noida
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-6/12 flex justify-center relative">
              <Image
                src="/images/testimonial/testimonial.webp"
                alt="Happy senior couple with their dog"
                width={1000}
                height={1000}
                className="rounded-full w-[34vw] h-[34vw] z-10"
              />
              {/* Reviews Badge */}
              <div className="absolute top-1/4 left-0 transform translate-x-1/2 -translate-y-1/2 z-30">
                <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white p-2 text-center shadow-xl bg-secondary">
                  <span className="text-2xl font-bold">1500+</span>
                  <div className="flex mt-1">
                    <Star
                      size={16}
                      fill="yellow"
                      stroke="yellow"
                      className="text-yellow-400"
                    />
                    <Star
                      size={16}
                      fill="yellow"
                      stroke="yellow"
                      className="text-yellow-400"
                    />
                    <Star
                      size={16}
                      fill="yellow"
                      stroke="yellow"
                      className="text-yellow-400"
                    />
                    <Star
                      size={16}
                      fill="yellow"
                      stroke="yellow"
                      className="text-yellow-400"
                    />
                    <Star
                      size={16}
                      fill="yellow"
                      stroke="yellow"
                      className="text-yellow-400"
                    />
                  </div>
                  <span className="text-xs mt-1">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute z-30 container mx-auto px-4 custom-container flex justify-center -bottom-[25%] ">
        <div
          className="w-full max-w-7xl p-8 sm:p-12 md:p-16
             bg-primary overflow-hidden shadow-2xl
             rounded-bl-[10rem] rounded-tr-[10rem] rounded-br-[3rem] rounded-tl-[3rem]"
        >
          <h2 className=" z-10 text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-10 sm:mb-12">
            Schedule A Visit Today!
          </h2>

          <form className=" z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Type Full Name"
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-4 rounded-lg text-base outline-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
              />
            </div>

            <div className="">
              <label htmlFor="petType" className="sr-only">
                Pet Type
              </label>
              <select
                id="petType"
                name="petType"
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-4 rounded-lg text-base outline-none appearance-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
              >
                <option value="">Select Pet Type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div className="">
              <label htmlFor="interestIn" className="sr-only">
                Interest In
              </label>
              <select
                id="interestIn"
                name="interestIn"
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-4 rounded-lg text-base outline-none appearance-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
              >
                <option value="">Select Service</option>
                <option value="vaccination">Vaccination</option>
                <option value="checkup">General Checkup</option>
                <option value="grooming">Grooming</option>
                <option value="emergency">Emergency</option>
              </select>
              <ChevronDown
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div className="">
              <label htmlFor="date" className="sr-only">
                Date
              </label>
              <input
                type="text"
                id="date"
                name="date"
                placeholder="dd/mm/yyyy"
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-4 rounded-lg text-base outline-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (
                  (e.target.type = "text"),
                  e.target.value === ""
                    ? (e.target.placeholder = "dd/mm/yyyy")
                    : null
                )}
              />
              <Calendar
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            {/* Input Field: Time */}
            <div className="">
              <label htmlFor="time" className="sr-only">
                Time
              </label>
              <input
                type="text"
                id="time"
                name="time"
                placeholder="08:00 am - 10:00 am"
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-4 rounded-lg text-base outline-none pr-10
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => (
                  (e.target.type = "text"),
                  e.target.value === ""
                    ? (e.target.placeholder = "08:00 am - 10:00 am")
                    : null
                )}
              />
              <Clock
                size={20}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+123 888 ..."
                className="w-full bg-primary-600 border border-white/10 text-white
                   px-5 py-4 rounded-lg text-base outline-none
                   transition-all duration-200
                   focus:border-secondary-400 focus:ring-4 focus:ring-secondary-400/30
                   placeholder-white/50"
              />
            </div>

            <div className="md:col-span-3 flex justify-center mt-6 sm:mt-8">
              <button type="submit" className="btn-bubble btn-bubble-four">
                <span>
                  <span>Start A Reservation</span>
                  <MoveRight size={20} />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;