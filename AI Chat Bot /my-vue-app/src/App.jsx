import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("Hindi");
  const [loading, setLoading] = useState(false);

  const instructions = {
    Hindi: "आप एक आपदा राहत सहायक हैं। कृपया आपदा से प्रभावित लोगों को हिंदी में व्यावहारिक, संक्षिप्त और सहायक जानकारी दें।",
    English: "You are a disaster relief assistant. Provide concise and helpful disaster-related responses in English.",
    Bengali: "আপনি একটি দুর্যোগ ত্রাণ সহায়ক। দয়া করে বাংলায় দুর্যোগ-সংক্রান্ত সহায়ক এবং সংক্ষিপ্ত তথ্য দিন।"
  };

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  async function generateAnswer() {
    if (!question.trim()) return;

    const userMessage = {
      text: question,
      sender: 'user',
      time: getTime()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setQuestion("");

    const fullPrompt = `${instructions[language]}\n${question}`;

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=APIKey",
        method: "post",
        data: {
          contents: [
            {
              parts: [{ text: fullPrompt }]
            }
          ]
        }
      });

      const result = response.data.candidates[0].content.parts[0].text;

      const aiMessage = {
        text: result,
        sender: 'ai',
        time: getTime()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        text: "उत्तर प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
        sender: 'ai',
        time: getTime()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  }

  return (
    <div className="phone-frame">
      <div className="app-container">
        <h1>Disaster Relief Assistant</h1>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              <div>{msg.text}</div>
              <span className="timestamp">{msg.time}</span>
            </div>
          ))}
        </div>

        <div className="input-section">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Bengali">Bengali</option>
          </select>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your disaster-related question..."
          />

          <button onClick={generateAnswer} disabled={loading}>
            {loading ? "Generating..." : "Get Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
