import type { Pattern } from "./schema";

export const chainOfResponsibility: Pattern = {
  slug: "chain-of-responsibility",
  name: "Chain of Responsibility",
  category: "behavioral",
  tagline: "Pass a request along a chain until one handler takes it.",

  introduction:
    "Chain of Responsibility passes a request along a chain of handlers, each of which decides whether to handle it, transform it, or pass it on. The sender does not know which handler will process the request — it just calls the head of the chain. This is the pattern behind HTTP middleware, exception propagation, and any pipeline where handlers can be added, removed, or reordered without touching the sender.",

  problem:
    "An HTTP service must enforce authentication, rate limiting, request logging, and admin-only routes. If each rule is written inline at every route handler, the rules drift, some routes accidentally skip auth, and adding a fifth rule (say, feature-flag gating) means editing every route. The rules are orthogonal and ordered — auth before rate limiting, logging around everything — and they apply to requests, not to individual business methods.",

  solution:
    "Define a `Middleware` interface with `handle(req, next)`. Each middleware does its job, optionally short-circuits (return a response without calling next), and calls `next(req)` to pass to the following handler. Compose them into a chain: logger → auth → rateLimiter → routeHandler. The route handler is just the last element in the chain. Adding a middleware is one new class, inserted in the chain at composition time.",

  whenToUse: [
    "Multiple handlers may handle a request, and which one is not known in advance.",
    "Handlers are orthogonal concerns (auth, logging, rate limiting, CORS, compression).",
    "Order of handlers matters and should be explicit at composition time.",
    "A handler may short-circuit — return a response without further processing.",
  ],

  whenNotToUse: [
    "Every request must be handled by exactly one known handler — a switch is clearer.",
    "Handlers do not share an interface — the chain becomes an untyped pipeline.",
    "There is only one handler, or the chain is never reconfigured — a direct call is simpler.",
    "Guaranteed handling is required and the chain may fall off the end — Command or a direct dispatch is better.",
  ],

  analogy:
    "A customer support ticket travels up the chain: level 1 tries to resolve it, level 2 tries if level 1 cannot, and it reaches an engineer only if nobody else can handle it. Each level sees the ticket, decides whether it can handle it, and either resolves it or escalates. The customer only knows they filed a ticket — not who handled it.",

  diagram: {
    content: `classDiagram
    class Handler {
      <<interface>>
      +handle(req: Request): Promise~Response~
    }
    class Logger
    class Auth
    class RateLimiter
    class RouteHandler
    class Chain {
      +handle(req)
    }
    Handler <|.. Logger
    Handler <|.. Auth
    Handler <|.. RateLimiter
    Handler <|.. RouteHandler
    Chain --> Handler : head of chain
    Logger --> Handler : next
    Auth --> Handler : next
    RateLimiter --> Handler : next`,
    description:
      "UML class diagram: Handler is the common interface. Each middleware holds a reference to its successor and decides whether to short-circuit or forward. The route handler is the terminal element of the chain. Chain holds the head; the composition order is the runtime semantics.",
  },

  example: {
    language: "ts",
    code: `interface Request {
  method: string;
  path: string;
  headers: Record<string, string>;
  user?: { id: string; role: "user" | "admin" };
}
interface Response {
  status: number;
  body: string;
}

type Handler = (req: Request) => Promise<Response>;
type Middleware = (next: Handler) => Handler;

const logger: Middleware = (next) => async (req) => {
  const start = Date.now();
  const res = await next(req);
  console.log(\`\${req.method} \${req.path} \${res.status} \${Date.now() - start}ms\`);
  return res;
};

const auth: Middleware = (next) => async (req) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return { status: 401, body: "unauthorized" };
  // pretend verification
  req.user = { id: "u-1", role: token === "admin-token" ? "admin" : "user" };
  return next(req);
};

const rateLimiter: Middleware = (next) => async (req) => {
  // pretend limiter
  return next(req);
};

const requireAdmin: Middleware = (next) => async (req) => {
  if (req.user?.role !== "admin") {
    return { status: 403, body: "forbidden" };
  }
  return next(req);
};

const routeHandler: Handler = async (req) => ({
  status: 200,
  body: \`hello \${req.user?.id} at \${req.path}\`,
});

// Compose the chain — order is the semantics.
function compose(...middlewares: Middleware[]): Handler {
  return middlewares.reduceRight((next, mw) => mw(next), routeHandler);
}

const handler = compose(logger, auth, rateLimiter, requireAdmin);
const res = await handler({
  method: "GET",
  path: "/admin/stats",
  headers: { authorization: "Bearer admin-token" },
});`,
    explanation:
      "Every middleware is a function from handler to handler — the chain is composed by function composition. Logger wraps every request regardless of outcome (it runs *before* next and *after* the response), auth short-circuits with 401 if the token is missing, requireAdmin short-circuits with 403 if the user is not an admin. Because the chain is built at composition time, replacing the rate limiter with a real one or inserting a new middleware does not touch any other file. The route handler is unaware it is at the end of a chain.",
  },

  advantages: [
    "Handlers are independent and composable — adding a rule is a new function.",
    "Order is explicit at composition time, not implicit in code review.",
    "Handlers can short-circuit, transform, or forward — the chain is flexible.",
    "Each handler is tested in isolation with a stub next.",
  ],

  disadvantages: [
    "Guaranteed handling is not enforced — a request may fall off the end if no handler takes it.",
    "Debugging a long chain is harder — the request goes through N functions before the response.",
    "Implicit state on the request object (like req.user above) can become a hidden protocol between middlewares.",
    "Handlers that short-circuit may skip important later steps — the composition order is a real contract.",
  ],

  related: [
    {
      slug: "command",
      note: "Both turn requests into objects or functions. Command encapsulates one request for one receiver; Chain lets a request be handled by any of several. A chain is often invoked by a command.",
    },
    {
      slug: "mediator",
      note: "Both route requests. Chain forwards along a fixed sequence until handled; Mediator centralizes many-to-many communication into one hub. Chain is linear, Mediator is star-shaped.",
    },
    {
      slug: "decorator",
      note: "Structurally similar — both wrap a target and add behavior. Decorator adds behavior unconditionally around one target; Chain of Responsibility conditionally forwards to one of several potential handlers.",
    },
  ],
};
