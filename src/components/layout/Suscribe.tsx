import { ArrowRight } from "lucide-react";

export default function Suscribe() {
  return (
    <div className="bg-primary py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-16 lg:px-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center md:text-left flex-shrink-0">
            Sign Up For Newsletter!
          </h2>
          <div className="flex w-full md:w-auto flex-grow justify-center md:justify-end">
            <div className="flex flex-col sm:flex-row w-full max-w-lg rounded-full overflow-hidden shadow-lg">
              <input
                type="email"
                placeholder="Type Your E-mail"
                className="flex-grow py-3 px-6 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent rounded-t-full sm:rounded-l-full sm:rounded-tr-none" // Rounded corners adjusted for stacking
              />
              <button
                className="flex items-center justify-center bg-secondary text-white py-3 px-6 font-semibold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white rounded-b-full sm:rounded-r-full sm:rounded-bl-none mt-2 sm:mt-0" // Rounded corners adjusted for stacking, added mt for spacing
              >
                Subscribe
                <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
