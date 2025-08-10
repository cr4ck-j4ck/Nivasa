// @ts-nocheck

import { useState } from "react";
import { motion, easeOut } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  Heart,
  MessageCircle,
  DollarSign,
  Star,
  Zap,
  Clock,
  User,
  Home,
  CreditCard,
  Bell,
  ChevronRight,
  MapPin,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import UserStore from "@/Store/UserStore";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, transition: { duration: 0, ease: "f" } },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
};

export default function ProfileDashboard() {
  const user = UserStore((state) => state.user);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const navigate = useNavigate();
  const dashboardSections = [
    {
      id: "bookings",
      title: "Your Bookings",
      description: "Active, past, and upcoming trips",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600",
      count: 3,
      badge: "Active",
      badgeColor: "bg-green-100 text-green-800",
    },
    {
      id: "saved",
      title: "Saved Listings",
      description: "Your wishlist homes",
      icon: Heart,
      color: "bg-red-50 text-red-600",
      count: 12,
      badge: "Favorites",
      badgeColor: "bg-red-100 text-red-800",
      path:"/wishlist"
    },
    {
      id: "messages",
      title: "Messages",
      description: "Chats with hosts",
      icon: MessageCircle,
      color: "bg-green-50 text-green-600",
      count: 2,
      badge: "New",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "spending",
      title: "Spending Summary",
      description: "Monthly & trip expenses",
      icon: DollarSign,
      color: "bg-yellow-50 text-yellow-600",
      count: "$2,450",
      badge: "This Month",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "reviews",
      title: "Your Reviews",
      description: "Reviews you've left",
      icon: Star,
      color: "bg-purple-50 text-purple-600",
      count: 8,
      badge: "4.9 avg",
      badgeColor: "bg-purple-100 text-purple-800",
    },
    {
      id: "reminders",
      title: "Check-in Reminders",
      description: "When to leave for check-in",
      icon: Clock,
      color: "bg-orange-50 text-orange-600",
      count: 1,
      badge: "Tomorrow",
      badgeColor: "bg-orange-100 text-orange-800",
    },
  ];

  const quickActions = [
    {
      id: "book",
      title: "Book New Stay",
      icon: Plus,
      color: "bg-gradient-to-r from-pink-500 to-red-500",
    },
    {
      id: "cancel",
      title: "Cancel Booking",
      icon: Calendar,
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
    },
    {
      id: "refund",
      title: "Ask for Refund",
      icon: CreditCard,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2 * i,
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <title>Nivasa - Profile </title>

      <div className="min-h-fit w-full sm:max-w-[97vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[80vw]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-rose-300 via-pink to-orange-300 text-black border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.h1
                      className="text-3xl font-bold mb-2"
                      variants={container}
                      initial="hidden"
                      animate="visible"
                    >
                      {`👋 Welcome back, ${user?.firstName} ${user?.lastName}!`
                        .split("")
                        .map((char, index) => (
                          <motion.span key={index} variants={child}>
                            {char}
                          </motion.span>
                        ))}
                    </motion.h1>

                    <motion.p
                      className="text-lg pl-10"
                      variants={container}
                      initial="hidden"
                      animate="visible"
                      custom={2}
                    >
                      {"Ready for your next adventure? Your dashboard awaits."
                        .split("")
                        .map((char, index) => (
                          <motion.span key={index} variants={child}>
                            {char}
                          </motion.span>
                        ))}
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="hidden md:block"
                  >
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user?.avatar}
                          alt=""
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold text-gray-900 mb-4 flex items-center"
            >
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Quick Actions
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {quickActions.map((action) => (
                <motion.div
                  key={action.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={`w-full h-16 ${action.color} hover:opacity-90 text-white font-medium text-lg shadow-lg`}
                    onClick={() => console.log(`${action.title} clicked`)}
                  >
                    <action.icon className="w-5 h-5 mr-2" />
                    {action.title}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold text-gray-900 mb-6 flex items-center"
            >
              <Home className="w-6 h-6 mr-2 text-pink-500" />
              Your Dashboard
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardSections.map((section) => (
                <motion.div
                  key={section.id}
                  variants={itemVariants}
                  whileHover="hover"
                  onHoverStart={() => setActiveCard(section.id)}
                  onHoverEnd={() => setActiveCard(null)}
                >
                  <motion.div variants={cardHoverVariants}>
                    <Card
                      className="cursor-pointer transition-all duration-300 hover:shadow-xl border-0 shadow-md bg-white"
                      onClick={() => {
                        if (section.path) navigate(section.path); // ✅ Redirect on click
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${section.color}`}>
                            <section.icon className="w-6 h-6" />
                          </div>
                          <Badge className={`${section.badgeColor} border-0`}>
                            {section.badge}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {section.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {section.count}
                            </span>
                          </div>
                          <motion.div
                            animate={{
                              x: activeCard === section.id ? 4 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      action: "New booking confirmed",
                      location: "Cozy Cabin in Aspen",
                      time: "2 hours ago",
                      icon: Calendar,
                      color: "text-green-600",
                    },
                    {
                      action: "Message from host",
                      location: "Beach House in Malibu",
                      time: "1 day ago",
                      icon: MessageCircle,
                      color: "text-blue-600",
                    },
                    {
                      action: "Review submitted",
                      location: "Mountain Lodge in Whistler",
                      time: "3 days ago",
                      icon: Star,
                      color: "text-yellow-600",
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`p-2 rounded-full bg-gray-100 mr-4`}>
                        <activity.icon
                          className={`w-4 h-4 ${activity.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.location}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
