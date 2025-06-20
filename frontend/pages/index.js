import { useState } from "react";
export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = {
        role: 'bot',
        content: data.reply,
        sentiment: data.sentiment,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error talking to the backend:', error);
    }
  };
  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="font-bold text-3xl mb-4 text-gray-800 text-center">
          🤖 Welcome to the Chatbot
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Start a conversation with your AI assistant!
        </p>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
              {msg.content}
              {msg.role === 'bot' && (
                <div className="text-xs mt-1 text-right text-gray-600">
                  Sentiment: <span className={`font-semibold ${msg.sentiment === 'positive' ? 'text-green-600' : msg.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-500'}`}>
                    {msg.sentiment}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={sendMessage}
          >
           <i class="fa-solid fa-square-arrow-up-right"></i>
          </button>
        </div>
      </div>
    </div> 
  );
}
