import { useState, useEffect } from "react";
import {
  Home,
  Star,
  Heart,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
  ExternalLink,
  Code,
  Rocket,
  Coffee,
  Zap,
} from "lucide-react";

const UnderConstructionPage = () => {
  const [progress, setProgress] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [animateCards, setAnimateCards] = useState(false);

  const coolQuotes = [
    "Crafting digital experiences, one line at a time ✨",
    "Building the future of home-sharing 🏠",
    "Full-stack developer with a passion for innovation 🚀",
    "Turning coffee into code since forever ☕",
  ];

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/cr4ck-j4ck",
      icon: <Github className="w-5 h-5" />,
      color: "from-gray-600 to-gray-800",
      hoverColor: "hover:from-gray-700 hover:to-gray-900",
    },
    {
      name: "LinkedIn",
      url: "http://linkedin.com/in/cr4ck-j4ck",
      icon: <Linkedin className="w-5 h-5" />,
      color: "from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-700 hover:to-blue-900",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/cr4ck.j4ck/",
      icon: <Instagram className="w-5 h-5" />,
      color: "from-pink-600 to-purple-600",
      hoverColor: "hover:from-pink-700 hover:to-purple-700",
    },
    {
      name: "Discord",
      url: "https://discordapp.com/users/1110465956423147540",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "from-indigo-600 to-purple-600",
      hoverColor: "hover:from-indigo-700 hover:to-purple-700",
    },
    {
      name: "Twitter",
      url: "https://x.com/cr4ck__j4ck",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "from-gray-800 to-black",
      hoverColor: "hover:from-gray-900 hover:to-gray-800",
    },
  ];

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Full-Stack Magic",
      description: "React • TypeScript • Node.js • MongoDB",
      status: "Expert Level",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Modern Architecture",
      description: "Building scalable, performant applications",
      status: "In Progress",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Creative Solutions",
      description: "Turning complex problems into elegant code",
      status: "Always On",
      color: "from-purple-500 to-pink-600",
    },
  ];

  useEffect(() => {
    setAnimateCards(true);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 1;
      });
    }, 60);

    // Quote rotation
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % coolQuotes.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="min-h-fit w-full bg-gradient-to-br from-rose-50 via-white to-orange-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-100 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-orange-100 rounded-full opacity-30 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-32 w-20 h-20 bg-yellow-100 rounded-full opacity-25 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-16 w-28 h-28 bg-purple-100 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gradient-to-r from-rose-200 to-transparent rounded-full opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-200 to-transparent rounded-full opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 min-w-full">
        <div className="flex items-center gap-2 w-full justify-center relative bottom-10">
          <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Coffee className="w-3 h-3" />
            Under Development
          </div>
        </div>
        <div className="min-w-full mx-auto">
          {/* Banner Area */}
          <div className="text-center mb-16">
            <p className="lostHead">404</p>
            <div className="relative mb-8">
              {/* Developer Profile Circle */}
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-rose-400 to-orange-400 p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-6xl font-bold text-gray-400 relative overflow-hidden">
                    {/* Placeholder for DP - you can replace this with an img tag */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center">
                      <img
                        src="https://res.cloudinary.com/dscntdruu/image/upload/v1754038357/IMG_20240714_000104_122_qvbbxs.jpg"
                        className="min-w-50 rounded-full mt-10"
                        alt=""
                      />
                    </div>
                    {/* Replace above div with: <img src="your-dp.jpg" alt="Developer" className="w-full h-full rounded-full object-cover" /> */}
                  </div>
                </div>

                {/* Floating Status Badge */}
                <div className="absolute -bottom-2 -right-2 z-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-pulse">
                  Available for hire
                </div>
              </div>

              {/* Orbiting Icons */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin"
                    style={{ animationDuration: "12s" }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                  <div
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 animate-spin"
                    style={{
                      animationDuration: "10s",
                      animationDirection: "reverse",
                    }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-spin"
                    style={{ animationDuration: "14s" }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 animate-spin"
                    style={{
                      animationDuration: "8s",
                      animationDirection: "reverse",
                    }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Something Epic
              </span>
              <br />
              <span className="text-gray-800">is Coming</span>
            </h1>

            {/* Dynamic Quote */}
            <div className="mb-8 h-8">
              <p className="text-xl text-gray-600 transition-all duration-500 ease-in-out">
                {coolQuotes[currentQuote]}
              </p>
            </div>

            {/* Progress Section */}
            <div className="max-w-md mx-auto mb-12">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Development Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                🚀 Almost ready to launch!
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${social.color} text-white rounded-full ${social.hoverColor} transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  {social.icon}
                  <span className="text-sm font-medium">{social.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Features/Skills Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-white/50 ${
                  animateCards ? "animate-pulse" : ""
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      feature.status === "Expert Level"
                        ? "bg-green-100 text-green-800"
                        : feature.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {feature.status}
                  </span>
                  <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Want to see the magic happen? ✨
              </h3>
              <p className="text-gray-600 mb-6">
                Follow my journey as I build Nivasa - the next generation
                home-sharing platform. Connect with me on social media for
                behind-the-scenes updates!
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["React", "TypeScript", "Node.js", "MongoDB", "Tailwind"].map(
                  (tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-white/80 backdrop-blur-sm border-t border-rose-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-orange-400 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              NIVASA
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Built with ❤️ by a passionate developer who believes in creating
            amazing experiences.
          </p>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
            <span>© 2025 cr4ck-j4ck</span>
            <span>•</span>
            <span>Full-Stack Developer</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Coffee className="w-4 h-4" />
              <span>Powered by coffee</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default UnderConstructionPage;
