import { anthropic } from "@ai-sdk/anthropic";
import { bedrock } from "@ai-sdk/amazon-bedrock";
import {
  LanguageModelV1,
  LanguageModelV1StreamPart,
  LanguageModelV1Message,
} from "@ai-sdk/provider";

const MODEL = "claude-haiku-4-5";
const BEDROCK_MODEL = "au.anthropic.claude-haiku-4-5-20251001-v1:0";

// --- Mock Language Model (used when no API keys are configured) ---

export class MockLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = "v1" as const;
  readonly provider = "mock";
  readonly modelId: string;
  readonly defaultObjectGenerationMode = "tool" as const;

  constructor(modelId: string) {
    this.modelId = modelId;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private extractUserPrompt(messages: LanguageModelV1Message[]): string {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === "user") {
        const content = message.content;
        if (Array.isArray(content)) {
          const textParts = content
            .filter((part: any) => part.type === "text")
            .map((part: any) => part.text);
          return textParts.join(" ");
        } else if (typeof content === "string") {
          return content;
        }
      }
    }
    return "";
  }

  private async *generateMockStream(
    messages: LanguageModelV1Message[],
    userPrompt: string
  ): AsyncGenerator<LanguageModelV1StreamPart> {
    const toolMessageCount = messages.filter((m) => m.role === "tool").length;

    const promptLower = userPrompt.toLowerCase();
    let componentType = "counter";
    let componentName = "Counter";

    if (promptLower.includes("form")) {
      componentType = "form";
      componentName = "ContactForm";
    } else if (promptLower.includes("card")) {
      componentType = "card";
      componentName = "Card";
    }

    if (toolMessageCount === 0) {
      const text = `This is a mock response. Configure AI credentials in .env to use Claude. Let me create a sample component.`;
      for (const char of text) {
        yield { type: "text-delta", textDelta: char };
        await this.delay(15);
      }

      yield {
        type: "tool-call",
        toolCallType: "function",
        toolCallId: "call_0",
        toolName: "str_replace_editor",
        args: JSON.stringify({
          command: "create",
          path: "/App.tsx",
          file_text: this.getAppCode(componentName),
        }),
      };

      yield {
        type: "finish",
        finishReason: "tool-calls",
        usage: { promptTokens: 50, completionTokens: 30 },
      };
      return;
    }

    if (toolMessageCount === 1) {
      const text = `I'll create the ${componentName} component.`;
      for (const char of text) {
        yield { type: "text-delta", textDelta: char };
        await this.delay(25);
      }

      yield {
        type: "tool-call",
        toolCallType: "function",
        toolCallId: "call_1",
        toolName: "str_replace_editor",
        args: JSON.stringify({
          command: "create",
          path: `/components/${componentName}.tsx`,
          file_text: this.getComponentCode(componentType),
        }),
      };

      yield {
        type: "finish",
        finishReason: "tool-calls",
        usage: { promptTokens: 50, completionTokens: 30 },
      };
      return;
    }

    // Final summary
    const text = `Done! I've created **${componentName}.tsx** and **App.tsx**. Check the preview.`;
    for (const char of text) {
      yield { type: "text-delta", textDelta: char };
      await this.delay(30);
    }

    yield {
      type: "finish",
      finishReason: "stop",
      usage: { promptTokens: 50, completionTokens: 50 },
    };
  }

  private getComponentCode(componentType: string): string {
    if (componentType === "form") {
      return `import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('Submitted!'); };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-md" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Send</button>
      </form>
    </div>
  );
};

export default ContactForm;`;
    }

    if (componentType === "card") {
      return `import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ title = "Welcome", description = "Amazing features await." }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Learn More</button>
    </div>
  </div>
);

export default Card;`;
    }

    return `import React, { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Counter</h2>
      <div className="text-4xl font-bold mb-6">{count}</div>
      <div className="flex gap-4">
        <button onClick={() => setCount(c => c - 1)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">-</button>
        <button onClick={() => setCount(0)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Reset</button>
        <button onClick={() => setCount(c => c + 1)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">+</button>
      </div>
    </div>
  );
};

export default Counter;`;
  }

  private getAppCode(componentName: string): string {
    return `import ${componentName} from './components/${componentName}';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <${componentName} />
    </div>
  );
}`;
  }

  async doGenerate(
    options: Parameters<LanguageModelV1["doGenerate"]>[0]
  ): Promise<Awaited<ReturnType<LanguageModelV1["doGenerate"]>>> {
    const userPrompt = this.extractUserPrompt(options.prompt);
    const parts: LanguageModelV1StreamPart[] = [];
    for await (const part of this.generateMockStream(options.prompt, userPrompt)) {
      parts.push(part);
    }

    const textParts = parts
      .filter((p) => p.type === "text-delta")
      .map((p) => (p as any).textDelta)
      .join("");

    const toolCalls = parts
      .filter((p) => p.type === "tool-call")
      .map((p) => ({
        toolCallType: "function" as const,
        toolCallId: (p as any).toolCallId,
        toolName: (p as any).toolName,
        args: (p as any).args,
      }));

    const finishPart = parts.find((p) => p.type === "finish") as any;

    return {
      text: textParts,
      toolCalls,
      finishReason: finishPart?.finishReason || "stop",
      usage: { promptTokens: 100, completionTokens: 200 },
      warnings: [],
      rawCall: { rawPrompt: options.prompt, rawSettings: {} },
    };
  }

  async doStream(
    options: Parameters<LanguageModelV1["doStream"]>[0]
  ): Promise<Awaited<ReturnType<LanguageModelV1["doStream"]>>> {
    const userPrompt = this.extractUserPrompt(options.prompt);
    const self = this;

    const stream = new ReadableStream<LanguageModelV1StreamPart>({
      async start(controller) {
        try {
          for await (const chunk of self.generateMockStream(options.prompt, userPrompt)) {
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return {
      stream,
      warnings: [],
      rawCall: { rawPrompt: options.prompt, rawSettings: {} },
      rawResponse: { headers: {} },
    };
  }
}

// --- Provider factory ---

export function getLanguageModel() {
  const awsRegion = process.env.AWS_REGION?.trim();
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID?.trim();
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();

  if (awsRegion && awsAccessKey && awsSecretKey) {
    console.log("Using AWS Bedrock provider with model:", BEDROCK_MODEL);
    return bedrock(BEDROCK_MODEL);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (apiKey && apiKey !== "your-api-key-here") {
    console.log("Using direct Anthropic API with model:", MODEL);
    return anthropic(MODEL);
  }

  console.log("No AI credentials configured. Using mock provider.");
  return new MockLanguageModel("mock-" + MODEL);
}

export function isMockProvider(): boolean {
  const hasBedrock =
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY;
  return !hasBedrock && !process.env.ANTHROPIC_API_KEY;
}
