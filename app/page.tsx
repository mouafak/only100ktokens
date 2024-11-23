import PrivateSaleForm from "@/components/privateSale/PrivateSaleForm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MskLogo from "../public/mskLogo.png";

export default function Home() {
  return (
    <main className="flex-center w-full h-screen bg-custom-image bg-no-repeat bg-cover font-electrolize ">
      <div className=" h-full w-full flex flex-col justify-between items-center">
        <div className="h-full w-full bg-soft max-h-20 border-b ">
          <div className="flex justify-between items-center container h-full">
            <Link passHref href={"https://muskdrive.com/"}>
              <Image className="w-14" src={MskLogo} alt="Logo" />
            </Link>
            <Link href={"https://muskdrive.com/"}>
              <div className="flex gap-1 items-center">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 stroke-white " />
                <p className="text-white text-sm md:text-base">Back to Home</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full h-full flex-center ">
          <PrivateSaleForm />
        </div>
        <div className="h-12 w-full bg-none bg-soft border-t flex-center text-sm ">
          © MuskDrive 2024
        </div>
      </div>
    </main>
  );
}
