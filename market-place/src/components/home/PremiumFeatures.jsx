import React from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Zap, Headphones, ArrowRight } from "lucide-react";

const PremiumFeatures = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Truck size={32} />,
      title: "Lightning Fast Delivery",
      desc: "Ultra-speed shipping on every order, tracking included.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "/shipping-info",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Military-Grade Security",
      desc: "Your transactions are shielded by advanced encryption.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/security",
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Verification",
      desc: "Buy and sell immediately with our automated system.",
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "/help",
    },
    {
      icon: <Headphones size={32} />,
      title: "Elite 24/7 Support",
      desc: "Our concierge team is here for you, day or night.",
      color: "text-rose-600",
      bg: "bg-rose-50",
      link: "/help",
    },
  ];

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50/50 rounded-full blur-[100px] translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">
            The Market-Link Edge
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Why Professionals Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Market-Link
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
            We've built a world-class infrastructure so you can focus on what
            matters most: growing your business and finding unique treasures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500"
            >
              <div
                className={`${feature.bg} ${feature.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform duration-500`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                {feature.desc}
              </p>
              <button
                onClick={() => navigate(feature.link)}
                className="flex items-center gap-2 text-sm font-black text-blue-600 group/btn transition-all cursor-pointer hover:gap-3"
              >
                <span>Learn More</span>
                <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-20 p-8 md:p-12 bg-gray-900 rounded-[3rem] text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <h4 className="text-white text-2xl md:text-3xl font-black mb-4">
              Ready to start your journey?
            </h4>
            <p className="text-gray-400 font-medium mb-8 max-w-xl mx-auto">
              Join the most trusted community of buyers and sellers globally.
              Experiencecommerce without limits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-white text-gray-900 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-105 transform cursor-pointer"
              >
                Get Started Now
              </button>
              <button
                onClick={() => navigate("/products")}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all hover:scale-105 transform cursor-pointer"
              >
                View Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures;
