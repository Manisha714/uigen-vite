import { useChat } from "@ai-sdk/react";
import { useFileSystem } from "@/contexts/FileSystemContext";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRef, useEffect } from "react";

export function ChatInterface({
  projectId,
  initialMessages = [],
  onChatFinish,
  onEnsureProject,
}: {
  projectId?: string;
  initialMessages?: any[];
  onChatFinish?: () => void;
  onEnsureProject?: () => Promise<string | undefined>;
}) {
  const { getSerializedFiles, handleToolCall } = useFileSystem();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
    initialMessages,
    body: {
      files: getSerializedFiles(),
      projectId,
    },
    onToolCall: ({ toolCall }) => {
      handleToolCall(toolCall);
    },
    onFinish: () => {
      onChatFinish?.();
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isLoading = status === "streaming" || status === "submitted";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    let pid = projectId;
    if (!pid && onEnsureProject) {
      pid = await onEnsureProject();
    }
    handleSubmit(e, {
      body: { files: getSerializedFiles(), projectId: pid },
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg font-medium">Start building</p>
            <p className="text-sm mt-1">Describe a React component to generate</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                message.role === "user"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-800"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 rounded-lg px-4 py-2.5 text-sm text-neutral-500">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 p-4">
        <form onSubmit={onSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Describe a component..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
