import PrivateSaleForm from "@/components/privateSale/PrivateSaleForm";
import Image from "next/image";
import logo from "@/public/TrumpTriumphLogo.png";
import logo2 from "@/public/logo2.webp";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-center w-full h-screen bg-custom-image ">
      <div className=" h-full w-full flex flex-col justify-between items-center">
        <div className="h-full w-full bg-custom-blue-green  ">
          <div className="flex justify-between items-center container h-full py-2">
            <Image src={logo2} alt="TRUMP’S TRIUMPH" width={200} height={200} />
            <Link href={"https://trumptriumphcoin.com/"}>
              <div className="flex gap-1 items-center">
                <ArrowLeft className="w-5 h-5 stroke-white " />
                <p className="text-white">Back to Home</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full h-full bg-custom-pattern flex-center ">
          <PrivateSaleForm />
        </div>
        <div className="h-12 w-full bg-none bg-custom-blue-green flex-center text-white text-sm lowercase ">
          © TRUMP’S TRIUMPH 2024
        </div>
      </div>
    </main>
  );
}
