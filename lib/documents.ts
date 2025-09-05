import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";

// Path to your documents directory
const DOCUMENTS_DIR = path.join(process.cwd(), "data", "documents");

export interface Document {
  id: string;
  title: string;
  content: string;
  filePath: string;
  lastModified: Date;
}

// Loads documents from the specified directory
export async function loadDocuments(): Promise<Document[]> {
  try {
    const files = await fs.readdir(DOCUMENTS_DIR);
    const docxFiles = files.filter((file) => path.extname(file).toLowerCase() === ".docx");

    const documents: Document[] = [];

    for (const file of docxFiles) {
      const filePath = path.join(DOCUMENTS_DIR, file);
      const stats = await fs.stat(filePath);
      const result = await mammoth.extractRawText({ path: filePath });
      
      documents.push({
        id: file, // Using filename as a unique ID
        title: path.basename(file, ".docx"),
        content: result.value,
        filePath: filePath,
        lastModified: stats.mtime,
      });
    }

    return documents;
  } catch (error) {
    console.error("Error loading documents:", error);
    // If the directory doesn't exist, return an empty array.
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}


// Text chunking utility (remains the same)
export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }

  return chunks;
}

// Process documents into chunks with metadata
export function processDocuments(documents: Document[]) {
  const processedChunks: Array<{
    id: string;
    content: string;
    metadata: {
      documentId: string;
      title: string;
      chunkIndex: number;
    };
  }> = [];

  documents.forEach((doc) => {
    const chunks = chunkText(doc.content);
    chunks.forEach((chunk, index) => {
      processedChunks.push({
        id: `${doc.id}-${index}`,
        content: chunk,
        metadata: {
          documentId: doc.id,
          title: doc.title,
          chunkIndex: index,
        },
      });
    });
  });

  return processedChunks;
}
