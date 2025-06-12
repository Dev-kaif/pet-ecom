"use client";
import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { motion } from "motion/react";

// Import dynamic for lazy loading SVGs/Images
import dynamic from "next/dynamic";

interface DynamicImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

const createDynamicImage = (
  imageProps: Omit<DynamicImageProps, "children">,
  displayName: string
) => {
  // This is the component that next/dynamic will actually import and render
  const DynamicImportedImage = dynamic(
    () =>
      import("next/image").then(({ default: ImageComponent }) => {
        const DynamicImageWrapper = (
          props: React.ComponentProps<typeof ImageComponent>
        ) => <ImageComponent {...props} />;
        DynamicImageWrapper.displayName = `${displayName}Wrapper`; // Give the inner component a name
        return DynamicImageWrapper;
      }),
    { ssr: false, loading: () => null }
  );

  // This is the component that createDynamicImage returns and is used in the JSX
  const OuterDynamicImage = (props: { className?: string }) => (
    <DynamicImportedImage {...imageProps} {...props} />
  );
  OuterDynamicImage.displayName = displayName; // Give the outer component a name

  return OuterDynamicImage;
};

// Now use the utility function for each dynamic image
const DynamicTitleImage = createDynamicImage(
  {
    src: "/images/banner/banner_title_img02.png",
    alt: "Paws icon",
    width: 56,
    height: 56,
    className: "w-14 h-14 filter drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]",
  },
  "DynamicTitleImage"
);

const DynamicShape03 = createDynamicImage(
  {
    src: "/images/banner/banner_shape03.png",
    alt: "Decorative swirl shape",
    width: 72,
    height: 72,
    className: "w-18 h-18",
  },
  "DynamicShape03"
);

const DynamicShape01 = createDynamicImage(
  {
    src: "/images/banner/banner_shape01.png",
    alt: "Decorative abstract shape",
    width: 100,
    height: 100,
  },
  "DynamicShape01"
);

const DynamicShape04 = createDynamicImage(
  {
    src: "/images/banner/banner_shape04.png",
    alt: "Abstract shape",
    width: 96,
    height: 96,
  },
  "DynamicShape04"
);

const DynamicShape02 = createDynamicImage(
  {
    src: "/images/banner/banner_shape02.png",
    alt: "Geometric shape",
    width: 96,
    height: 96,
  },
  "DynamicShape02"
);

export default function Hero() {
  return (
    <section
      style={{ backgroundImage: "url('/images/banner/banner.webp')"  }}
      className="relative overflow-hidden -pt-10 py-20 lg:py-32 xl:py-40 bg-secondary-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-6/12 mb-10 lg:mb-0 text-center lg:text-left">
            <motion.div
              className="banner__content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl lg:text-[3.8vw] font-extrabold leading-16 text-primary mb-6 flex flex-col">
                <span>Everything Your </span>
                <span>Pet Needs</span>
                <div className="flex gap-3">
                  <span> All in One </span>
                  <DynamicTitleImage /> {/* Use the dynamic component */}
                  <span>Place</span>
                </div>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                From vet consultations and medicines and grooming -
                <br className="hidden md:block" />
                Discover a complete care portal built for your pet’s health,
                <br className="hidden md:block" />
                happiness, and lifestyle.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                {/* Main "Shop Now" Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Link href="/shop" className="btn-bubble btn-bubble-primary">
                    <span>
                      <span>Shop Now</span>
                      <MoveRight />
                    </span>
                  </Link>
                </motion.div>

                {/* "Book a Vet" Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link
                    href="/allPets"
                    className="btn-bubble btn-bubble-secondary"
                  >
                    <span>
                      <span>Book a Vet</span>
                      <MoveRight />
                    </span>
                  </Link>
                </motion.div>

                {/* "Join as a Vendor" Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Link
                    href="/contact"
                    className="btn-bubble btn-bubble-tertiary"
                  >
                    <span>
                      <span>Join as a Vendor</span>
                      <MoveRight />
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* banner_shape03.png - Comes from top-right and spins */}
              <motion.div
                className="absolute top-20 left-[55%] transform -translate-x-1/2 hidden lg:block"
                initial={{ opacity: 0, x: 100, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 360 }}
                transition={{
                  duration: 1.5,
                  delay: 0.8,
                  ease: "easeOut",
                  rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                }}
              >
                <DynamicShape03 /> {/* Use the dynamic component */}
              </motion.div>

              {/* banner_shape01.png - Comes from top-left */}
              <motion.div
                initial={{ opacity: 0, y: -50, x: -50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute top-0 left-56"
              >
                <DynamicShape01 /> {/* Use the dynamic component */}
              </motion.div>
            </motion.div>
          </div>

          {/* <div className="w-full lg:w-6/12 flex justify-center lg:justify-end">
            <motion.div
              className="banner__img"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.4 }}
            >
              <Image
                src="/images/banner/banner_img.png"
                alt="Happy dog with pet care products"
                className="max-w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                height={500}
                width={700}
              />
            </motion.div>
          </div> */}
        </div>

        {/* banner_shape04.png - Comes from top */}
        <motion.div
          className="absolute bottom-25 left-[47%] transform -translate-x-1/2 w-24"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <DynamicShape04 /> {/* Use the dynamic component */}
        </motion.div>

        {/* banner_shape02.png - Comes from bottom */}
        <motion.div
          className="absolute bottom-14 left-20 w-24 h-24 md:w-32 md:h-32"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <DynamicShape02 /> {/* Use the dynamic component */}
        </motion.div>
      </div>
    </section>
  );
}
