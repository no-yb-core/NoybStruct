import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfileData } from "@/lib/db/profile";
import { ProfileView } from "@/components/profile/profile-view";

export const instant = false;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const data = await getProfileData(session.user.id);
  if (!data) redirect("/login");

  const shareUrl = data.user.githubUsername
    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/profile/${data.user.githubUsername}`
    : null;

  return <ProfileView data={data} shareUrl={shareUrl} />;
}
