import { Loader, Loader2, RefreshCw } from "lucide-react";

const Loading = () => {
  return (
    <div className=" absolute custom-bg inset-0 z-50 flex-center ">
      <div className="text-white flex-center flex-col gap-2">
        <p className=" uppercase text-lg">loading</p>
        <Loader className="w-8 h-18 stroke-2 animate-spin " />
      </div>
    </div>
  );
};
export default Loading;
