import { useState, useEffect } from 'react';

export default function Suggestions({ onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // بارگذاری پیشنهادات از API
    const loadSuggestions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/suggestions`);
        const data = await response.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        // Fallback suggestions
        setSuggestions([
          "قیمت بیتکوین چنده؟",
          "اخبار جدید ارزهای دیجیتال رو بگو",
          "وضعیت سیستم چطوره؟",
          "شاخص ترس و طمع بازار چنده؟",
          "لیست 10 ارز برتر رو نشون بده",
          "تحلیل تکنیکال اتریوم رو بگو"
        ]);
      }
    };

    loadSuggestions();
  }, []);

  return (
    <div className="suggestions-container">
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-card"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="suggestion-icon">
              {getSuggestionIcon(suggestion)}
            </div>
            <span className="suggestion-text">{suggestion}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .suggestions-container {
          margin-top: 30px;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .suggestion-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: right;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .suggestion-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .suggestion-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .suggestion-text {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
          
          .suggestion-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

function getSuggestionIcon(suggestion) {
  if (suggestion.includes('قیمت')) return '💰';
  if (suggestion.includes('اخبار')) return '📰';
  if (suggestion.includes('وضعیت')) return '📊';
  if (suggestion.includes('شاخص')) return '😨';
  if (suggestion.includes('لیست')) return '🏆';
  if (suggestion.includes('تحلیل')) return '📈';
  return '💡';
}
