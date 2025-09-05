// Sample documents embedded in the code
export const documents = [
  {
    id: "1",
    title: "Company Overview",
    content: `
      Our company is a leading technology firm specializing in artificial intelligence and machine learning solutions. 
      Founded in 2020, we have grown to serve over 500 clients worldwide. Our mission is to democratize AI technology 
      and make it accessible to businesses of all sizes. We offer consulting services, custom AI development, 
      and pre-built AI solutions for various industries including healthcare, finance, and e-commerce.
      
      Our team consists of 50+ engineers, data scientists, and AI researchers with expertise in natural language 
      processing, computer vision, and predictive analytics. We are headquartered in San Francisco with offices 
      in New York, London, and Tokyo.
    `,
  },
  {
    id: "2",
    title: "AI Services",
    content: `
      We provide comprehensive AI services including:
      
      1. Natural Language Processing (NLP): Text analysis, sentiment analysis, chatbots, and language translation
      2. Computer Vision: Image recognition, object detection, facial recognition, and medical imaging analysis
      3. Predictive Analytics: Forecasting, risk assessment, and recommendation systems
      4. Machine Learning Operations (MLOps): Model deployment, monitoring, and maintenance
      5. AI Consulting: Strategy development, feasibility studies, and implementation planning
      
      Our solutions are built using cutting-edge technologies including TensorFlow, PyTorch, OpenAI GPT models, 
      and cloud platforms like AWS, Google Cloud, and Azure. We ensure all solutions are scalable, secure, 
      and compliant with industry standards.
    `,
  },
  {
    id: "3",
    title: "Pricing and Plans",
    content: `
      We offer flexible pricing models to suit different business needs:
      
      Starter Plan ($5,000/month):
      - Up to 3 AI models
      - Basic support
      - Standard deployment
      - 10,000 API calls/month
      
      Professional Plan ($15,000/month):
      - Up to 10 AI models
      - Priority support
      - Advanced deployment options
      - 100,000 API calls/month
      - Custom integrations
      
      Enterprise Plan (Custom pricing):
      - Unlimited AI models
      - 24/7 dedicated support
      - On-premise deployment
      - Unlimited API calls
      - Custom development
      - SLA guarantees
      
      All plans include initial consultation, model training, and 3 months of free support.
    `,
  },
  {
    id: "4",
    title: "Technical Documentation",
    content: `
      API Documentation:
      
      Our REST API provides access to all AI services. Authentication is done via API keys.
      Base URL: https://api.ourcompany.com/v1
      
      Common endpoints:
      - POST /analyze/text - Text analysis and NLP
      - POST /analyze/image - Computer vision tasks
      - POST /predict - Predictive analytics
      - GET /models - List available models
      
      Rate limits: 1000 requests per hour for Starter, 10,000 for Professional, unlimited for Enterprise.
      
      SDK Support: We provide SDKs for Python, JavaScript, Java, and C#.
      
      Data Security: All data is encrypted in transit and at rest. We are SOC 2 Type II certified 
      and GDPR compliant. Data retention policies can be customized per client requirements.
    `,
  },
  {
    id: "5",
    title: "Support and Contact",
    content: `
      Customer Support:
      
      We provide multiple channels for customer support:
      - Email: support@ourcompany.com (24-48 hour response time)
      - Phone: +1-555-0123 (Business hours: 9 AM - 6 PM PST)
      - Live Chat: Available on our website during business hours
      - Slack Integration: For Enterprise customers
      
      Technical Support:
      - Documentation: https://docs.ourcompany.com
      - Developer Forum: https://forum.ourcompany.com
      - GitHub: https://github.com/ourcompany
      
      Sales Inquiries:
      - Email: sales@ourcompany.com
      - Phone: +1-555-0124
      
      Office Locations:
      - San Francisco HQ: 123 Tech Street, San Francisco, CA 94105
      - New York: 456 Business Ave, New York, NY 10001
      - London: 789 Innovation Road, London, UK EC1A 1BB
      - Tokyo: 321 Future Building, Tokyo, Japan 100-0001
    `,
  },
]

// Text chunking utility
export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ")
    if (chunk.trim()) {
      chunks.push(chunk.trim())
    }
  }

  return chunks
}

// Process documents into chunks with metadata
export function processDocuments() {
  const processedChunks: Array<{
    id: string
    content: string
    metadata: {
      documentId: string
      title: string
      chunkIndex: number
    }
  }> = []

  documents.forEach((doc) => {
    const chunks = chunkText(doc.content)
    chunks.forEach((chunk, index) => {
      processedChunks.push({
        id: `${doc.id}-${index}`,
        content: chunk,
        metadata: {
          documentId: doc.id,
          title: doc.title,
          chunkIndex: index,
        },
      })
    })
  })

  return processedChunks
}
