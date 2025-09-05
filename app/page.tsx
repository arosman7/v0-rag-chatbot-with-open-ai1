import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">RAG Chatbot</h1>
            <p className="text-muted-foreground">Ask questions about our knowledge base and get AI-powered answers</p>
          </div>
          <ChatInterface />
        </div>
      </div>
    </main>
  )
}
