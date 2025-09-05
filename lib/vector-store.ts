import { processDocuments } from "./documents"
import { generateEmbedding, type EmbeddedChunk } from "./embeddings"

class VectorStore {
  private embeddedChunks: EmbeddedChunk[] = []
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    console.log("Initializing vector store...")
    const chunks = processDocuments()

    // Generate embeddings for all chunks
    const embeddedChunks: EmbeddedChunk[] = []

    for (const chunk of chunks) {
      try {
        const embedding = await generateEmbedding(chunk.content)
        embeddedChunks.push({
          ...chunk,
          embedding,
        })
        console.log(`Generated embedding for chunk ${chunk.id}`)
      } catch (error) {
        console.error(`Failed to generate embedding for chunk ${chunk.id}:`, error)
      }
    }

    this.embeddedChunks = embeddedChunks
    this.initialized = true
    console.log(`Vector store initialized with ${this.embeddedChunks.length} chunks`)
  }

  getEmbeddedChunks(): EmbeddedChunk[] {
    return this.embeddedChunks
  }

  isInitialized(): boolean {
    return this.initialized
  }
}

// Singleton instance
export const vectorStore = new VectorStore()
