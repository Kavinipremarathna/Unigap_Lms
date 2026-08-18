export const testimonials = [
  {
    id: "t-1",
    name: "Amara Douglas",
    role: "Frontend Developer @ a fintech startup",
    quote:
      "The streak system is the only reason I actually finished a course this time. Thirty minutes a day added up faster than I expected.",
    avatarColor: "from-indigo-500 to-cyan-500",
  },
  {
    id: "t-2",
    name: "Rahul Mehta",
    role: "Career switcher, ex-teacher",
    quote:
      "I liked that it felt structured like Coursera but didn't feel like homework. The daily goal kept me consistent for three months straight.",
    avatarColor: "from-violet-500 to-pink-500",
  },
  {
    id: "t-3",
    name: "Elena Petrova",
    role: "Data Analyst",
    quote:
      "The learning companion nudges felt genuinely useful, not gimmicky — it told me exactly how close I was, not just 'keep going.'",
    avatarColor: "from-emerald-500 to-teal-500",
  },
];

export const pricingPlans = [
  {
    id: "plan-free",
    name: "Free",
    price: 0,
    period: "forever" as const,
    description: "Explore UNIGAP and build your first learning streak.",
    features: [
      "Access to free courses",
      "Daily goal & streak tracking",
      "Basic achievements",
      "Community support",
    ],
    cta: "Start Learning",
  },
  {
    id: "plan-monthly",
    name: "Pro Monthly",
    price: 19,
    period: "month" as const,
    description: "Full access for learners who want to move fast.",
    features: [
      "Unlimited course access",
      "Verified certificates",
      "AI learning companion",
      "Advanced progress analytics",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start Pro",
  },
  {
    id: "plan-annual",
    name: "Pro Annual",
    price: 149,
    period: "year" as const,
    description: "The best value for committed, long-term learners.",
    features: [
      "Everything in Pro Monthly",
      "2 months free vs. monthly",
      "Early access to new courses",
      "Team progress sharing",
    ],
    cta: "Start Pro Annual",
  },
];
