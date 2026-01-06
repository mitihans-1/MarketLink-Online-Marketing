// src/components/home/Testimonials.jsx
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frequent Buyer',
      content: 'Amazing selection and fast delivery! I\'ve bought multiple items and always had a great experience.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' // Working avatar URL
    },
    {
      name: 'Michael Chen',
      role: 'Small Business Owner',
      content: 'As a seller, the platform has helped me grow my business exponentially. Highly recommended!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' // Working avatar URL
    },
    {
      name: 'Emma Wilson',
      role: 'First-time Buyer',
      content: 'The customer support was incredible when I had questions. Will definitely shop here again.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' // Working avatar URL
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">What Our Customers Say</h2>
      <p className="text-gray-600 text-center mb-12">Join thousands of satisfied customers and sellers</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  // Fallback to initials if image fails
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `
                    <div class="w-12 h-12 rounded-full mr-4 bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-bold">${testimonial.name.charAt(0)}</span>
                    </div>
                  ` + e.target.parentNode.innerHTML;
                }}
              />
              <div>
                <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic">"{testimonial.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;