import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  testimonial: string;
  image: string;
  rating?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  testimonial,
  image,
  rating = 5,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md hover:shadow-xl transition-shadow duration-300">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 text-base mb-6 leading-relaxed italic">
        "{testimonial}"
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6 flex items-center gap-4">
        {/* Avatar */}
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover"
        />

        {/* Author Info */}
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
          <p className="text-xs text-gray-500">{company}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
