import { useState } from "react";
import { sendQuery } from "../services/api";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "What is the risk score?",
    "How is water quality?",
    "Explain NDVI",
  ];

  const handleSend = async (overrideQuestion) => {
    const question = (overrideQuestion || input).trim();
    if (!question || loading) return;

    setLoading(true);

    try {
      const res = await sendQuery(question);
      setMessages((prev) => [
        ...prev,
        { user: question, bot: res.data.response },
      ]);
      setInput("");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { user: question, bot: "Unable to reach the AI service right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentinel-card flex min-h-[420px] flex-col p-4">
      <h2 className="sentinel-title">EcoSense-AI Assistant</h2>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        Ask about risk score, water quality, NDVI, or future prediction.
      </p>

      <div className="mt-4 h-[220px] space-y-3 overflow-y-auto rounded-3xl bg-slate-950/40 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Try: What crisis is expected?
          </p>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.user}-${index}`} className="space-y-2">
              <div className="ml-auto max-w-[92%] rounded-2xl bg-cyan-500/10 px-3 py-2 text-xs leading-5 text-cyan-100">
                {message.user}
              </div>
              <div className="max-w-[92%] rounded-2xl bg-white/5 px-3 py-2 text-xs leading-5 text-slate-200">
                {message.bot}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => handleSend(text)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-200"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <input
          className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:bg-white/10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask EcoSense-AI..."
        />
        <button
          className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:opacity-60"
          onClick={() => handleSend()}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
