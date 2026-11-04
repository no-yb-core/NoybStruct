import type { Pattern } from "./schema";

export const proxy: Pattern = {
  slug: "proxy",
  name: "Proxy",
  category: "structural",
  tagline: "Stand in for another object to control access to it.",

  introduction:
    "Proxy provides a surrogate or placeholder for another object to control access to it. The proxy implements the same interface as the real subject, holds a reference to it, and decides when and how to forward each call. The three classic use cases are lazy initialization (virtual proxy), access control (protection proxy), and access routing (remote proxy) — but the underlying shape is identical: intercept the call, do something around it, maybe forward it.",

  problem:
    "A dashboard displays a user's large avatar on page load, but the same page also shows a dozen small avatars in a comment thread. Loading the full-size avatar for every user costs bandwidth and blocks the first paint. The avatar is a plain `<img>` referring to a full-resolution URL, and the naive fix — conditionally rendering a low-res version — scatters that decision across every callsite. Meanwhile, the same avatar endpoint must reject requests from users who lack permission to view a private avatar — logic that does not belong in the `<img>`.",

  solution:
    "Introduce an `Avatar` interface with a `render()` method. `RemoteAvatar` is the real subject that loads and renders the image. `LazyAvatar` (a virtual proxy) defers loading until render is called. `PermissionProxy` (a protection proxy) checks authorization before delegating. Both implement `Avatar`, so callers work with any of them — and stacks of proxies can compose the concerns.",

  whenToUse: [
    "Deferring expensive initialization until the subject is actually used (virtual proxy).",
    "Enforcing access control without changing the subject or its callers (protection proxy).",
    "Routing calls to a remote or differently-hosted object transparently (remote proxy).",
    "Caching or coalescing calls before they reach the subject.",
  ],

  whenNotToUse: [
    "The subject is cheap and no policy is needed — a proxy adds a layer for nothing.",
    "The proxy needs to expose methods the interface does not have — that is Decorator or Adapter territory.",
    "The 'control' is one conditional — put it at the call site instead of in a new class.",
  ],

  analogy:
    "A celebrity's assistant stands between the public and the celebrity. Calls come in through the assistant, who screens them, answers routine questions, and only escalates to the celebrity when necessary. The assistant implements the same 'reach the celebrity' interface, but controls how and when the actual person is involved.",

  diagram: {
    content: `classDiagram
    class Avatar {
      <<interface>>
      +render() Promise~RenderedAvatar~
    }
    class RemoteAvatar {
      -url: string
      +render() Promise~RenderedAvatar~
    }
    class LazyAvatar {
      -real?: RemoteAvatar
      +render() Promise~RenderedAvatar~
    }
    class PermissionProxy {
      -real: Avatar
      -viewer: User
      +render() Promise~RenderedAvatar~
    }
    Avatar <|.. RemoteAvatar
    Avatar <|.. LazyAvatar
    Avatar <|.. PermissionProxy
    LazyAvatar --> RemoteAvatar
    PermissionProxy --> Avatar`,
    description:
      "UML class diagram: Avatar is the interface. RemoteAvatar is the real subject. LazyAvatar defers construction until render() is called. PermissionProxy checks the viewer before delegating. All three implement Avatar, so callers can use any of them interchangeably.",
  },

  example: {
    language: "ts",
    code: `interface RenderedAvatar {
  data: Buffer;
  contentType: "image/png" | "image/jpeg";
}

interface Avatar {
  render(): Promise<RenderedAvatar>;
}

class RemoteAvatar implements Avatar {
  constructor(private readonly url: string) {}

  async render(): Promise<RenderedAvatar> {
    const res = await fetch(this.url);
    return {
      data: Buffer.from(await res.arrayBuffer()),
      contentType: res.headers.get("content-type") === "image/png"
        ? "image/png"
        : "image/jpeg",
    };
  }
}

class LazyAvatar implements Avatar {
  private real?: RemoteAvatar;

  constructor(private readonly url: string) {}

  async render(): Promise<RenderedAvatar> {
    if (!this.real) {
      this.real = new RemoteAvatar(this.url);
    }
    return this.real.render();
  }
}

class PermissionProxy implements Avatar {
  constructor(
    private readonly real: Avatar,
    private readonly viewer: { id: string },
    private readonly canView: (viewerId: string, avatarUrl: string) => Promise<boolean>,
    private readonly avatarUrl: string,
  ) {}

  async render(): Promise<RenderedAvatar> {
    if (!(await this.canView(this.viewer.id, this.avatarUrl))) {
      throw new Error("forbidden");
    }
    return this.real.render();
  }
}

// Stack the proxies — lazy loading and permission, in that order.
const avatar: Avatar = new PermissionProxy(
  new LazyAvatar("https://cdn.example.com/user/123.png"),
  { id: "viewer-7" },
  canView,
  "https://cdn.example.com/user/123.png",
);

const rendered = await avatar.render();`,
    explanation:
      "LazyAvatar defers the expensive download until the first render — most users never see the full-size avatar, and for them the network cost is zero. PermissionProxy checks authorization before the download happens at all — a denied request never even reaches the CDN. Both implement Avatar, so a callsite can pass any of them, and the concerns compose: a private comment thread's avatars go through both, a public dashboard's avatars through only the lazy one.",
  },

  advantages: [
    "Defers expensive work until it is actually needed.",
    "Enforces access control without changing the subject or its callers.",
    "Proxies compose — lazy + permission + cache can stack.",
    "The subject stays focused; cross-cutting concerns live in the proxy.",
  ],

  disadvantages: [
    "Adds an indirection layer for every call.",
    "The proxy's added latency (e.g., an extra remote call for permission) can be surprising.",
    "Debugging through stacked proxies is harder — the call may go through N layers.",
    "Proxies that need to see inside the subject must break encapsulation, which is usually a sign the abstraction is wrong.",
  ],

  related: [
    {
      slug: "decorator",
      note: "Both wrap a target with the same interface. Decorator adds behavior; Proxy controls access. Structurally similar, distinguished by intent — decorator composes behavior, proxy governs who and when.",
    },
    {
      slug: "adapter",
      note: "Adapter changes the interface to match what the client expects; Proxy preserves it while intercepting the call.",
    },
    {
      slug: "facade",
      note: "Facade simplifies many interfaces; Proxy stands in for one. Facade is often 1:many; Proxy is 1:1.",
    },
  ],
};
