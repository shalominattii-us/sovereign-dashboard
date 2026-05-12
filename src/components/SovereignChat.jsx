// === SOVEREIGN DASHBOARD LLM CHAT INTERFACE v1.0.0-SOV ===
// File: src/components/SovereignChat.jsx
// Backend: http://localhost:11434/api/generate

import React, { useState, useRef, useEffect } from 'react';

const SovereignChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('llama3.2:3b');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: input,
          stream: false,
          options: { temperature: 0.7, num_ctx: 4096 }
        })
      });

      const data = await res.json();
      const aiMsg = {
        role: 'assistant',
        content: data.response || 'No response from model.',
        timestamp: new Date().toISOString(),
        tokens: data.eval_count,
        duration: data.total_duration
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `[Ω ERROR] LLM backend unreachable: ${err.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sovereign-chat-container">
      <div className="chat-header">
        <span className="omega-icon">Ω</span>
        <h2>AEGENTIS COMMAND INTERFACE</h2>
        <select value={model} onChange={e => setModel(e.target.value)}>
          <option value="llama3.2:3b">llama3.2:3b (Local)</option>
        </select>
      </div>

      <div className="messages-area">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>Ω SOVEREIGN AI ONLINE</h3>
            <p>Local LLM operational. No external dependencies.</p>
            <div className="quick-actions">
              <button onClick={() => setInput('Run system diagnostic')}>System Diagnostic</button>
              <button onClick={() => setInput('Analyze threat intel')}>Threat Analysis</button>
              <button onClick={() => setInput('Review security posture')}>Security Review</button>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-meta">
              <span className="role-badge">{msg.role.toUpperCase()}</span>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="message-content">{msg.content}</div>
            {msg.tokens && <div className="token-info">Tokens: {msg.tokens}</div>}
          </div>
        ))}
        {isLoading && <div className="loading-indicator">[Ω] Processing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Enter Sovereign command..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? 'Ω' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default SovereignChat;

