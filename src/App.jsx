import React, { useState, useEffect, useRef } from 'react';
import './App.css'

function App() {

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  }, [sessions]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);

  const handleStop = () => {
    setIsRunning(false);
    if (seconds > 0) {
      const now = new Date();
      const newSession = {
        duration: formatTime(seconds),
        timestamp: now.toLocaleString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setSessions([newSession, ...sessions]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const toggleTheme = () => setIsDark(!isDark);


  return (
    <>
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-amber-50'
        } flex items-center justify-center px-4 py-8`}>

        <div className={`w-full max-w-lg transition-all duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-200'
          } border-2 rounded-3xl overflow-hidden`}>

          <div className={`px-6 py-4 border-b-2 flex items-center justify-between ${isDark ? 'bg-slate-750 border-slate-700' : 'bg-stone-50 border-stone-200'
            }`}>
            <h1 className={`text-xl tracking-tight font-bold ${isDark ? 'text-amber-400' : 'text-stone-800'
              }`}>
              Focus Timer
            </h1>
            <button
              onClick={toggleTheme}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${isDark
                ? 'bg-slate-700 text-amber-300 hover:bg-slate-600'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}>
              {isDark ? '☀' : '☾'} Theme
            </button>
          </div>

          <div className="px-6 py-10">
            <div className={`mx-auto w-56 h-56 rounded-full flex items-center justify-center border-4 ${isDark
              ? 'bg-slate-900 border-amber-500'
              : 'bg-amber-100 border-amber-600'
              }`}>
              <span className={`text-6xl font-bold tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-900'
                }`}>
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDark
                ? 'bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white disabled:text-slate-500'
                : 'bg-emerald-500 hover:bg-emerald-600 disabled:bg-stone-200 text-white disabled:text-stone-400'
                }`}>
              Start
            </button>
            <button
              onClick={handleStop}
              disabled={!isRunning}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDark
                ? 'bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 text-white disabled:text-slate-500'
                : 'bg-rose-500 hover:bg-rose-600 disabled:bg-stone-200 text-white disabled:text-stone-400'
                }`}>
              Stop
            </button>
            <button
              onClick={handleReset}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-amber-300'
                : 'bg-stone-300 hover:bg-stone-400 text-stone-800'
                }`}>
              Reset
            </button>
          </div>

          {sessions.length > 0 && (
            <div className={`px-6 pb-6 border-t-2 pt-6 ${isDark ? 'border-slate-700' : 'border-stone-200'
              }`}>
              <h3 className={`text-sm font-bold mb-3 uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-stone-500'
                }`}>
                Recent Sessions
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {sessions.map((session, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-4 py-3 rounded-lg ${isDark ? 'bg-slate-750' : 'bg-stone-100'
                      }`}>
                    <span className={`font-mono text-lg font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'
                      }`}>
                      {session.duration}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-stone-500'
                      }`}>
                      {session.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
