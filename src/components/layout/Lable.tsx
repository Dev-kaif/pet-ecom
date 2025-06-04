import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface LableProps{
    lableName:string;
}

export default function Lable({lableName}:LableProps) {
  return (
    <section className="h-52 w-full bg-secondary-50 px-32 py-16 relative -z-1">
      <div className="relative flex flex-col gap-4 z-10">
        <h2 className="text-primary text-5xl font-bold capitalize">{lableName}</h2>
        <h6 className="flex gap-2 items-center font-light text-base">
          <span>Home</span>
          <span>
            <ChevronRight size={20} />
          </span>
          <span className="text-secondary capitalize">{lableName}</span>
        </h6>
      </div>
      <div>
        <Image
          height={350}
          width={350}
          alt="deco"
          src={"/pages/layout/breadcrumb_shape01.png"}
          className="absolute left-0 top-0 z-1"
        />
        <Image
          height={250}
          width={250}
          alt="deco"
          src={"/pages/layout/breadcrumb_shape02.png"}
          className="absolute right-0 bottom-0"
        />
      </div>
    </section>
  );
}
