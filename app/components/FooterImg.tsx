import bottomImg from "@/app/assests/bottomImg.jpg";
import Image from "next/image";

const FooterImg = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center w-full mx-4 z-10">
      <Image src={bottomImg} alt="bottom image" height={20} width={700} className="mx-2.5 border rounded-2xl" />
    </div>
  );
};

export default FooterImg;