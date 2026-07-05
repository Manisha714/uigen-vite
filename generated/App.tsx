import React from 'react';
import TestimonialCard from './components/TestimonialCard';

function App() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'Tech Innovations Inc',
      testimonial:
        'This product has completely transformed how our team works. The intuitive interface and powerful features have saved us countless hours.',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'CEO',
      company: 'Digital Solutions Co',
      testimonial:
        'Outstanding service and support. The team went above and beyond to ensure our success. Highly recommended!',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      company: 'Creative Studios',
      testimonial:
        'The best investment we made this year. The ROI has been incredible and our clients love the results.',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h1>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied customers
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              testimonial={testimonial.testimonial}
              image={testimonial.image}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
