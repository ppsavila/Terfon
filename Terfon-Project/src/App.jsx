import React, { useState } from 'react';
import './index.css';
import { useTerfon } from './hooks/useTerfon.js';
import Board from './components/Board.jsx';
import Keyboard from './components/Keyboard.jsx';
import Modal from './components/Modal.jsx';
import { HelpCircle, BarChart2 } from 'lucide-react';

function App() {
    const {
        dailyWord,
        guesses,
        currentGuess,
        status,
        onKeyPress,
        keyboardState,
        MAX_ATTEMPTS,
        WORD_LENGTH
    } = useTerfon();

    const [showHelp, setShowHelp] = useState(false);
    const [showStats, setShowStats] = useState(() => status !== 'PLAYING');

    React.useEffect(() => {
        const isFirstTime = localStorage.getItem('terfon-first-time');
        if (!isFirstTime && status === 'PLAYING') {
            setShowHelp(true);
            localStorage.setItem('terfon-first-time', 'false');
        }
    }, [status]);

    React.useEffect(() => {
        if (status !== 'PLAYING' && !showStats) {
            const timer = setTimeout(() => setShowStats(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [status, showStats]);

    return (
        <div className="app-container">
            <header className="header">
                <button className="icon-btn" onClick={() => setShowHelp(true)}>
                    <HelpCircle size={28} color="var(--text-color)" />
                </button>
                <h1>TERFON</h1>
                <button className="icon-btn" onClick={() => setShowStats(true)}>
                    <BarChart2 size={28} color="var(--text-color)" />
                </button>
            </header>
            <main className="game-wrapper">
                <Board
                    guesses={guesses}
                    currentGuess={currentGuess}
                    dailyWord={dailyWord}
                    maxAttempts={MAX_ATTEMPTS}
                    wordLength={WORD_LENGTH}
                    status={status}
                />
                <Keyboard
                    onKeyPress={onKeyPress}
                    keyboardState={keyboardState}
                />
            </main>

            <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Como Jogar">
                <p>Adivinhe a palavra (transcrita foneticamente) em 6 tentativas.</p>
                <p>A cada tentativa, a cor das letras mostrará o quão perto você está.</p>
                <div className="example">
                    <div className="row">
                        <div className="cell" data-state="correct">t</div>
                        <div className="cell" data-state="empty">e</div>
                        <div className="cell" data-state="empty">x</div>
                        <div className="cell" data-state="empty">m</div>
                        <div className="cell" data-state="empty">u</div>
                    </div>
                    <p>O fonema <strong>t</strong> faz parte da palavra e está na posição correta.</p>
                </div>
                <div className="example">
                    <div className="row">
                        <div className="cell" data-state="empty">p</div>
                        <div className="cell" data-state="present">ɔ</div>
                        <div className="cell" data-state="empty">ɾ</div>
                        <div className="cell" data-state="empty">t</div>
                        <div className="cell" data-state="empty">a</div>
                    </div>
                    <p>O fonema <strong>ɔ</strong> faz parte da palavra mas em outra posição.</p>
                </div>
                <div className="rules-note">
                    <p><strong>Atenção:</strong> Terfon utiliza os fonemas do sotaque <em>Belorizontino (Belo Horizonte, MG)</em>. Palavras como "noite" são transcritas como <strong>n o i tʃ i</strong>.</p>
                </div>
            </Modal>

            <Modal isOpen={showStats} onClose={() => setShowStats(false)} title="Estatísticas">
                <div className="stats-container">
                    {status === 'WON' && <h3 className="win-text">Parabéns! Você acertou!</h3>}
                    {status === 'LOST' && (
                        <div className="lose-text">
                            <h3>Que pena!</h3>
                            <p>A palavra era: <strong>{dailyWord.join(' ')}</strong></p>
                        </div>
                    )}
                    <div className="stats-box">
                        <div className="stat">
                            <span className="stat-num">{status !== 'PLAYING' ? guesses.length : '-'}</span>
                            <span className="stat-label">Tentativas</span>
                        </div>
                    </div>
                    {status !== 'PLAYING' && (
                        <p className="daily-message">Volte amanhã para uma nova palavra!</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default App;
