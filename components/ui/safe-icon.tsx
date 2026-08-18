"use client";

import React from "react";
import {
  BookOpen,
  Code2,
  Terminal,
  BarChart3,
  Cloud,
  BrainCircuit,
  ShieldCheck,
  Database,
  PenTool,
  Workflow,
  Compass,
  GitBranch,
  Rocket,
  Flame,
  Brain,
  Target,
  GraduationCap,
  TrendingUp,
  Moon,
  Award,
  Star,
  Trophy,
  Sparkles,
  Clock,
  Users,
  Check,
  CheckCircle2,
  Search,
  Lock,
  Unlock,
  PlayCircle,
  FileQuestion,
  FileCheck,
  Zap,
  PartyPopper,
  CreditCard,
  CheckCheck,
  Layers,
  HelpCircle,
  MessageSquare,
  Bell,
  Eye,
  Download,
  Plus,
  ArrowRight,
  Shield,
  Laptop,
  Cpu,
  Globe,
  LucideProps,
  LucideIcon,
} from "lucide-react";

// Explicit icon registry to bypass Next.js modularizeImports tree-shaking
const iconRegistry: Record<string, LucideIcon> = {
  // Category Icons
  Code2,
  Terminal,
  BarChart3,
  Cloud,
  BrainCircuit,
  ShieldCheck,
  Database,
  PenTool,
  Workflow,
  Compass,
  GitBranch,
  Laptop,
  Cpu,
  Globe,

  // Achievement Icons
  Rocket,
  Flame,
  BookOpen,
  Brain,
  Target,
  GraduationCap,
  TrendingUp,
  Moon,
  Award,
  Star,
  Trophy,
  Sparkles,
  Zap,
  PartyPopper,
  CreditCard,

  // Common UI Icons
  Clock,
  Users,
  Check,
  CheckCircle2,
  CheckCheck,
  Search,
  Lock,
  Unlock,
  PlayCircle,
  FileQuestion,
  FileCheck,
  Layers,
  HelpCircle,
  MessageSquare,
  Bell,
  Eye,
  Download,
  Plus,
  ArrowRight,
  Shield,
};

export function getSafeIcon(name?: string, fallback: LucideIcon = BookOpen): LucideIcon {
  if (!name) return fallback;
  const match = iconRegistry[name];
  if (match) return match;

  // Case-insensitive lookup fallback
  const normalizedKey = Object.keys(iconRegistry).find(
    (k) => k.toLowerCase() === name.toLowerCase()
  );
  if (normalizedKey && iconRegistry[normalizedKey]) {
    return iconRegistry[normalizedKey];
  }

  return fallback;
}

export interface SafeIconProps extends LucideProps {
  name?: string;
  fallback?: LucideIcon;
}

export function SafeIcon({ name, fallback = BookOpen, ...props }: SafeIconProps) {
  const IconComponent = getSafeIcon(name, fallback);
  return <IconComponent {...props} />;
}
