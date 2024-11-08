// components/Features.tsx
import { Card } from '@/components/ui/card';
import { CheckIcon, CalendarIcon, ShieldCheckIcon } from 'lucide-react';

const features = [
  {
    title: 'Easy Event Creation',
    description: 'Create and manage your events with a user-friendly interface.',
    icon: <CheckIcon className="h-6 w-6 text-blue-600" />,
  },
  {
    title: 'Real-time Availability',
    description: 'Check and manage date availability in real-time.',
    icon: <CalendarIcon className="h-6 w-6 text-blue-600" />,
  },
  {
    title: 'Secure Management',
    description: 'Your data is safe with our secure management system.',
    icon: <ShieldCheckIcon className="h-6 w-6 text-blue-600" />,
  },
];

const Feature = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-12">Why Choose Event Management System?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="w-full md:w-1/4 p-4">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
