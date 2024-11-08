// components/about/AboutUs.jsx
import React from 'react';
import { Badge } from '@/components/ui/badge';



const AboutUs = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">

        <div className="relative z-10 text-center">
          <Badge className="text-lg">
            About Us
          </Badge>
          <h2 className="text-5xl font-extrabold mt-6 text-gray-900">
            Our Journey & Vision
          </h2>
          <p className="text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
            Eventify was founded with a vision to revolutionize the event management industry in Malaysia. Our passion for innovation drives us to create seamless experiences for event organizers and attendees alike.
          </p>


          <div className="mt-16">
            <h3 className="text-3xl font-semibold text-center mb-8 text-blue-600">Our Milestones</h3>
            <div className="relative">
              <div className="border-l-2 border-blue-600 absolute h-full left-1/2 transform -translate-x-1/2"></div>
              <div className="space-y-12">
          
                <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 text-right">
                    <h4 className="text-2xl font-bold">2015</h4>
                    <p className="text-gray-700 mt-2">
                      Eventify was conceptualized by a group of event enthusiasts aiming to simplify event management.
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full md:mx-0 mx-auto my-4"></div>
                  <div className="flex-1 md:pl-8"></div>
                </div>
   
                <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full md:mx-0 mx-auto my-4"></div>
                  <div className="flex-1 md:pl-8 text-left">
                    <h4 className="text-2xl font-bold">2017</h4>
                    <p className="text-gray-700 mt-2">
                      Launched our first beta version, receiving positive feedback from early adopters.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 text-right">
                    <h4 className="text-2xl font-bold">2019</h4>
                    <p className="text-gray-700 mt-2">
                      Expanded our services nationwide, partnering with major event organizers.
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full md:mx-0 mx-auto my-4"></div>
                  <div className="flex-1 md:pl-8"></div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full md:mx-0 mx-auto my-4"></div>
                  <div className="flex-1 md:pl-8 text-left">
                    <h4 className="text-2xl font-bold">2021</h4>
                    <p className="text-gray-700 mt-2">
                      Introduced new features like real-time analytics and virtual event support.
                    </p>
                  </div>
                </div>
   
                <div className="flex flex-col md:flex-row items-center md:justify-between">
                  <div className="flex-1 md:pr-8 text-right">
                    <h4 className="text-2xl font-bold">2023</h4>
                    <p className="text-gray-700 mt-2">
                      Reached 1 million users and became Malaysia's leading event management platform.
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full md:mx-0 mx-auto my-4"></div>
                  <div className="flex-1 md:pl-8"></div>
                </div>
              </div>
            </div>


            <div className="mt-20">
              <h3 className="text-3xl font-semibold text-center mb-8 text-blue-600">Meet Our Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src="https://thumbs.dreamstime.com/b/d-character-wearing-vibrant-red-jacket-inspired-charming-anime-characters-john-wilhelm-alex-hirsch-lit-kid-292589169.jpg"
                    alt="Team Member 1"
                    width={150}
                    height={150}
                    className="rounded-full mx-auto"
                  />
                  <h4 className="text-xl font-bold mt-4">Alex Tan</h4>
                  <p className="text-blue-600">Founder & CEO</p>  
                  <p className="text-gray-700 mt-2">
                    Alex leads the team with over 15 years of experience in event management and technology.
                  </p>
                </div>
   
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src="https://i.pinimg.com/originals/84/5f/57/845f57c5f50322ee947f80ee8eab2631.jpg"
                    alt="Team Member 2"
                    width={150}
                    height={150}
                    className="rounded-full mx-auto"
                  />
                  <h4 className="text-xl font-bold mt-4">Melissa Lee</h4>
                  <p className="text-blue-600">Chief Operations Officer</p>
                  <p className="text-gray-700 mt-2">
                    Melissa ensures our operations run smoothly, overseeing all aspects of the platform.
                  </p>
                </div>
       
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <img
                    src="https://thumbs.dreamstime.com/b/malay-man-smiling-happy-friendly-337248492.jpg"
                    alt="Team Member 3"
                    width={150}
                    height={150}
                    className="rounded-full mx-auto"
                  />
                  <h4 className="text-xl font-bold mt-4">Rahim Ismail</h4>
                  <p className="text-blue-600">Head of Technology</p>
                  <p className="text-gray-700 mt-2">
                    Rahim leads our tech team, constantly innovating to improve user experience.
                  </p>
                </div>
              </div>
            </div>

 
            <div className="mt-16 text-center">
              <h3 className="text-3xl font-semibold text-blue-600">Join Us on Our Journey</h3>
              <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
                We're always looking for talented individuals who share our passion for innovation and excellence. If you’re interested in joining our team, please check out our career opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
