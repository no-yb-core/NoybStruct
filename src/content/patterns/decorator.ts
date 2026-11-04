import type { Pattern } from "./schema";

export const decorator: Pattern = {
  slug: "decorator",
  name: "Decorator",
  category: "structural",
  tagline: "Add responsibilities to an object dynamically by wrapping it.",

  introduction:
    "Decorator attaches additional responsibilities to an object dynamically. A decorator wraps a target object, implements the same interface, and adds behavior before, after, or around the wrapped call. Because decorators are ordinary objects that satisfy the same interface, they can be composed in any order, at runtime, without a subclass for every combination. It is the standard alternative to subclassing when behavior should be composable and reusable.",

  problem:
    "An HTTP client needs logging, retries, timeouts, and caching. Implementing all four inside a single class forces every caller to pay for all four; subclassing every combination (LoggedRetryCachedClient, CachedTimedClient, ...) produces a combinatorial explosion as new concerns are added. Concerns are not always wanted together — a public health check might skip retries, a batch job might skip logging.",

  solution:
    "Declare an `HttpClient` interface with a single `request()` method. `FetchClient` is the base implementation. `LoggingClient`, `RetryClient`, `TimeoutClient` each hold another `HttpClient` and add one behavior around the wrapped call. Callers compose the decorators they need: `new RetryClient(new LoggingClient(new FetchClient()))`. Adding a new behavior is one new class.",

  whenToUse: [
    "Responsibilities should be added or removed at runtime, per instance.",
    "Concerns are orthogonal and not always wanted together (logging, retry, cache, metrics, auth).",
    "Subclassing would explode combinatorially across orthogonal axes.",
    "Existing classes cannot be modified — decoration is a wrapper, not an edit.",
  ],

  whenNotToUse: [
    "The base object is used directly by type — decoration forces every caller to unwrap.",
    "The behavior is needed by every instance — put it in the base class or the factory.",
    "Decorators need access to internals the interface does not expose — the abstraction is leaking.",
  ],

  analogy:
    "Dressing for weather: a base shirt, then a sweater, then a raincoat. Each layer is added over what is already there, keeps you warm, and can be removed independently. You can wear just a shirt on a warm day, or all three in a storm — the same person, three different responsibilities.",

  diagram: {
    content: `classDiagram
    class HttpClient {
      <<interface>>
      +request(req) Promise~Response~
    }
    class FetchClient {
      +request(req)
    }
    class LoggingClient {
      -inner: HttpClient
      +request(req)
    }
    class RetryClient {
      -inner: HttpClient
      +request(req)
    }
    class TimeoutClient {
      -inner: HttpClient
      +request(req)
    }
    HttpClient <|.. FetchClient
    HttpClient <|.. LoggingClient
    HttpClient <|.. RetryClient
    HttpClient <|.. TimeoutClient
    LoggingClient --> HttpClient : wraps
    RetryClient --> HttpClient : wraps
    TimeoutClient --> HttpClient : wraps`,
    description:
      "UML class diagram: HttpClient is the common interface. FetchClient is the base implementation. LoggingClient, RetryClient, TimeoutClient each hold an HttpClient and add one behavior around request(). They compose in any order.",
  },

  example: {
    language: "ts",
    code: `interface HttpRequest {
  method: "GET" | "POST";
  url: string;
  body?: string;
}
interface HttpResponse {
  status: number;
  body: string;
}

interface HttpClient {
  request(req: HttpRequest): Promise<HttpResponse>;
}

class FetchClient implements HttpClient {
  async request(req: HttpRequest): Promise<HttpResponse> {
    const res = await fetch(req.url, { method: req.method, body: req.body });
    return { status: res.status, body: await res.text() };
  }
}

class LoggingClient implements HttpClient {
  constructor(private inner: HttpClient, private log: (m: string) => void) {}
  async request(req: HttpRequest): Promise<HttpResponse> {
    const start = Date.now();
    try {
      const res = await this.inner.request(req);
      this.log(\`\${req.method} \${req.url} \${res.status} \${Date.now() - start}ms\`);
      return res;
    } catch (err) {
      this.log(\`\${req.method} \${req.url} failed \${Date.now() - start}ms\`);
      throw err;
    }
  }
}

class RetryClient implements HttpClient {
  constructor(private inner: HttpClient, private attempts = 3) {}
  async request(req: HttpRequest): Promise<HttpResponse> {
    let lastError: unknown;
    for (let i = 0; i < this.attempts; i++) {
      try {
        return await this.inner.request(req);
      } catch (err) {
        lastError = err;
        if (i < this.attempts - 1) {
          await new Promise((r) => setTimeout(r, 2 ** i * 100));
        }
      }
    }
    throw lastError;
  }
}

class TimeoutClient implements HttpClient {
  constructor(private inner: HttpClient, private ms: number) {}
  request(req: HttpRequest): Promise<HttpResponse> {
    return Promise.race([
      this.inner.request(req),
      new Promise<HttpResponse>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), this.ms),
      ),
    ]);
  }
}

// Compose exactly what a given call site needs — order matters.
const client = new LoggingClient(
  new RetryClient(new TimeoutClient(new FetchClient(), 5_000)),
  console.log,
);

await client.request({ method: "GET", url: "https://api.example.com/users" });`,
    explanation:
      "Each decorator holds another HttpClient and adds one behavior around the wrapped call. The retry decorator re-invokes inner.request() on failure; timeout races the inner call against a timer; logging wraps timing around both. Order matters — logging outside retry records each final attempt, while logging inside records each individual attempt. Swapping behaviors is composition, not a new subclass, and the base FetchClient is unaware any of it is happening.",
  },

  advantages: [
    "Adds or removes responsibilities per instance, at runtime.",
    "Avoids combinatorial subclassing for orthogonal concerns.",
    "Decorators are individually testable — each wraps a fake inner.",
    "Order of composition is explicit at the call site, which documents intent.",
    "Existing classes can gain behavior without modification.",
  ],

  disadvantages: [
    "Produces many small wrapper classes, each with a delegation method.",
    "Debugging wrapped stacks is harder — the call is going through N layers.",
    "Every caller must decide the composition; a base class with sane defaults may be simpler for the common case.",
    "Decorators that need state shared across instances (e.g., a shared cache) must inject it explicitly.",
  ],

  related: [
    {
      slug: "adapter",
      note: "Both wrap a target. Adapter changes the interface, Decorator preserves it while adding behavior.",
    },
    {
      slug: "composite",
      note: "Both share the interface with the wrapped object. Composite aggregates many children; Decorator wraps exactly one.",
    },
    {
      slug: "proxy",
      note: "Both hold a target with the same interface. Proxy usually controls access (lazy loading, permissions, logging), while Decorator adds behavior — the intent is what distinguishes them.",
    },
    {
      slug: "strategy",
      note: "Decorator replaces itself with a wrapped object; Strategy replaces the algorithm the wrapped object uses. Both compose at runtime, at different layers.",
    },
  ],
};
