import type { Challenge } from "./schema";

export const paymentSdkIntegration: Challenge = {
  slug: "payment-sdk-integration",
  patternSlug: "adapter",
  difficulty: "beginner",
  scenario:
    "Your domain uses a Payment object (amount in dollars, currency, idempotency key). You must integrate a third-party SDK whose only entry point is sdk.processPayment(amountCents, currency). You cannot modify the SDK, and you do not want vendor-specific types leaking into your domain.",
  problem:
    "Direct calls to sdk.processPayment() from your domain scatter the SDK's API across the codebase. Swapping to a different vendor later means editing every call site. Domain code now also has to know about cents conversion and idempotency-loss.",
  codeSnippet: `const cents = Math.round(payment.amount * 100);
sdk.processPayment(cents, payment.currency);
// repeated at every call site, and the idempotency key is dropped`,
  options: ["adapter", "facade", "bridge", "proxy"],
  explanation:
    "Adapter wraps the SDK behind a domain-owned interface (e.g. PaymentGateway) and translates the call — including cents conversion and idempotency-key handling — in one place. Facade simplifies a subsystem; the SDK is one call, not many. Bridge splits a designed abstraction from a designed implementation; here the SDK's interface is fixed and foreign. Proxy controls access; there is no access policy here, only a translation.",
};
