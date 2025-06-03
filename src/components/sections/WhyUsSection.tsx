import React from "react";
import Image from "next/image";


const WhyUsSection = () => {
  // Using your provided colors for context: secondary: #904c8c, primary: #08246c

  const features = [
    {
      title: "All-in-One Platform",
      description:
        "Shop, book, consult, and connect — everything you need, in one place.",
    },
    {
      title: "Verified Vets & Trusted Shops",
      description:
        "Only certified veterinarians and handpicked pet stores make it to our platform.",
    },
    {
      title: "Fast & Reliable Service",
      description:
        "From doorstep deliveries to instant appointment bookings — we value your time.",
    },
    {
      title: "Built for Every Pet",
      description:
        "Whether you have a dog, cat, bird, or bunny — we cater to all kinds of pets.",
    },
    {
      title: "Support for Pet Businesses",
      description:
        "We help groomers, vets, and pet shops grow online with powerful tools and visibility.",
    },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          <div className="relative w-full lg:w-1/2 flex justify-center items-center p-8 lg:p-0">
            <Image
              src="/images/whyUs/why_we_are_img.png" 
              alt="Decorative background shape"
              width={600}
              height={600}
              className="absolute inset-0 w-full h-full object-contain" 
            />
            {/* place holder for dog */}
            <Image
              src="/images/sections/about/dog.png" // Placeholder path for the dog image
              alt="A Bernese Mountain Dog wearing a crown"
              width={450} // Adjust these based on the actual image size and desired display
              height={450} // Adjust these based on the actual image size and desired display
              className="relative z-10 max-w-full h-auto rounded-full object-cover" // Ensure it's responsive and covers
            />

            <Image
              src="/images/whyUs/why_shape01.svg" 
              alt="Crown"
              width={150}
              height={150}
              className="absolute z-20 top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 transform" // Adjust for crown position
              style={{ color: "#904c8c" }} // Apply secondary color (if SVG supports currentColor)
            />
            <Image
             src="/images/whyUs/why_shape02.svg"  // Placeholder path
              alt="Bone"
              width={100}
              height={100}
              className="absolute z-20 bottom-1/4 left-0 -translate-x-1/3" // Adjust for bone position
            />
            <Image
              src="/images/whyUs/why_shape03.svg"  // Placeholder path
              alt="Food Bowl"
              width={120}
              height={120}
              className="absolute z-20 bottom-0 right-1/4 translate-x-1/2 translate-y-1/3" // Adjust for bowl position
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <p className="text-secondary font-semibold text-base mb-2 flex items-center justify-center lg:justify-start gap-2">
              <span>WHY PET PARENTS & BUSINESSES TRUST US </span>
              <Image
                width={100}
                height={100}
                className="w-4 h-4 text-secondary flex-shrink-0 mb-2 "
                src="/images/icon/why_icon01.svg"
                alt="check"
              />
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary leading-tight mb-8">
              We’re not just another pet website — we’re your pet’s digital
              companion.
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start text-left">
                  <Image
                    width={100}
                    height={100}
                    className="w-6 h-6 text-secondary flex-shrink-0 mr-3 mt-1"
                    src="/images/icon/check_icon.svg"
                    alt="check"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-secondary mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-primary-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
