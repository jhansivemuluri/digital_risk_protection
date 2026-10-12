
import { useEffect, useRef, useState } from "react";
import "./ShieldBot.css";
import {
  Bot,
  MessageCircle,
  X,
  Send,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import "./ShieldBot.css";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const welcomeMessage = {
  role: "assistant",
  content:
    "Hi! I'm ShieldBot, your DigiShield security assistant. Ask me about phishing, fake accounts, suspicious apps, impersonation, or brand protection.",
};

const suggestions = [
  "What is digital risk protection?",
  "How can I identify a fake account?",
  "How does phishing work?",
  "How should I respond to a security alert?",
];

export default function ShieldBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  async function sendMessage(text = input) {
    const question = text.trim();

    if (!question || isLoading) return;

    if (question.length > 2000) {
      setError("Please keep your message under 2,000 characters.");
      return;
    }

    setError("");
    setInput("");

    const updatedMessages = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const conversation = updatedMessages
        .slice(1)
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversation,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || "ShieldBot could not respond. Please try again."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to ShieldBot. Check that the Python backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function resetChat() {
    setMessages([welcomeMessage]);
    setInput("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="shieldbot-root">
      {isOpen && (
        <section
          className="shieldbot-window"
          role="dialog"
          aria-label="ShieldBot AI assistant"
          aria-modal="false"
        >
          <header className="shieldbot-header">
            <div className="shieldbot-brand">
              <div className="shieldbot-logo">
                <ShieldCheck size={23} />
              </div>

              <div className="shieldbot-heading">
                <h2>ShieldBot</h2>
                <span>
                  <span className="shieldbot-status-dot" />
                  DigiShield AI Assistant
                </span>
              </div>
            </div>

            <div className="shieldbot-header-actions">
              <button
                type="button"
                className="shieldbot-icon-button"
                onClick={resetChat}
                aria-label="Start a new conversation"
                title="New conversation"
                disabled={isLoading}
              >
                <RotateCcw size={17} />
              </button>

              <button
                type="button"
                className="shieldbot-icon-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close ShieldBot"
              >
                <X size={21} />
              </button>
            </div>
          </header>

          <div className="shieldbot-security-note">
            <Sparkles size={14} />
            Your AI guide to digital risk protection
          </div>

          <div className="shieldbot-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`shieldbot-message-row ${
                  message.role === "user" ? "is-user" : "is-assistant"
                }`}
                key={`${index}-${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="shieldbot-message-avatar">
                    <Bot size={17} />
                  </div>
                )}

                <div className="shieldbot-bubble">
                  {message.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="shieldbot-suggestions">
                <p>Try asking</p>
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                    <span>↗</span>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="shieldbot-message-row is-assistant">
                <div className="shieldbot-message-avatar">
                  <Bot size={17} />
                </div>
                <div
                  className="shieldbot-bubble shieldbot-typing"
                  aria-label="ShieldBot is typing"
                >
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="shieldbot-error" role="alert">
              {error}
            </div>
          )}

          <form className="shieldbot-composer" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                if (error) setError("");
              }}
              placeholder="Ask ShieldBot anything..."
              rows={1}
              maxLength={2000}
              aria-label="Message ShieldBot"
              disabled={isLoading}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  handleSubmit(event);
                }
              }}
            />

            <button
              type="submit"
              className="shieldbot-send-button"
              aria-label="Send message"
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>

          <footer className="shieldbot-footer">
            <ShieldCheck size={13} />
            AI-generated guidance · Verify critical security findings
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`shieldbot-launcher ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close ShieldBot chat" : "Open ShieldBot chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={25} /> : <MessageCircle size={25} />}
        {!isOpen && <span className="shieldbot-launcher-pulse" />}
        {!isOpen && <span className="shieldbot-launcher-label">Ask ShieldBot</span>}
      </button>
    </div>
  );
}
