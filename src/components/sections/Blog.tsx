import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Import Image for Next.js optimized images
import { User, Calendar, MoveRight } from "lucide-react"; // Import Lucide icons

const Blog = () => {
  const blogPosts = [
    {
      image: "/images/blog/blog_img01.jpg",
      tags: ["Pet", "Medical"], // Added tags for badges
      author: "Admin",
      date: "25th Aug, 2024",
      title: "Clean indoor air as important in controlling asthma",
      link: "/blog/clean-indoor-air-asthma",
    },
    {
      image: "/images/blog/blog_img02.jpg",
      tags: ["Care"], // Added tags for badges
      author: "Admin",
      date: "25th Aug, 2024",
      title: "Clean indoor air as important in controlling asthma",
      link: "/blog/clean-indoor-air-asthma-2",
    },
    {
      image: "/images/blog/blog_img03.jpg",
      tags: ["Pet Care"], // Added tags for badges
      author: "Admin",
      date: "25th Aug, 2024",
      title: "Clean indoor air as important in controlling asthma",
      link: "/blog/clean-indoor-air-asthma-3",
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white px-4 md:px-8 lg:px-16 xl:px-32"> {/* Adjusted horizontal padding for responsiveness */}
      {/* Top-right paw print icon */}
      {/* Hide on small screens, adjust positioning for medium screens */}
      <div className="absolute top-0 right-0 z-0 opacity-10 hidden md:block transform translate-x-1/4 -translate-y-1/4">
        <Image
          src="/images/paw_icon.png" // Path to your paw icon image
          alt="Paw icon"
          width={100}
          height={100}
          className="w-24 h-24"
        />
      </div>

      <div className="container mx-auto px-4 custom-container">
        {/* Section Header */}
        {/* Flex direction column on small screens, row on larger */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 lg:mb-16 text-center md:text-left gap-6 md:gap-0"> {/* Adjusted margin-bottom and added gap for spacing */}
          <div className="w-full md:w-auto"> {/* Ensures text block takes full width on mobile */}
            <span className="text-secondary text-base md:text-lg font-bold uppercase tracking-wider block mb-1"> {/* Adjusted font size */}
              NEWS & BLOGS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-primary"> {/* Adjusted font sizes for responsiveness */}
              Our Recent Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="btn-bubble btn-bubble-secondary !text-secondary hover:!text-white mx-auto md:mx-0" // Center button on mobile
          >
            <span>
              <span>See All Services</span>
              <MoveRight className="w-5 h-5 ml-1" /> {/* Added ml-1 for small space */}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              // Removed px-5 py-3 from here to use more consistent p-6
              className="w-full bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative w-full h-56 overflow-hidden rounded-t-3xl rounded-b-[6rem]">
                <Image
                  src={post.image}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-white text-primary text-xs font-semibold px-3 py-1 rounded-full shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="blog__content p-6 space-y-4"> {/* Consistent padding */}
                <div className="blog__meta flex flex-wrap justify-center sm:justify-start items-center text-sm text-gray-600 mb-2 gap-y-2"> {/* Added flex-wrap and gap-y for mobile */}
                  <span className="flex items-center pr-3 border-r border-gray-300">
                    <User size={16} className="mr-2 text-primary" />
                    By {post.author}
                  </span>
                  <span className="flex items-center pl-3">
                    <Calendar size={16} className="mr-2 text-primary" />
                    {post.date}
                  </span>
                </div>
                {/* Title */}
                <h4 className="title text-xl font-bold text-primary leading-tight group-hover:text-secondary transition-colors duration-300 text-center sm:text-left"> {/* Center title on mobile */}
                  <Link href={post.link}>{post.title}</Link>
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;