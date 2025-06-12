import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { NumberTicker } from "../ui/NumberTicker";
import Team from "../sections/Team";
import { ShieldCheck, HeartHandshake, ShoppingCart, Users, Sparkles } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 md:p-8 rounded-[3rem] text-center min-h-[400px] sm:min-h-[450px]">
      <Image
        width={1000}
        height={1000}
        src="/images/services/services_shape01.svg"
        alt="Decorative background shape for service card"
        className="absolute inset-0 w-full h-full object-fill z-0"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="mb-6 flex items-center justify-center p-4 rounded-full"
          style={{ backgroundColor: "#f2e8f7" }}
        >
          {icon}
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-primary mb-3">
          {title}
        </h3>

        <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line px-2">
          {description}
        </p>
      </div>
    </div>
  );
};

// Define the type for a single counter item
interface CounterData {
  value: number;
  label: string;
}

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-secondary" strokeWidth={1.5} />,
      title: "Trust & Transparency",
      description:
        "We partner only with certified vets and verified pet businesses to ensure your pet’s safety and well-being.",
    },
    {
      icon: <HeartHandshake className="w-12 h-12 text-secondary" strokeWidth={1.5} />,
      title: "Compassion",
      description:
        "We believe every pet deserves love, care, and respect. Our platform reflects this commitment in every interaction.",
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-secondary" strokeWidth={1.5} />,
      title: "Convenience",
      description:
        "Simplifying pet care by bringing products and services together in one easy-to-use platform.",
    },
    {
      icon: <Users className="w-12 h-12 text-secondary" strokeWidth={1.5} />,
      title: "Community",
      description:
        "Building strong connections between pet owners and service providers to support pets’ health and happiness.",
    },
    {
      icon: <Sparkles className="w-12 h-12 text-secondary" strokeWidth={1.5} />,
      title: "Innovation",
      description:
        "Continuously improving our platform with the latest technology to serve pets and their parents better.",
    },
  ];

  const counters: CounterData[] = [
    { value: 5985, label: "Happy Family" },
    { value: 1322, label: "New Listed States" },
    { value: 3102, label: "Core Breeding" },
    { value: 1125, label: "Annual Awards" },
  ];

  return (
    <div className="min-h-screen">
      {/* into section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 bg-white rounded-lg p-8 md:p-12">
          {/* Left Image Section */}
          <div className="lg:w-1/2 relative flex justify-center items-center">
            {/* Main Image */}
            <div className="w-[25vw] h-[35vw] lg:max-w-full relative overflow-hidden">
              <Image
                src="/pages/about/women_dog.webp"
                alt="Woman holding a dog"
                width={500}
                height={500}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            {/* Overlay Image (Dog and Cat) */}
            <div className="absolute bottom-4 right-4 sm:bottom-50 sm:right-0 w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-lg shadow-lg overflow-hidden border-4 border-white">
              <Image
                src="/pages/about/cat_dog.webp"
                alt="Cat and dog"
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right Content Section */}
          <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
            <h4 className="text-secondary font-semibold text-base uppercase tracking-wider mb-2">
              ABOUT US
            </h4>
            <h2 className="text-4xl font-bold text-primary leading-tight mb-6">
              We&apos;ll Make Your Pets <br /> Really Happy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are a comprehensive pet care platform dedicated to connecting
              pet owners with trusted veterinarians, reliable pet shops, and
              expert service providers. Our mission is to simplify pet parenting
              by offering a convenient, all-in-one portal where you can find
              everything your pet needs — from medicines and toys to grooming
              and health consultations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-primary">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  15<span className="text-xs">Yr</span>
                </div>
                <span className="text-lg font-semibold">Experience</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-800">
                  <CheckCircle
                    size={20}
                    className="text-secondary flex-shrink-0"
                  />
                  <span>Over 10 years of experience</span>
                </li>
                <li className="flex items-center gap-2 text-gray-800">
                  <CheckCircle
                    size={20}
                    className="text-secondary flex-shrink-0"
                  />
                  <span>20 talented vets ready to help you</span>
                </li>
                <li className="flex items-center gap-2 text-gray-800">
                  <CheckCircle
                    size={20}
                    className="text-secondary flex-shrink-0"
                  />
                  <span>High-quality products only</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              Our mission is to make pet care accessible, reliable, and
              enjoyable for every pet owner. We strive to create a trustworthy
              platform where quality products and professional services come
              together to support the health and happiness of pets everywhere.
              By empowering pet businesses with digital tools and a wider
              audience, we aim to build a vibrant pet care community.
            </p>

            {/* <div className="text-center lg:text-left">
              <button className="btn-bubble btn-bubble-primary inline-flex items-center">
                <span>
                  <span className="text-sm">Read More</span>
                  <MoveRight />
                </span>
              </button>
            </div> */}
          </div>
        </div>
      </div>
      {/* why us section */}
      <div className="relative py-20 bg-secondary-50 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center ">
            <p className="text-secondary font-semibold text-base mb-2 flex items-center justify-center gap-2">
              WHY WE ARE THE BEST{" "}
              <Image
                width={100}
                height={100}
                className="w-3 h-3 text-secondary flex-shrink-0 mb-2 "
                src="/images/icon/why_icon01.svg"
                alt="check"
              />
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary leading-tight">
              See How Petpal Can Help
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              We envision a world where every pet receives the best care
              possible — easily and conveniently. By bridging the gap between
              pet owners and trusted service providers, we aim to become the
              leading pet care platform that nurtures happy, healthy pets and
              strengthens the bond between pets and their families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
      {/* conunter */}
      <div className="bg-primary py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {counters.map((counter, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center p-4 text-center"
              >
                <Image
                  src="/pages/about/h2_counter_shape.png"
                  alt="Paw print background"
                  width={150}
                  height={150}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                <span className="relative z-10 text-6xl font-extrabold text-white mb-2 leading-none">
                  <NumberTicker value={counter.value} delay={0.2} />{" "}
                </span>

                <p className="relative z-10 text-white text-lg uppercase font-semibold tracking-wide">
                  {counter.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* team */}
      <Team />
    </div>
  );
};

export default AboutPage;
