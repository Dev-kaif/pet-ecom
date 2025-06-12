import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LableProps {
  lableName: string;
}

export default function Lable({ lableName }: LableProps) {
  return (
    <section className="h-40 sm:h-48 lg:h-52 w-full bg-secondary-50 px-4 sm:px-6 md:px-10 lg:px-32 py-16 relative overflow-hidden">
      <div className="relative flex flex-col gap-4 z-10 text-center sm:text-left"> {/* Added text alignment for responsiveness */}
        <h2 className="text-primary text-3xl sm:text-4xl lg:text-5xl font-bold capitalize">
          {lableName}
        </h2>
        <h6 className="flex gap-2 items-center font-light text-base justify-center sm:justify-start"> {/* Adjusted justify for responsiveness */}
          <Link href={'/'}>
            <span className="cursor-pointer hover:text-secondary">Home</span>
          </Link>
          <span>
            <ChevronRight size={20} />
          </span>
          <span className="text-secondary capitalize">{lableName}</span>
        </h6>
      </div>
      <div>
        {/* Decorative Image 1 - Hidden on small screens, block on medium and up */}
        <Image
          height={350}
          width={350}
          alt="deco"
          src={"/pages/layout/breadcrumb_shape01.png"}
          className="absolute left-0 top-0 hidden md:block w-32 h-auto sm:w-48 lg:w-[350px] z-1" // Added responsive width and height
        />
        {/* Decorative Image 2 - Hidden on small screens, block on medium and up */}
        <Image
          height={250}
          width={250}
          alt="deco"
          src={"/pages/layout/breadcrumb_shape02.png"}
          className="absolute right-0 bottom-0 hidden md:block w-24 h-auto sm:w-32 lg:w-[250px]" // Added responsive width and height
        />
      </div>
    </section>
  );
}
