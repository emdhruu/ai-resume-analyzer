"use client";

import CenterLayout from "./components/CenterLayout";
import FooterImg from "./components/FooterImg";
import Header from "./components/Header";

export default function Home() {
  return (
   <div  className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
              backgroundSize: "100% 100%",
            }}
    >
    <div className="relative min-h-screen h-screen z-10 p-8 font-sans">
     <Header/>
     <CenterLayout/>
     <FooterImg/>
    </div>
    </div>
  );
}
