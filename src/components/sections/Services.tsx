import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

import { cn } from "@/components/lib/utils";

interface ServiceCardProps {
  icon: React.ReactNode;
  iconAlt: string;
  title: string;
  description: string;
  linkHref: string;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  linkHref,
  className,
}) => {
  return (
    // The main container. It will define the overall size and shape
    // Its actual background will be the SVG.
    // We add flex-col, items-center, justify-between for content alignment
    // We explicitly set a min-height to ensure the card has enough space for content
    <div
      className={cn(
        "relative flex flex-col items-center justify-between p-6 md:p-8 rounded-[3rem]",
        "overflow-hidden", 
        "min-h-[400px] sm:min-h-[450px]",
        className
      )}
    >
      <Image
        width={1000}
        height={1000}
        src="/images/services/services_shape01.svg" 
        alt="Decorative background shape for service card"
        className="absolute inset-0 w-full h-full object-cover z-0 text-white  "
      />

      <div className="relative z-10 mb-4 bg-secondary-100 rounded-full p-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="relative z-10 text-xl md:text-2xl font-bold text-secondary mb-2">
        {title}
      </h3>
      {/* Assuming description text color remains primary (dark blue) */}
      <p className="relative z-10 text-primary text-sm md:text-base mb-6 leading-relaxed whitespace-pre-line">
        {description}
      </p>
      <Link
        href={linkHref}
        className="btn-bubble btn-bubble-secondary !text-secondary hover:!text-white"
      >
        <span>
        <span>See Details</span>
        <MoveRight className="w-5 h-5" />
        </span>
      </Link>
    </div>
  );
};



const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-secondary" // Icon color
        >
          <path d="M12 2a4 4 0 0 0-4 4v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6a4 4 0 0 0-4-4z" />
          <path d="M12 10a10 10 0 0 1 10 10v2h-4v-2a6 6 0 0 0-6-6z" />
          <path d="M12 10a10 10 0 0 0-10 10v2h4v-2a6 6 0 0 1 6-6z" />
          <line x1="12" y1="14" x2="12" y2="22" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
      ),
      iconAlt: "Vet Consultations Icon",
      title: "Vet Consultations",
      description:
        "Book online or in-person appointments with certified veterinarians.\n\nGet expert advice on pet health, diet, and preventive care.",
      linkHref: "#",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-secondary" // Icon color
        >
          <path d="M14 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7.5L14 2z" />
          <path d="M18 13H6" />
          <path d="M12 13v6" />
          <circle cx="10" cy="8" r="2" />
        </svg>
      ),
      iconAlt: "Pet Medicines Icon",
      title: "Pet Medicines",
      description:
        "Access genuine, vet-approved medications and supplements.\n\nFast and safe home delivery with proper guidance.",
      linkHref: "#",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-secondary" // Icon color
        >
          <circle cx="9" cy="9" r="7" />
          <path d="M18 18c-3.1 3.1-8.5 3.1-11.6 0S3.4 9.5 6.5 6.5" />
          <path d="M22 2L16 8" />
          <path d="M18 18L12 12" />
        </svg>
      ),
      iconAlt: "Toys & Accessories Icon",
      title: "Toys & Accessories",
      description:
        "Explore fun, safe, and durable toys for all pet types.\n\nShop grooming kits, leashes, collars, beds, and more.",
      linkHref: "#",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-secondary" // Icon color
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
      iconAlt: "Pet Shops & Products Icon",
      title: "Pet Shops & Products",
      description:
        "Connect with verified local and online pet stores.\n\nEnjoy exclusive deals on food, treats, and essentials.",
      linkHref: "#",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-secondary" // Icon color
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M8.12 8.12l4.76 4.76" />
          <path d="M16 12L7.43 2.57" />
          <path d="M14 18l-6 4-6-4" />
          <path d="M14 18V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v12" />
        </svg>
      ),
      iconAlt: "Grooming & Training Icon",
      title: "Grooming & Training",
      description:
        "Book experienced groomers for regular pet care.\n\nFind certified trainers for behavior and obedience support.",
      linkHref: "#",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-secondary" // Icon color
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
          <path d="M8 18h.01" />
        </svg>
      ),
      iconAlt: "Pet Boarding & Daycare Icon",
      title: "Pet Boarding & Daycare",
      description:
        "Secure short- and long-term boarding options.\n\nDaily care services with a loving and pet-friendly environment.",
      linkHref: "#",
    },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-secondary-50 overflow-hidden">
      {/* Removed the single background image from here */}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 text-center md:text-left">
          <div className="mb-8 md:mb-0">
            <p className="text-secondary font-semibold text-base mb-2 flex items-center justify-center md:justify-start">
              DELIVERING WORLD CLASS HOME CARE <span className="ml-2 text-xl">🐾</span>
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary leading-tight">
              Providing Our Best Pet Care &<br className="hidden md:block" />
              Veterinary Services
            </h2>
          </div>
          <Link
            href="#"
            className="btn-bubble btn-bubble-secondary !text-secondary hover:!text-white"
          >
            <span>
              <span>See All Services</span>
              <MoveRight className="w-5 h-5" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              iconAlt={service.iconAlt}
              title={service.title}
              description={service.description}
              linkHref={service.linkHref}
            />
          ))}
        </div>
      </div>

      {/* Other Background Shapes (these are meant for the overall section background) */}
      <Image
        src="/images/services/services_shape02.png"
        alt="Cat shape"
        width={100}
        height={100}
        className="absolute top-30 right-[40%] hidden lg:block opacity-70"
      />
      <Image
        src="/images/services/services_shape03.png"
        alt="Paw shape"
        width={150}
        height={200}
        className="absolute top-40 right-0 hidden md:block opacity-60"
      />
      <Image
        src="/images/services/services_shape01.png"
        alt="Bone shape"
        width={70}
        height={70}
        className="absolute bottom-10 left-10 hidden lg:block opacity-60"
      />
    </section>
  );
};

export default ServicesSection;