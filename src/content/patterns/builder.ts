import type { Pattern } from "./schema";

export const builder: Pattern = {
  slug: "builder",
  name: "Builder",
  category: "creational",
  tagline: "Construct complex objects step by step, with a final validation.",

  introduction:
    "Builder separates the construction of a complex object from its representation, so the same construction process can produce different configurations. It replaces a long constructor or a loosely-typed options object with fluent step-by-step assembly and a `build()` that validates and freezes the result.",

  problem:
    "An HTTP client request can carry a method, URL, query parameters, headers, authentication, a body, a timeout, retries, and an abort signal — most of them optional. A constructor with a dozen optional parameters is unreadable at the call site; a loose `options: Record<string, unknown>` loses type checking and cannot enforce invariants (for example, that a body is only present on methods that permit one).",

  solution:
    "Introduce an `HttpRequestBuilder` with a fluent method per configurable part. Each method returns `this`, accumulates state, and a terminal `build()` validates invariants and returns an immutable `HttpRequest`. The builder is mutable and throwaway; the request is immutable and safe to share.",

  whenToUse: [
    "An object has many optional parameters, and a constructor call is hard to read.",
    "Construction must enforce invariants that a plain options object cannot express.",
    "The same construction process should produce slightly different representations.",
    "An object's configuration is assembled incrementally in code (tests, scripts, integrations).",
  ],

  whenNotToUse: [
    "The object has a small, fixed set of parameters — a plain constructor is clearer.",
    "Construction is a single, non-configurable step — a factory function is lighter.",
    "The fluent API would obscure an already-simple object; builders on trivial types are noise.",
  ],

  analogy:
    "Ordering a coffee at a counter: the barista builds the drink step by step — pick a size, choose a milk, add a shot, add a syrup — and only at the end hands you the finished cup. Each choice narrows the result, and the drink is what it is once it is served.",

  diagram: {
    content: `classDiagram
    class HttpRequest {
      <<immutable>>
      +method: HttpMethod
      +url: string
      +headers: Record~string,string~
      +body?: Body
      +timeoutMs: number
    }
    class HttpRequestBuilder {
      -config: Partial~HttpRequestConfig~
      +url(u) HttpRequestBuilder
      +method(m) HttpRequestBuilder
      +header(k, v) HttpRequestBuilder
      +body(b) HttpRequestBuilder
      +timeout(ms) HttpRequestBuilder
      +build() HttpRequest
    }
    HttpRequestBuilder ..> HttpRequest`,
    description:
      "UML class diagram: HttpRequestBuilder exposes a fluent method per configurable part and returns itself for chaining. Its build() method validates invariants and constructs an immutable HttpRequest.",
  },

  example: {
    language: "ts",
    code: `type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface HttpRequestConfig {
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
  timeoutMs: number;
}

class HttpRequest {
  private constructor(readonly config: Readonly<HttpRequestConfig>) {}

  static builder(): HttpRequestBuilder {
    return new HttpRequestBuilder();
  }

  /** @internal — only HttpRequestBuilder constructs requests. */
  static _create(config: HttpRequestConfig): HttpRequest {
    return new HttpRequest(Object.freeze(config));
  }
}

class HttpRequestBuilder {
  private config: Partial<HttpRequestConfig> = {};
  private headers: Record<string, string> = {};

  url(value: string): this {
    this.config.url = value;
    return this;
  }

  method(value: HttpMethod): this {
    this.config.method = value;
    return this;
  }

  header(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  body(value: string): this {
    this.config.body = value;
    return this;
  }

  timeout(ms: number): this {
    if (ms <= 0) throw new Error("timeout must be positive");
    this.config.timeoutMs = ms;
    return this;
  }

  build(): HttpRequest {
    if (!this.config.url) throw new Error("url is required");

    const method = this.config.method ?? "GET";
    const hasBody = this.config.body !== undefined;
    if (hasBody && (method === "GET" || method === "DELETE")) {
      throw new Error(\`\${method} requests must not carry a body\`);
    }

    return HttpRequest._create({
      method,
      url: this.config.url,
      headers: { ...this.headers },
      body: this.config.body,
      timeoutMs: this.config.timeoutMs ?? 30_000,
    });
  }
}

// Call sites read like a sentence; invariants live in build().
const request = HttpRequest.builder()
  .url("https://api.example.com/v1/users")
  .method("POST")
  .header("Content-Type", "application/json")
  .body(JSON.stringify({ name: "Ada" }))
  .timeout(10_000)
  .build();`,
    explanation:
      "The call site is linear and readable, defaults are applied once in build(), and invariants (URL present, no body on GET) are enforced regardless of how the builder was driven. The built HttpRequest is frozen — sharing it is safe. The same builder can produce different configurations by varying the method chain, and tests can build minimal or exhaustive requests with equal clarity.",
  },

  advantages: [
    "Call sites read as named steps, not positional parameters.",
    "Defaults and validation are centralized in build(), not scattered across callers.",
    "The built object can be immutable while the builder stays mutable and throwaway.",
    "Supports incremental assembly across several code paths (helpers, scripts, tests).",
  ],

  disadvantages: [
    "Introduces a builder class per complex object.",
    "Fluent APIs can obscure plain construction in trivial cases.",
    "A mutable builder shared accidentally between threads or async tasks is dangerous — builders should be single-owner.",
  ],

  related: [
    {
      slug: "abstract-factory",
      note: "Both build complex results. Abstract Factory returns a family of parts in one call; Builder assembles one object step by step and validates at the end.",
    },
    {
      slug: "composite",
      note: "Builders are often used to build Composite trees step by step without exposing the tree's node type hierarchy.",
    },
    {
      slug: "template-method",
      note: "Builder externalizes the construction steps; Template Method internalizes them in a fixed sequence. Both separate the algorithm from its concrete result.",
    },
  ],
};