import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";

// Path to your documents directory
const DOCUMENTS_DIR = path.join(process.cwd(), "data", "documents");

// Path for the cache file
const CACHE_PATH = path.join("/tmp", "embeddings-cache.json");

interface Cache {
  [filePath: string]: {
    lastModified: string;
    embeddedChunks: EmbeddedChunk[];
  };
}

class VectorStore {
  private embeddedChunks: EmbeddedChunk[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log("Initializing vector store...");

    // Ensure cache directory exists
    await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });

    const documents = await loadDocuments();
    const cache = await this.loadCache();
    const newEmbeddedChunks: EmbeddedChunk[] = [];

    for (const doc of documents) {
      const cachedDoc = cache[doc.filePath];

      if (cachedDoc && new Date(cachedDoc.lastModified) >= doc.lastModified) {
        console.log(`Loading embeddings from cache for ${doc.title}`);
        this.embeddedChunks.push(...cachedDoc.embeddedChunks);
      } else {
        console.log(`Generating new embeddings for ${doc.title}`);
        const chunks = processDocuments([doc]);
        const docEmbeddedChunks: EmbeddedChunk[] = [];

        for (const chunk of chunks) {
          try {
            const embedding = await generateEmbedding(chunk.content);
            const embeddedChunk = { ...chunk, embedding };
            docEmbeddedChunks.push(embeddedChunk);
            newEmbeddedChunks.push(embeddedChunk);
            console.log(`Generated embedding for chunk ${chunk.id}`);
          } catch (error) {
            console.error(`Failed to generate embedding for chunk ${chunk.id}:`, error);
          }
        }
        
        cache[doc.filePath] = {
          lastModified: doc.lastModified.toISOString(),
          embeddedChunks: docEmbeddedChunks,
        };
        this.embeddedChunks.push(...docEmbeddedChunks);
      }
    }

    if (newEmbeddedChunks.length > 0) {
      await this.saveCache(cache);
    }
    
    this.initialized = true;
    console.log(`Vector store initialized with ${this.embeddedChunks.length} chunks`);
  }

  private async loadCache(): Promise<Cache> {
    try {
      const data = await fs.readFile(CACHE_PATH, "utf-8");
      return JSON.parse(data) as Cache;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return {}; // Cache file doesn't exist yet
      }
      throw error;
    }
  }

  private async saveCache(cache: Cache): Promise<void> {
    await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
    console.log("Embeddings cache saved.");
  }

  getEmbeddedChunks(): EmbeddedChunk[] {
    return this.embeddedChunks;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
