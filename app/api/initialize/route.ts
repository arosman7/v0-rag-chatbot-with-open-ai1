import { NextResponse } from "next/server"
import { vectorStore } from "@/lib/vector-store"

export async function POST() {
  try {
    if (!vectorStore.isInitialized()) {
      await vectorStore.initialize()
      return NextResponse.json({
        message: "Vector store initialized successfully",
        chunksCount: vectorStore.getEmbeddedChunks().length,
      })
    } else {
      return NextResponse.json({
        message: "Vector store already initialized",
        chunksCount: vectorStore.getEmbeddedChunks().length,
      })
    }
  } catch (error) {
    console.error("Error initializing vector store:", error)
    return NextResponse.json({ error: "Failed to initialize vector store" }, { status: 500 })
  }
}
