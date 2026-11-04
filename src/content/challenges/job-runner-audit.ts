import type { Challenge } from "./schema";

export const jobRunnerAudit: Challenge = {
  slug: "job-runner-audit",
  patternSlug: "command",
  difficulty: "intermediate",
  scenario:
    "A CI system must support: scheduling a job for later, retrying a failed run, and showing an audit log of every action taken. The scheduling, retry, and audit layers must not depend on the specific job implementations (build, deploy, notify, backup).",
  problem:
    "The scheduler currently calls each job's method directly (build.run(), deploy.run()), which means the scheduler must know every job type. Retries and audit are implemented separately by each job, so they diverge. Adding a new job type touches the scheduler, the retry engine, and the audit log.",
  codeSnippet: `if (job.type === "build") build.run();
else if (job.type === "deploy") deploy.run();
else if (job.type === "notify") notify.run();
// retry and audit duplicated inside each job`,
  options: ["command", "memento", "state", "chain-of-responsibility"],
  explanation:
    "Command wraps each job as an object with execute()/undo() — the scheduler now handles a generic Command, and retry, audit, and queueing operate on Commands without knowing job types. Adding a job is a new class; the scheduler is untouched. Memento captures state for restoration — the problem is not undo. State changes an object's behavior as its state changes — not applicable. Chain of Responsibility forwards a request until one handler takes it — here every action must run, not pass through.",
};
