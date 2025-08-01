import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import waterTankImage from "../assets/about/view-water-tank-storage.jpg";

export default function About() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <>
      <Navigation />
      <div className="font-inter text-[#444444] min-h-screen bg-[#f9f9f9]">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${waterTankImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00b4d8]/80 via-[#0077b6]/70 to-[#023e8a]/60"></div>
          </div>

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                Aqua<span className="text-[#00b4d8]">Hope</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transforming communities through sustainable water solutions
                across the globe
              </p>
            </div>

            <div
              ref={ref1}
              className={`transition-all duration-1000 ${
                inView1 ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {
                    icon: "🌍",
                    number: 15,
                    suffix: "+",
                    label: "Countries Helped",
                    description: "Across Sub-Saharan Africa",
                  },
                  {
                    icon: "👥",
                    number: 120000,
                    suffix: "+",
                    label: "People Served",
                    description: "Lives transformed daily",
                  },
                  {
                    icon: "🏗️",
                    number: 350,
                    suffix: "+",
                    label: "Projects Completed",
                    description: "Sustainable infrastructure",
                  },
                  {
                    icon: "🏆",
                    number: 25,
                    suffix: "+",
                    label: "Awards Received",
                    description: "Global recognition",
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                      <div className="text-4xl mb-4">{stat.icon}</div>
                      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {stat.number > 1000 ? (
                          <CountUp
                            start={0}
                            end={stat.number}
                            duration={3}
                            separator=","
                          />
                        ) : (
                          <CountUp start={0} end={stat.number} duration={2.5} />
                        )}
                        {stat.suffix}
                      </div>
                      <h3 className="font-semibold text-white mb-1">
                        {stat.label}
                      </h3>
                      <p className="text-sm text-white/80">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="py-20 bg-[#f9f9f9] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #00b4d8 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #0077b6 2px, transparent 2px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div
              ref={ref2}
              className={`transition-all duration-1000 ${
                inView2 ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-[#212529] mb-6">
                  Our{" "}
                  <span className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] bg-clip-text text-transparent">
                    Mission
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] mx-auto mb-8 rounded-full"></div>
                <p className="text-xl text-[#444444] max-w-4xl mx-auto leading-relaxed">
                  At <strong className="text-[#0077b6]">AquaHope</strong>, we
                  envision a future where clean, accessible water is a right,
                  not a privilege. We're not just building wells, we're building
                  resilience, dignity, and hope.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    icon: "🌿",
                    title: "Our Approach",
                    description:
                      "We work hand-in-hand with local leaders, engineers, and volunteers to understand real needs and co-design sustainable water solutions. Community training is our priority.",
                  },
                  {
                    icon: "💡",
                    title: "Core Values",
                    items: [
                      "Transparency in operations",
                      "Respect for local culture",
                      "Innovation through design",
                      "Accountability to communities",
                    ],
                  },
                  {
                    icon: "🤝",
                    title: "Join Our Journey",
                    description:
                      "Whether you're a donor, engineer, or passionate advocate, you can be part of our mission. Together, we bring life to villages through water.",
                  },
                ].map((card, index) => (
                  <div key={index} className="group">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 border-t-4 border-gradient-to-r from-[#00b4d8] to-[#0077b6] h-full">
                      <div className="text-4xl mb-6 text-center">
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-[#212529] mb-4 text-center">
                        {card.title}
                      </h3>
                      {card.description ? (
                        <p className="text-[#444444] leading-relaxed text-center">
                          {card.description}
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {card.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center text-[#444444]"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] rounded-full mr-3 flex-shrink-0"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Impact Showcase Section */}
        <section className="py-20 bg-gradient-to-br from-[#212529] to-[#444444] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-32 h-32 border border-white/10 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 3}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div
              ref={ref3}
              className={`transition-all duration-1000 ${
                inView3 ? "animate-fade-in-up" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-6">
                  Creating{" "}
                  <span className="text-[#00b4d8]">Lasting Impact</span>
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto">
                  Every drop counts, every well matters, every life changed is a
                  victory for humanity
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {[
                    {
                      title: "Sustainable Infrastructure",
                      description:
                        "Building water systems that last generations, not just years",
                      metric: "98% operational after 5 years",
                    },
                    {
                      title: "Community Empowerment",
                      description:
                        "Training local technicians and leaders for self-sufficiency",
                      metric: "500+ local experts trained",
                    },
                    {
                      title: "Health Transformation",
                      description:
                        "Reducing waterborne diseases and improving quality of life",
                      metric: "85% reduction in illness",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-white/80 mb-2">{item.description}</p>
                        <span className="text-[#00b4d8] font-semibold">
                          {item.metric}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-[#00b4d8]/20 to-[#0077b6]/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💧</div>
                      <h3 className="text-2xl font-bold mb-4">Water is Life</h3>
                      <p className="text-white/80 mb-6">
                        Together, we've transformed over 120,000 lives through
                        clean water access. But our mission is far from over.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-[#f9f9f9]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#212529] mb-6">
              Ready to Make a <span className="text-[#0077b6]">Difference</span>
              ?
            </h2>
            <p className="text-xl text-[#444444] mb-8 leading-relaxed">
              Every donation, every share, every voice matters in our mission to
              bring clean water to those who need it most.
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
