import { useState } from 'react';
import './App.css';

const initialFlashcards = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "2 + 2 = ?", answer: "4" },
  { id: 3, question: "What is React?", answer: "A JavaScript library for building UIs." },
];

function Flashcard({ card, flipped, onFlip }) {
  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={onFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="card-label">QUESTION</div>
          <div className="card-content">{card.question}</div>
          <div className="card-hint">Click to reveal answer</div>
        </div>
        <div className="flashcard-back">
          <div className="card-label">ANSWER</div>
          <div className="card-content">{card.answer}</div>
          <div className="card-hint">Click to see question</div>
        </div>
      </div>
    </div>
  );
}

function AddCardForm({ onAddCard, onCancel }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (question.trim() && answer.trim()) {
      onAddCard({
        id: Date.now(),
        question: question.trim(),
        answer: answer.trim()
      });
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Flashcard</h2>
        <div className="form-group">
          <label>Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer..."
            rows="3"
          />
        </div>
        <div className="button-group">
          <button className="btn-primary" onClick={handleSubmit}>
            Add Card
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CardManager({ cards, onDeleteCard, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-wide">
        <div className="modal-header">
          <h2>Manage Cards ({cards.length})</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="card-list">
          {cards.length === 0 ? (
            <p className="empty-message">No flashcards yet. Add some to get started!</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="card-item">
                <div className="card-info">
                  <div className="card-question">Q: {card.question}</div>
                  <div className="card-answer">A: {card.answer}</div>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => onDeleteCard(card.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showManager, setShowManager] = useState(false);

  const nextCard = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
      setIsFlipped(false);
    }
  };

  const addCard = (newCard) => {
    setFlashcards(prev => [...prev, newCard]);
    setShowAddForm(false);
    if (flashcards.length === 0) {
      setCurrentIndex(0);
    }
  };

  const deleteCard = (cardId) => {
    setFlashcards(prev => {
      const newCards = prev.filter(card => card.id !== cardId);
      if (newCards.length === 0) {
        setCurrentIndex(0);
        setIsFlipped(false);
      } else if (currentIndex >= newCards.length) {
        setCurrentIndex(newCards.length - 1);
        setIsFlipped(false);
      }
      return newCards;
    });
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1>📚 Flashcards</h1>
          <p>Study smarter with interactive flashcards</p>
        </header>

        <div className="action-buttons">
          <button 
            className="btn-add"
            onClick={() => setShowAddForm(true)}
          >
            + Add Card
          </button>
          <button 
            className="btn-manage"
            onClick={() => setShowManager(true)}
          >
            Manage Cards
          </button>
        </div>

        {flashcards.length > 0 ? (
          <>
            <Flashcard
              card={currentCard}
              flipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />

            <div className="navigation">
              <button
                onClick={prevCard}
                disabled={flashcards.length <= 1}
                className="nav-btn"
              >
                ← Previous
              </button>
              
              <div className="card-counter">
                {currentIndex + 1} of {flashcards.length}
              </div>
              
              <button
                onClick={nextCard}
                disabled={flashcards.length <= 1}
                className="nav-btn"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No flashcards yet!</h2>
            <p>Create your first flashcard to get started</p>
            <button 
              className="btn-create-first"
              onClick={() => setShowAddForm(true)}
            >
              Create First Card
            </button>
          </div>
        )}

        {showAddForm && (
          <AddCardForm
            onAddCard={addCard}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {showManager && (
          <CardManager
            cards={flashcards}
            onDeleteCard={deleteCard}
            onClose={() => setShowManager(false)}
          />
        )}
      </div>
    </div>
  );
}