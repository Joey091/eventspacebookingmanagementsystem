// components/Hero.tsx
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { RiNextjsLine,RiTailwindCssFill  } from "react-icons/ri";
import { SiShadcnui } from "react-icons/si";
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-32 bg-gray-50">
      <div className="container mx-auto px-4">
     
        <div className="absolute inset-0 z-0 opacity-20">
   
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1125" className="w-full h-full">
       
          </svg>
        </div>

   
        <div className="relative z-10 flex flex-col items-center text-center">
  
        
          <Badge className="text-lg" >Event Management</Badge>
          <div className="mt-6">
            <h1 className="mb-6 text-4xl font-extrabold text-gray-900 lg:text-5xl">
              Organize and Manage Your Events Seamlessly
            </h1>
            <p className="text-lg text-gray-600 lg:text-xl max-w-2xl mx-auto">
              Create, register, and manage events effortlessly. Ensure your dates are free and let our admin team handle the rest.
            </p>
          </div>
          <div className="mt-6 flex justify-center gap-4">

            <Link href="/about-us">
             
                <Button variant="outline">
                  Learn More <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            
            </Link>
          </div>

    
          <div className="mt-20 flex flex-col items-center gap-4">
            <p className="text-center text-gray-500 lg:text-left">
              Powered by reliable technologies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
    
              <a
                href="https://nextjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'group px-3'
                )}
              >
                <RiNextjsLine size={30}/>
              </a>
              <a
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'group px-3'
                )}
              >
                <RiTailwindCssFill size={30}/>
              </a>
              <a
                href="https://shadcn.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'group px-3'
                )}
              >
                <SiShadcnui size={30}/>
              </a>
            
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
