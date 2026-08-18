import { achievements } from "@/lib/mock/achievements";
import { Achievement } from "@/lib/types";

export async function getAchievements(): Promise<Achievement[]> {
  return achievements;
}

export async function getUnlockedAchievements(): Promise<Achievement[]> {
  return achievements.filter((a) => a.unlocked);
}
