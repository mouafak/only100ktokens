import PrivateSaleForm from "@/components/privateSale/PrivateSaleForm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Only100KLogo from "../public/100kLogoBLue.png";

export default function Home() {
  return (
    <main className="flex-center w-full h-screen bg-custo-image  bg-blueDarken bg-no-repeat bg-cover font-electrolize ">
      <div className=" h-full w-full flex flex-col justify-between items-center">
        <div className="h-full w-full bg-blueSombre max-h-20 ">
          <div className="flex justify-between items-center container h-full">
            <Link passHref href={"https://only100ktokens.com/"}>
              <Image className="w-32 lg:w-44" src={Only100KLogo} alt="Logo" />
            </Link>
            <Link href={"https://only100ktkens.com/"}>
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
        <div className="h-12 w-full bg-none bg-blueSombre flex-center text-sm ">
          © Only100Ktokens 2025
        </div>
      </div>
    </main>
  );
}
