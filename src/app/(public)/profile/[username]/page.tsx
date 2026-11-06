import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { getProfileDataByUsername } from "@/lib/db/profile";
import { ProfileView } from "@/components/profile/profile-view";

async function getCachedProfile(username: string) {
  "use cache";
  cacheLife({ revalidate: 30 });
  return getProfileDataByUsername(username);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const data = await getCachedProfile(username);
  if (!data) return { title: "Profile not found" };

  const title = `${data.user.name ?? username} on Noyb Struct`;
  const description = `${data.xp.level.current} · ${data.xp.total} XP · ${data.attempts.correct} challenges solved`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: data.user.image ? [{ url: data.user.image }] : undefined,
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getCachedProfile(username);
  if (!data) notFound();

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/profile/${username}`;

  return <ProfileView data={data} shareUrl={shareUrl} />;
}
