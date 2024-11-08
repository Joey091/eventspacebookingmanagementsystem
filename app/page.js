import Feature from "@/components/feature/Feature";
import Footer from "@/components/footer/Fotter";
import Hero from "@/components/hero/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <Hero/>
      <Feature/>
      <Footer/>

    </div>
  );
}
