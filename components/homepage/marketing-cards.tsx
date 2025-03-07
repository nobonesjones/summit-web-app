"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const miniApps = [
  {
    id: 1,
    name: "Business Plan Generator",
    description:
      "Create a comprehensive business plan in just 15 minutes with AI-powered guidance.",
    svg: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `,
    url: "/mini-apps/business-plan",
    color: "from-[#8A4FFF] to-[#FF55C6]",
    active: true,
  },
  {
    id: 2,
    name: "Marketing Strategy Builder",
    description:
      "Develop a targeted marketing strategy tailored to your business goals and audience.",
    svg: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.59 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `,
    url: "/mini-apps",
    color: "from-[#FF55C6] to-[#FF8A00]",
    active: false,
  },
  {
    id: 3,
    name: "Product Roadmap Planner",
    description:
      "Map out your product development journey with clear milestones and timelines.",
    svg: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `,
    url: "/mini-apps",
    color: "from-[#00CCFF] to-[#8A4FFF]",
    active: false,
  },
  {
    id: 4,
    name: "Pitch Deck Creator",
    description:
      "Generate a compelling investor pitch deck that showcases your business potential.",
    svg: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `,
    url: "/mini-apps",
    color: "from-[#FF8A00] to-[#FF55C6]",
    active: false,
  },
  {
    id: 5,
    name: "Financial Projections Tool",
    description:
      "Create realistic financial forecasts and projections for your business planning.",
    svg: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.93 4.93L7.76 7.76" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.24 16.24L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2 12H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.93 19.07L7.76 16.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `,
    url: "/mini-apps",
    color: "from-[#8A4FFF] to-[#00CCFF]",
    active: false,
  },
  {
    id: 6,
    name: "Competitor Analysis Tool",
    description:
      "Analyze your competition and identify opportunities to differentiate your business.",
    svg: `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `,
    url: "/mini-apps",
    color: "from-[#FF55C6] to-[#8A4FFF]",
    active: false,
  },
];

export default function MiniAppsSection() {
  return (
    <section id="summit-mini-apps" className="py-24 px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-300 dark:to-pink-300 pb-2">
          Summit Mini-Apps
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          AI-powered tools to help founders build successful startups. Generate business plans, marketing strategies, and more in minutes.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {miniApps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              {/* Gradient Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
                <div
                  className={`h-full w-full bg-gradient-to-br ${app.color}`}
                ></div>
              </div>

              <div className="relative z-10">
                {/* Logo and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-10 h-10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
                      dangerouslySetInnerHTML={{ __html: app.svg }}
                    />
                  </div>
                  {app.active ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Content */}
                <Link href={app.url} className="block">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {app.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {app.description}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
