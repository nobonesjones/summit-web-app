"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { useAuth } from "@/components/providers/auth-provider";

export default function HeroSection() {
  const { user, loading } = useAuth();

  return (
    <section
      className="relative flex flex-col items-center justify-center py-20"
      aria-label="Summit Platform Hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-400 dark:bg-purple-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="space-y-6 text-center max-w-4xl px-4">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-fit rounded-full border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/30 px-4 py-1 mb-6"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-purple-900 dark:text-purple-200">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Mini-Apps</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-300 dark:to-pink-300 animate-gradient-x pb-2"
        >
          Summit Tools <br className="hidden sm:block" />
          To Help You Win
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Define your plan, track your progress, and turn your vision into a reality.
        </motion.p>

        {/* CTA Button - Different based on auth status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center items-center gap-4 pt-4"
        >
          {!loading && (
            user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-12"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-12 border-2"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
              </>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
