import { motion } from 'framer-motion';
import Link from 'next/link';

// interface BlogProps {
// }

const Blog = () => {
  const blogPosts = [
    {
      image: '/images/blog/blog_img01.jpg', // User will place this image
      author: 'Admin',
      date: '24 October, 2023',
      title: 'The Best Way To Find The Best Pet Care For Your Pet',
      link: '/blog/the-best-way-to-find-pet-care', // Example slug
    },
    {
      image: '/images/blog/blog_img02.jpg', // User will place this image
      author: 'Admin',
      date: '24 October, 2023',
      title: 'How To Choose The Right Food For Your Pet',
      link: '/blog/how-to-choose-pet-food', // Example slug
    },
    {
      image: '/images/blog/blog_img03.jpg', // User will place this image
      author: 'Admin',
      date: '24 October, 2023',
      title: '10 Tips For Training Your Puppy To Be A Good Dog',
      link: '/blog/puppy-training-tips', // Example slug
    },
  ];

  return (
    <section className="relative py-20 lg:py-24 xl:py-30 overflow-hidden bg-white">
      <div className="container mx-auto px-4 custom-container">
        <div className="flex justify-center text-center mb-16 lg:mb-20">
          <div className="w-full lg:w-8/12 xl:w-6/12">
            <div className="section__title space-y-4">
              <span className="text-primary-600 text-lg font-semibold uppercase tracking-wider">From Our Blog</span>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">Latest News & Articles</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                There are many variations of passages of lorem ipsum available
                but the majority have suffered.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              className="blog__item bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
            >
              <div className="blog__img relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="blog__content p-6 space-y-4">
                <div className="blog__meta flex items-center justify-between text-sm text-gray-600 mb-2">
                  <ul className="flex items-center space-x-4">
                    <li>
                      <i className="far fa-user mr-2 text-primary-600" />
                      <Link href={`/blog/author/${post.author.toLowerCase()}`} className="hover:text-primary-600 transition-colors">{post.author}</Link>
                    </li>
                    <li>
                      <i className="far fa-calendar-alt mr-2 text-primary-600" />
                      {post.date}
                    </li>
                  </ul>
                </div>
                <h4 className="title text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  <Link href={post.link}>
                    {post.title}
                  </Link>
                </h4>
                <Link href={post.link} className="read-more inline-flex items-center text-primary-600 font-medium hover:underline hover:text-primary-700 transition-colors duration-300">
                  Read More
                  <i className="far fa-arrow-right ml-2 text-sm" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;