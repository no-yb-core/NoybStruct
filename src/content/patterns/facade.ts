import type { Pattern } from "./schema";

export const facade: Pattern = {
  slug: "facade",
  name: "Facade",
  category: "structural",
  tagline: "Simplify a complex subsystem behind one coherent interface.",

  introduction:
    "Facade provides a unified, higher-level interface to a set of interfaces in a subsystem. It does not hide the subsystem — callers who need direct access still have it — but it defines a common entry point that handles the typical case correctly. Facade is what turns a dozen interrelated services with mandatory ordering and retry logic into one method that does the right thing.",

  problem:
    "Uploading and publishing a video requires: presign the upload, put the file in blob storage, probe the media for duration and codecs, transcode to three renditions, generate a thumbnail, register the asset in the database, and emit a 'published' event. Getting any of these out of order, or retrying the wrong one, corrupts the catalog. Every caller — the CLI, the admin panel, the mobile upload endpoint — re-implements the same orchestration and inevitably drifts from the others.",

  solution:
    "Introduce a `VideoPublisher` facade with a single `publish(sourceUrl)` method. It owns the orchestration: presign → upload → probe → transcode → thumbnail → register → emit. Callers use the facade and get consistent behavior; escape hatches exist for the handful of callers that genuinely need to run one step in isolation, but the common case is one call.",

  whenToUse: [
    "A subsystem has many classes with mandatory ordering or protocol that callers routinely get wrong.",
    "You want to provide a simple default for the common case while leaving the subsystem accessible.",
    "Multiple entry points (CLI, HTTP, jobs) share the same orchestration and are drifting apart.",
    "You want to layer the system — a stable outer surface, an internal surface that can change.",
  ],

  whenNotToUse: [
    "The subsystem is already simple — a facade just adds an indirection.",
    "Every caller needs a different sequence — a shared facade will not fit and will be bypassed.",
    "The facade would start to contain business logic of its own instead of orchestrating subsystem calls.",
  ],

  analogy:
    "A restaurant ordering counter: you say 'one chicken burrito' and get a fully assembled meal. Behind the counter, five stations (grill, rice, prep, wrap, expo) run in parallel with their own rules. You do not negotiate with each station — the counter provides a single, coherent interface to the whole kitchen.",

  diagram: {
    content: `classDiagram
    class VideoPublisher {
      -storage: StorageService
      -transcoder: Transcoder
      -assets: AssetRepository
      -events: EventBus
      +publish(sourceUrl) AssetId
    }
    class StorageService {
      +presign(key) string
      +put(key, body)
    }
    class Transcoder {
      +probe(url) MediaInfo
      +transcode(url, preset) Rendition[]
    }
    class AssetRepository {
      +register(asset) AssetId
    }
    class EventBus {
      +emit(name, payload)
    }
    VideoPublisher --> StorageService
    VideoPublisher --> Transcoder
    VideoPublisher --> AssetRepository
    VideoPublisher --> EventBus`,
    description:
      "UML class diagram: VideoPublisher is the facade. It holds references to StorageService, Transcoder, AssetRepository, and EventBus, and its publish() method orchestrates them in the correct order. Callers depend on VideoPublisher, not on the four subsystem classes.",
  },

  example: {
    language: "ts",
    code: `interface StorageService {
  presign(key: string): Promise<string>;
  put(key: string, body: Buffer): Promise<void>;
}
interface Transcoder {
  probe(url: string): Promise<{ durationMs: number; width: number; height: number }>;
  transcode(url: string, preset: "720p" | "1080p" | "4k"): Promise<string>;
}
interface AssetRepository {
  register(asset: { key: string; renditions: string[]; durationMs: number }): Promise<string>;
}
interface EventBus {
  emit(name: string, payload: Record<string, unknown>): Promise<void>;
}

class VideoPublisher {
  constructor(
    private readonly storage: StorageService,
    private readonly transcoder: Transcoder,
    private readonly assets: AssetRepository,
    private readonly events: EventBus,
  ) {}

  async publish(sourceUrl: string): Promise<string> {
    // 1. Copy the source into our bucket — we own the canonical asset.
    const key = \`sources/\${crypto.randomUUID()}.mp4\`;
    const uploadUrl = await this.storage.presign(key);
    await this.storage.put(key, await download(sourceUrl));

    // 2. Probe once; the info drives transcoding and registration.
    const info = await this.transcoder.probe(uploadUrl);

    // 3. Transcode in parallel — they are independent.
    const [p720, p1080, p4k] = await Promise.all([
      this.transcoder.transcode(uploadUrl, "720p"),
      this.transcoder.transcode(uploadUrl, "1080p"),
      this.transcoder.transcode(uploadUrl, "4k"),
    ]);

    // 4. Register, then announce. Order matters: emit only after registration.
    const assetId = await this.assets.register({
      key,
      renditions: [p720, p1080, p4k],
      durationMs: info.durationMs,
    });
    await this.events.emit("video.published", { assetId, key });
    return assetId;
  }
}

// Callers — CLI, HTTP endpoint, batch job — all use one method.
await publisher.publish("https://external.example.com/incoming.mp4");`,
    explanation:
      "VideoPublisher owns the ordering (upload → probe → transcode → register → emit), the parallelism (three transcodes), and the error ordering (emit only after registration). The subsystem classes are still available — the transcoder can be called directly when a batch job needs a one-off rendition — but the common path is one method. Adding a subtitle-generation step means editing VideoPublisher once, not every caller.",
  },

  advantages: [
    "One entry point for a routine that must be orchestrated consistently.",
    "Callers no longer duplicate ordering and error-handling logic.",
    "The subsystem remains accessible — the facade is not a wall.",
    "Subsystem changes (adding a rendition, changing the event name) happen in one place.",
  ],

  disadvantages: [
    "Facade can become a God object if it accumulates orchestration for every scenario.",
    "It is tempting to put business logic in the facade — it should orchestrate, not decide.",
    "Callers with genuinely different orchestration must bypass it, which reintroduces duplication.",
  ],

  related: [
    {
      slug: "adapter",
      note: "Adapter changes one interface to another; Facade provides a simpler interface over many. Adapter is 1:1, Facade is 1:many.",
    },
    {
      slug: "mediator",
      note: "Both centralize coordination. Facade centralizes calls from clients to a subsystem; Mediator centralizes calls among peers. Facade does not add behavior, Mediator often does.",
    },
    {
      slug: "singleton",
      note: "A facade is sometimes implemented as a Singleton (one entry point per process), but the two solve different problems and should not be conflated.",
    },
  ],
};
