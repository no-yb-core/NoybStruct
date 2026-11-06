import { prisma } from "@/lib/prisma";
import { levelProgress, type LevelProgress } from "@/lib/xp/levels";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string | null;
  image: string | null;
  githubUsername: string | null;
  totalXp: number;
  level: LevelProgress;
};

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const rows = await prisma.xpTransaction.groupBy({
    by: ["userId"],
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: limit,
  });

  const userIds = rows.map((r) => r.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, image: true, githubUsername: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  return rows.map((row, index) => {
    const user = userMap.get(row.userId);
    const totalXp = row._sum.amount ?? 0;
    return {
      rank: index + 1,
      userId: row.userId,
      name: user?.name ?? null,
      image: user?.image ?? null,
      githubUsername: user?.githubUsername ?? null,
      totalXp,
      level: levelProgress(totalXp),
    };
  });
}
