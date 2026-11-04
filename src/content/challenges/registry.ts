import type { Challenge } from "./schema";
import { notificationsFanOut } from "./notifications-fan-out";
import { paymentSdkIntegration } from "./payment-sdk-integration";
import { jobRunnerAudit } from "./job-runner-audit";
import { dataExportWorkflow } from "./data-export-workflow";
import { compilerAnalysisPasses } from "./compiler-analysis-passes";
import { signupDialogCoordination } from "./signup-dialog-coordination";

const challenges: readonly Challenge[] = [
  notificationsFanOut,
  paymentSdkIntegration,
  jobRunnerAudit,
  dataExportWorkflow,
  compilerAnalysisPasses,
  signupDialogCoordination,
];

export function getAllChallenges(): readonly Challenge[] {
  return challenges;
}

export function getChallenge(slug: string): Challenge | undefined {
  return challenges.find((c) => c.slug === slug);
}

export function getChallengesByDifficulty(
  difficulty: Challenge["difficulty"],
): readonly Challenge[] {
  return challenges.filter((c) => c.difficulty === difficulty);
}
