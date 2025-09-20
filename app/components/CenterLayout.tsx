import download from "@/app/assests/download.png";
import review from "@/app/assests/review.png";
import Image from "next/image";
import Link from "next/link";

const CenterLayout = () => {
  return (
    <div className="h-[60%] w-full flex flex-col justify-center items-center mx-2 lg:mx-0 text-center">
      <div className="flex items-center justify-center space-x-6 w-full max-w-5xl">
        <div className="mt-90">
          <Image src={download} alt="download" width={150} className="hidden xl:block " />
        </div>
        <div className="w-full max-w-3xl p-6 rounded-xl flex flex-col items-center space-y-5">
          <div className="relative w-fit space-x-1 py-1 px-3.5 rounded-2xl text-sm border overflow-hidden bg-gradient-to-r from-teal-200 via-white to-teal-200 animate-shimmer">
            <span className="text-teal-700">New!</span>
            <span>Introducing Ai Analyzer 🎉</span>
          </div>

          <h1 className="text-5xl font-bold">Ai Web Resume Analyzer</h1>
          <p>
            Revolutionize Web Resume Analysis with AI: Unleash Mind-
            <br />
            blowing AI-Powered Wizardy and Uncover
            Limitless Possibilities!
          </p>
          <Link href="/analyzer" className="bg-teal-900 text-white p-1.5 px-9 rounded-2xl font-extralight">
            Start for free
          </Link>
        </div>

        <div className="mt-90">
          <Image src={review} alt="review" width={270} className="hidden xl:block" />
        </div>
      </div>
    </div>
  );
};

export default CenterLayout;