import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { vectorStore } from "@/lib/vector-store"
import { generateEmbedding, findSimilarChunks } from "@/lib/embeddings"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey })

    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    // Initialize vector store if not already done
    if (!vectorStore.isInitialized()) {
      await vectorStore.initialize()
    }

    // Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(message)

    // Find similar chunks from the knowledge base
    const embeddedChunks = vectorStore.getEmbeddedChunks()
    const similarChunks = findSimilarChunks(queryEmbedding, embeddedChunks, 3)

    // Prepare context from retrieved chunks
    const context = similarChunks
      .map((chunk) => `Document: ${chunk.metadata.title}\nContent: ${chunk.content}`)
      .join("\n\n---\n\n")

    // Create the system prompt with context
    const systemPrompt = `You are an expert assistant. 
    Your knowledge base consists of the following documents. Answer the user's questions directly and confidently, as if this information is your own. Do not refer to "the provided context" or "the documents."

Knowledge Base:
${context}

If the user's question cannot be answered using your knowledge base, simply state that you don't have information on that topic.`


    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || "I apologize, but I was unable to generate a response."

    // Log for debugging (remove in production)
    console.log(`[RAG] Query: ${message}`)
    console.log(`[RAG] Found ${similarChunks.length} similar chunks`)
    console.log(`[RAG] Similarities: ${similarChunks.map((c) => c.similarity.toFixed(3)).join(", ")}`)

    return NextResponse.json({
      response,
      sources: similarChunks.map((chunk) => ({
        title: chunk.metadata.title,
        similarity: chunk.similarity,
      })),
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
