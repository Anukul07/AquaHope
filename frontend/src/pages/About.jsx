import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  FaGlobeAfrica,
  FaUsers,
  FaHandsHelping,
  FaTrophy,
} from "react-icons/fa";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import waterTankImage from "../assets/about/view-water-tank-storage.jpg";
import gradientBackground from "../assets/about/blue-gradient.jpg";

export default function About() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <>
      <Navigation />
      <div className="font-inter text-[#212529] h-screen overflow-y-scroll scrollbar-hide snap-y snap-mandatory scroll-smooth">
        {/* Section 1 */}
        <section
          className="snap-start min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center px-6"
          style={{
            backgroundImage: `url(${waterTankImage})`,
          }}
        >
          <div
            ref={ref1}
            className={`bg-white/60 backdrop-blur-md text-[#212529] p-8 rounded-2xl shadow-2xl w-full max-w-6xl transition-all duration-700 ${
              inView1 ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl font-bold text-center text-[#0077b6] mb-10">
              AquaHope's Global Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center text-center">
                <FaGlobeAfrica className="text-4xl mb-4 text-[#0077b6]" />
                <h3 className="text-3xl font-bold">
                  <CountUp start={0} end={15} duration={2.5} />+
                </h3>
                <p className="text-sm mt-1 font-semibold">Countries Helped</p>
                <p className="text-xs mt-1">
                  Spreading clean water initiatives across Sub-Saharan Africa.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FaUsers className="text-4xl mb-4 text-[#0077b6]" />
                <h3 className="text-3xl font-bold">
                  <CountUp start={0} end={120000} duration={3} separator="," />+
                </h3>
                <p className="text-sm mt-1 font-semibold">People Served</p>
                <p className="text-xs mt-1">
                  Transforming lives by delivering reliable water access.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FaHandsHelping className="text-4xl mb-4 text-[#0077b6]" />
                <h3 className="text-3xl font-bold">
                  <CountUp start={0} end={350} duration={2.8} />+
                </h3>
                <p className="text-sm mt-1 font-semibold">Projects Completed</p>
                <p className="text-xs mt-1">
                  Building sustainable infrastructure with communities.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <FaTrophy className="text-4xl mb-4 text-[#0077b6]" />
                <h3 className="text-3xl font-bold">
                  <CountUp start={0} end={25} duration={2.2} />+
                </h3>
                <p className="text-sm mt-1 font-semibold">
                  Awards & Recognition
                </p>
                <p className="text-xs mt-1">
                  Honored for innovation and social impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section
          className="snap-start min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center px-6"
          style={{
            backgroundImage: `url(${waterTankImage})`,
          }}
        >
          <div
            ref={ref2}
            className={`bg-white/60 backdrop-blur-md text-[#212529] p-10 rounded-2xl max-w-4xl shadow-2xl transition-all duration-700 ${
              inView2 ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 text-[#0077b6] text-center">
              Our Mission & Values
            </h2>

            <p className="text-md leading-relaxed mb-6 text-center">
              At <strong>AquaHope</strong>, we envision a future where clean,
              accessible water is a right, not a privilege. We're not just
              building wells, we're building resilience, dignity, and hope.
            </p>

            <div className="text-left space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#0077b6]">
                  🌿 Our Approach
                </h3>
                <p className="text-sm leading-relaxed mt-1">
                  We work hand-in-hand with local leaders, engineers, and
                  volunteers to understand real needs and co-design sustainable
                  water solutions. We prioritize community training and
                  long-term maintenance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0077b6]">
                  💡 Core Values
                </h3>
                <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                  <li>Transparency in operations and fund allocation</li>
                  <li>Respect for local culture and ownership</li>
                  <li>Innovation through sustainable design</li>
                  <li>Accountability to our donors and communities</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#0077b6]">
                  🤝 Join Our Journey
                </h3>
                <p className="text-sm leading-relaxed mt-1">
                  Whether you’re a donor, engineer, or a passionate human being,
                  you can be part of our mission. Together, we bring life to
                  villages through water.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button className="px-8 py-3 text-sm font-semibold rounded-full bg-[#0077b6] text-white hover:bg-[#005f8d] transition duration-300">
                Get Involved
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="snap-end">
          <Footer />
        </div>
      </div>
    </>
  );
}
