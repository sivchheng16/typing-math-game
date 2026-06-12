import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Zap, Activity, BookOpen, X, Play, RotateCcw, ArrowLeft, GraduationCap, Volume2, VolumeX, Calculator, Brain, Pause, HeartPulse } from 'lucide-react';
import Tutorial from './Tutorial';
import { useLang } from '../LanguageContext';

// --- Types ---

type GameState = 'menu' | 'playing' | 'gameover' | 'tutorial' | 'paused';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'cpu' | 'stream';
type PowerUpType = 'slow' | 'shield' | 'double';

interface Task {
  id: string;
  x: number;
  y: number;
  speed: number;
  text: string;
  answer: string;
  type: 'math' | 'number' | 'powerup';
  color: string;
  powerUp?: PowerUpType;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ActiveEffects {
  slow: number; // timestamp when it ends
  shield: number;
  double: number;
}

type HighScores = {
  [key in GameMode]: {
    [key in Difficulty]: number;
  };
};

// --- Constants ---

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 700;

const DIFFICULTY_CONFIG = {
  easy: { spawnRate: 2500, speedBase: 0.5, speedInc: 0.1 },
  medium: { spawnRate: 3500, speedBase: 0.4, speedInc: 0.1 },
  hard: { spawnRate: 6000, speedBase: 0.2, speedInc: 0.1 },
};

// --- Helper Functions ---

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTask = (level: number, width: number, difficulty: Difficulty, mode: GameMode): Task => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const speed = config.speedBase + level * config.speedInc;

  let task: Task;

  if (mode === 'stream') {
    // Data Stream Mode: Just numbers, digit count based on difficulty
    let length: number;
    if (difficulty === 'easy') {
      length = 1; // 1-digit numbers (1-9)
    } else if (difficulty === 'medium') {
      length = 2; // 2-digit numbers (10-99)
    } else {
      length = randomInt(1, 3); // Mixed 1-3 digit numbers
    }
    const min = length === 1 ? 1 : Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const num = randomInt(min, max);
    const text = num.toString();

    // Ensure text fits within canvas width (approx char width 12px)
    const textWidth = text.length * 12;
    const x = randomInt(20, width - textWidth - 20);

    task = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: -40,
      speed,
      text,
      answer: text,
      type: 'number',
      color: '#06b6d4', // Cyan
    };
  } else {
    // CPU Overload Mode: Arithmetic, scaled by difficulty
    let text = '';
    let answer = '';
    const color = '#3b82f6'; // Blue

    if (difficulty === 'easy') {
      // Easy: 1-digit OP 1-digit, operators: +, -, *, /
      const ops = ['+', '-', '*', '/'];
      const op = ops[randomInt(0, ops.length - 1)];
      let a = randomInt(1, 9);
      let b = randomInt(1, 9);

      if (op === '/') {
        // Ensure clean division: pick b first, then a = b * quotient
        b = randomInt(1, 9);
        const quotient = randomInt(1, 9);
        a = b * quotient;
      }

      switch (op) {
        case '+':
          text = `${a} + ${b}`;
          answer = (a + b).toString();
          break;
        case '-': {
          const hi = Math.max(a, b);
          const lo = Math.min(a, b);
          text = `${hi} - ${lo}`;
          answer = (hi - lo).toString();
          break;
        }
        case '*':
          text = `${a} × ${b}`;
          answer = (a * b).toString();
          break;
        case '/':
          text = `${a} ÷ ${b}`;
          answer = (a / b).toString();
          break;
      }
    } else if (difficulty === 'medium') {
      // Medium: 2-digit OP 1-digit, operators: + and - only
      const op = Math.random() > 0.5 ? '+' : '-';
      const a = randomInt(10, 99);
      const b = randomInt(1, 9);
      if (op === '+') {
        text = `${a} + ${b}`;
        answer = (a + b).toString();
      } else {
        text = `${a} - ${b}`;
        answer = (a - b).toString();
      }
    } else {
      // Hard: 3-digit OP 1-digit, operators: + and - only
      const op = Math.random() > 0.5 ? '+' : '-';
      const a = randomInt(100, 999);
      const b = randomInt(1, 9);
      if (op === '+') {
        text = `${a} + ${b}`;
        answer = (a + b).toString();
      } else {
        text = `${a} - ${b}`;
        answer = (a - b).toString();
      }
    }

    // Ensure text fits within canvas width (approx char width 12px)
    const textWidth = text.length * 12;
    const x = randomInt(20, width - textWidth - 20);

    task = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: -40,
      speed,
      text,
      answer,
      type: 'math',
      color,
    };
  }

  // 10% chance to attach a power-up to the task
  if (Math.random() < 0.10) {
    const powerUps: PowerUpType[] = ['slow', 'shield', 'double'];
    const type = powerUps[randomInt(0, powerUps.length - 1)];
    task.powerUp = type;
  }

  return task;
};

// --- Component ---

export default function Game() {
  const { t, lang, toggleLang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('cpu');
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeEffects, setActiveEffects] = useState<ActiveEffects>({ slow: 0, shield: 0, double: 0 });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [highScores, setHighScores] = useState<HighScores>(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : {
      cpu: { easy: 0, medium: 0, hard: 0 },
      stream: { easy: 0, medium: 0, hard: 0 }
    };
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const typingBufferRef = useRef<AudioBuffer | null>(null);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused') return 'playing';
      return prev;
    });
  }, []);

  // Preload typing sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (
            window.AudioContext || (window as any).webkitAudioContext
          )();
        }
        const response = await fetch('sounds/typing.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        typingBufferRef.current = audioBuffer;
      } catch (error) {
        console.error('Failed to load typing sound:', error);
      }
    };
    loadSound();

    const interval = setInterval(() => setCurrentTime(Date.now()), 100);
    return () => clearInterval(interval);
  }, []);

  // Game Loop Refs (to avoid closure staleness)
  const stateRef = useRef({
    gameState,
    tasks: [] as Task[],
    particles: [] as Particle[],
    lastSpawn: 0,
    score,
    health,
    level,
    difficulty,
    gameMode,
    activeEffects,
    inputValue,
  });

  // Sync refs with state
  useEffect(() => {
    stateRef.current.gameState = gameState;
    stateRef.current.score = score;
    stateRef.current.health = health;
    stateRef.current.level = level;
    stateRef.current.difficulty = difficulty;
    stateRef.current.gameMode = gameMode;
    stateRef.current.activeEffects = activeEffects;
    stateRef.current.inputValue = inputValue;
  }, [gameState, score, health, level, difficulty, gameMode, activeEffects, inputValue]);

  // Handle High Score Update
  useEffect(() => {
    if (gameState === 'gameover') {
      const { score, gameMode, difficulty } = stateRef.current;
      setHighScores(prev => {
        const currentHigh = prev[gameMode][difficulty];
        if (score > currentHigh) {
          const newScores = {
            ...prev,
            [gameMode]: {
              ...prev[gameMode],
              [difficulty]: score
            }
          };
          localStorage.setItem('highScores', JSON.stringify(newScores));
          return newScores;
        }
        return prev;
      });
    }
  }, [gameState]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are pressed (except for specific combos if we wanted them)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Prevent default behavior for shortcuts to avoid browser conflicts
      if (['Escape', 'r', 'R', 'm', 'M'].includes(e.key)) {
        // Don't prevent default for R/M if they are valid inputs (which they aren't currently, but good practice)
      }

      switch (e.key) {
        case 'Escape':
          if (gameState === 'playing' || gameState === 'paused') {
            togglePause();
          }
          break;
        // case 'r':
        case 'R':
          if (gameState === 'playing' || gameState === 'gameover') {
            startGame();
          }
          break;
        // case 'm':
        case 'M':
          setSoundEnabled(prev => !prev);
          break;
        // case 'p':
        case 'P':
          if (gameState === 'playing' || gameState === 'paused') {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Sound Effects
  const playSound = (type: 'type' | 'correct' | 'error' | 'level-up' | 'game-over' | 'powerup') => {
    if (!soundEnabled) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    const ctx = audioContextRef.current;

    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'type':
        if (typingBufferRef.current) {
          const source = ctx.createBufferSource();
          source.buffer = typingBufferRef.current;
          source.connect(gain);
          gain.gain.setValueAtTime(0.15, now);
          source.start(now);
        } else {
          // Fallback to synth if buffer not loaded
          osc.type = 'square';
          osc.frequency.setValueAtTime(400 + Math.random() * 100, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        }
        break;
      // case 'correct':
      //   osc.type = 'sine';
      //   osc.frequency.setValueAtTime(523.25, now); // C5
      //   osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      //   osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      //   gain.gain.setValueAtTime(0.1, now);
      //   gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      //   osc.start(now);
      //   osc.stop(now + 0.3);
      //   break;
      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case 'level-up':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.5); // C6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'game-over':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(50, now + 1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 1);
        osc.start(now);
        osc.stop(now + 1);
        break;
      case 'powerup':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
    if (gameState === 'gameover') {
      playSound('game-over');
    }

    // Auto-focus interval every 2s
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Input handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (gameState !== 'playing') {
      setInputValue(val);
      return;
    }

    // Limit input length for stream mode since max digits is 3
    if (stateRef.current.gameMode === 'stream' && val.length > 3) return;

    const trimmedVal = val.trim().toUpperCase(); // Handle case-insensitive for power-ups
    const tasks = stateRef.current.tasks;

    // Check if input is a valid prefix of any task
    const isValidPrefix = tasks.some(t => t.answer.startsWith(trimmedVal));

    if (!isValidPrefix && trimmedVal !== '') {
      // Incorrect input - trigger shake and clear
      setInputError(true);
      setTimeout(() => setInputError(false), 300);
      setInputValue('');
      playSound('error');
      return;
    }

    setInputValue(val);

    if (val !== '') {
      playSound('type');
    }

    const matchIndex = tasks.findIndex((t) => t.answer === trimmedVal);

    if (matchIndex !== -1) {
      // Correct answer
      const task = tasks[matchIndex];
      createExplosion(task.x + 20, task.y + 10, task.color);

      // Handle Power-ups
      let healthBonus = 2; // Base recovery for correct answer

      if (task.powerUp) {
        healthBonus += 15; // Extra recovery for powerups
        const now = Date.now();
        const duration = 10000; // 10 seconds
        setActiveEffects(prev => ({
          ...prev,
          [task.powerUp!]: now + duration
        }));
        playSound('powerup');
      } else {
        playSound('correct');
      }

      // Apply health recovery
      setHealth((prev) => Math.min(prev + healthBonus, 100));

      // Update score
      const multiplier = stateRef.current.activeEffects.double > Date.now() ? 2 : 1;
      const points = 10 * stateRef.current.level * multiplier;
      setScore((prev) => prev + points);

      // Level up check - use stateRef to avoid stale closure
      if ((stateRef.current.score + points) > stateRef.current.level * 500) {
        setLevel((prev) => prev + 1);
        setHealth((prev) => Math.min(prev + 20, 100)); // Heal on level up
        playSound('level-up');
      }

      // Remove task
      stateRef.current.tasks.splice(matchIndex, 1);

      setInputValue('');
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fallback for manual submit if needed, but auto-execute handles most cases
    if (gameState !== 'playing') return;
    // Clear if user presses enter and no match found (optional UX choice)
    if (inputValue.length > 0) setInputValue('');
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      stateRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        life: 1.0,
        color,
      });
    }
  };

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      // Clear canvas
      ctx.fillStyle = '#151619'; // Dark bg
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid (Retro feel)
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 35) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 35) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      if (stateRef.current.gameState === 'playing') {
        const now = Date.now();
        const config = DIFFICULTY_CONFIG[stateRef.current.difficulty];
        const spawnRate = Math.max(500, config.spawnRate - stateRef.current.level * 100);

        // Spawn Logic
        if (time - stateRef.current.lastSpawn > spawnRate) {
          stateRef.current.tasks.push(generateTask(stateRef.current.level, CANVAS_WIDTH, stateRef.current.difficulty, stateRef.current.gameMode));
          stateRef.current.lastSpawn = time;
        }

        // Update Tasks
        const slowActive = stateRef.current.activeEffects.slow > now;
        const timeScale = slowActive ? 0.5 : 1.0;

        for (let i = stateRef.current.tasks.length - 1; i >= 0; i--) {
          const task = stateRef.current.tasks[i];
          task.y += task.speed * timeScale;

          // Draw Task
          ctx.font = 'bold 30px "Inter", "Kantumruy Pro", sans-serif';

          // Check for matching prefix
          const isMatching = stateRef.current.inputValue.length > 0 &&
            task.answer.startsWith(stateRef.current.inputValue.toUpperCase());

          // Draw power-up indicator if present
          if (task.powerUp) {
            let powerUpText = '';
            let powerUpColor = '';
            let icon = '';

            switch (task.powerUp) {
              case 'slow':
                powerUpText = 'SLOW';
                powerUpColor = '#34d399';
                icon = '⏱️';
                break;
              case 'shield':
                powerUpText = 'SHIELD';
                powerUpColor = '#60a5fa';
                icon = '🛡️';
                break;
              case 'double':
                powerUpText = '2X';
                powerUpColor = '#fbbf24';
                icon = '⚡';
                break;
            }

            // Measure main text to center the label
            const textMetrics = ctx.measureText(task.text);
            const textWidth = textMetrics.width;
            const centerX = task.x + textWidth / 2;

            // Pulse effect
            const pulse = Math.sin(now / 150) * 0.1 + 1; // 0.9 to 1.1

            ctx.save();
            ctx.translate(centerX, task.y - 35);
            ctx.scale(pulse, pulse);

            // Glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = powerUpColor;

            // Background Pill
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // Dark slate background
            ctx.strokeStyle = powerUpColor;
            ctx.lineWidth = 2;

            const label = `${icon} ${powerUpText}`;
            ctx.font = 'bold 12px "Inter", "Kantumruy Pro", sans-serif';
            const labelMetrics = ctx.measureText(label);
            const w = labelMetrics.width + 20;
            const h = 26;

            // Draw rounded rect
            const x = -w / 2;
            const y = -h / 2;
            const r = h / 2;

            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            // Text
            ctx.fillStyle = powerUpColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 1);

            ctx.restore();
          } else {
            ctx.shadowBlur = 0;
          }

          // Draw main task text
          ctx.font = 'bold 30px "Inter", "Kantumruy Pro", sans-serif';
          if (isMatching) {
            ctx.fillStyle = '#ffffff'; // Highlight color
            ctx.shadowBlur = 20;
            ctx.shadowColor = task.color;
          } else if (task.powerUp) {
            // Use power-up color for the task text if it has a power-up
            let powerUpColor = '';
            switch (task.powerUp) {
              case 'slow': powerUpColor = '#34d399'; break;
              case 'shield': powerUpColor = '#60a5fa'; break;
              case 'double': powerUpColor = '#fbbf24'; break;
            }
            ctx.fillStyle = powerUpColor;
          } else {
            ctx.fillStyle = task.color;
          }

          ctx.fillText(task.text, task.x, task.y);
          ctx.shadowBlur = 0; // Reset

          // Check collision (bottom)
          if (task.y > CANVAS_HEIGHT) {
            stateRef.current.tasks.splice(i, 1);

            // Only take damage if shield is NOT active
            const shieldActive = stateRef.current.activeEffects.shield > now;
            if (!shieldActive) {
              setHealth((prev) => {
                const newHealth = prev - 10;
                if (newHealth <= 0) setGameState('gameover');
                return newHealth;
              });
            }
          }
        }

        // Update Particles
        for (let i = stateRef.current.particles.length - 1; i >= 0; i--) {
          const p = stateRef.current.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;

          if (p.life <= 0) {
            stateRef.current.particles.splice(i, 1);
          } else {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setHealth(100);
    setLevel(1);
    setInputValue('');
    setActiveEffects({ slow: 0, shield: 0, double: 0 });
    stateRef.current.tasks = [];
    stateRef.current.particles = [];
    setGameState('playing');
  }, []);

  const goToMenu = useCallback(() => {
    setScore(0);
    setHealth(100);
    setLevel(1);
    setInputValue('');
    setActiveEffects({ slow: 0, shield: 0, double: 0 });
    stateRef.current.tasks = [];
    stateRef.current.particles = [];
    setGameState('menu');
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0a] text-white font-mono overflow-hidden gap-2">
      <AnimatePresence>
        {gameState !== 'menu' && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center shrink-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-6">
              {/* Logo & Name */}
              <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <img
                    src="typing-math-game-logo.png"
                    alt="Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="font-bold text-lg tracking-tight hidden md:block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {t('sysInit')}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Terminal className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{t('score')}</div>
                  <div className="text-xl font-bold font-mono text-blue-50">{score.toString().padStart(6, '0')}</div>
                </div>
              </div>

              {/* Level */}
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <div className="bg-purple-500/10 p-2 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <Cpu className="text-purple-400 w-5 h-5" />
                </div>
                <div className="min-w-[120px]">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{t('level')} {level}</div>
                    <div className="text-[10px] text-purple-400/70 font-mono">
                      {score - (level - 1) * 500}/{500} XP
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-purple-400 h-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, ((score - (level - 1) * 500) / 500) * 100))}%` }}
                      transition={{ type: 'spring', bounce: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Active Power-ups */}
              <div className="flex gap-2">
                <AnimatePresence>
                  {activeEffects.slow > currentTime && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex flex-col items-center gap-1 backdrop-blur-md min-w-[80px]"
                    >
                      <div className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">{t('slow')}</div>
                      <div className="w-full bg-emerald-950/50 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                          style={{ width: `${Math.min(100, Math.max(0, (activeEffects.slow - currentTime) / 100))}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                  {activeEffects.shield > currentTime && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-xl flex flex-col items-center gap-1 backdrop-blur-md min-w-[80px]"
                    >
                      <div className="text-blue-400 font-bold text-[10px] uppercase tracking-wider">{t('shield')}</div>
                      <div className="w-full bg-blue-950/50 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-400 h-full shadow-[0_0_8px_rgba(96,165,250,0.5)]"
                          style={{ width: `${Math.min(100, Math.max(0, (activeEffects.shield - currentTime) / 100))}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                  {activeEffects.double > currentTime && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-amber-500/10 border border-amber-500/40 px-3 py-1.5 rounded-xl flex flex-col items-center gap-1 backdrop-blur-md min-w-[100px] shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                    >
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <div className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">{t('doubleScore')}</div>
                      </div>
                      <div className="w-full bg-amber-950/50 h-1 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="bg-amber-400 h-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          style={{ width: `${Math.min(100, Math.max(0, (activeEffects.double - currentTime) / 100))}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Health */}
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <div className={`p-2 rounded-xl border transition-colors ${health < 30 ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-green-500/10 border-green-500/20'}`}>
                  <HeartPulse className={`${health < 30 ? 'text-red-500 animate-pulse' : 'text-green-500'} w-5 h-5`} />
                </div>
                <div className="w-32">
                  <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1 font-bold">{t('bufferIntegrity')}</div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className={`h-full shadow-[0_0_10px_rgba(34,197,94,0.3)] ${health < 30 ? 'bg-red-500 shadow-red-500/50' : 'bg-green-500'}`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${health}%` }}
                      transition={{ type: 'spring', bounce: 0 }}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                {(gameState === 'playing' || gameState === 'paused') && (
                  <button
                    onClick={togglePause}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                    title={gameState === 'playing' ? t('pause') : t('resume')}
                  >
                    {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                  title={soundEnabled ? t('soundOn') : t('soundOff')}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleLang}
                  className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95 text-xs font-bold tracking-tight"
                >
                  <span className="opacity-70">{lang === 'en' ? '🇰🇭' : '🇬🇧'}</span>
                  <span className="ml-1.5">{t('langLabel')}</span>
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Game Area */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 pb-2  overflow-hidden bg-[#0a0a0a]">

        {/* Canvas Layer */}
        <div className="relative border-2 border-gray-800 rounded-xl overflow-hidden shadow-2xl bg-[#151619] h-full w-full max-w-5xl aspect-[4/3] max-h-[80vh] sm:mt-5 md:mt-10 lg:mt-20">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block w-full h-full object-contain mt-10"
          />

          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] opacity-20"></div>
        </div>

        {/* Input Area */}
        <div className="mt-6 w-full max-w-5xl relative z-20">
          <form onSubmit={handleInputSubmit} className="relative">
            {/* <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-green-500 font-bold">{'>'}</span>
            </div> */}
            <motion.input
              animate={inputError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.3 }}
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={gameState === 'playing' ? t('typeAnswer') : t('sysOffline')}
              disabled={gameState !== 'playing'}
              autoFocus
              maxLength={gameMode === 'stream' ? 3 : undefined}
              className={`w-full bg-[#151619] border-2 text-white font-mono text-lg rounded-lg py-3 pl-10 pr-4 text-center focus:outline-none focus:ring-1 transition-all placeholder-gray-600 ${inputError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                }`}
            />
            {/* <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs text-gray-500 animate-pulse">_</span>
            </div> */}
          </form>

          {/* Keyboard Shortcuts Hint */}
          <div className="flex justify-center gap-6  mt-3 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300 font-bold">ESC</kbd> {t('pause')}</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300 font-bold">SHIFT + R</kbd> {t('restart')}</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300 font-bold">SHIFT + M</kbd> {t('mute')}</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-300 font-bold">SHIFT + P</kbd> {t('pause')}</span>
          </div>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm p-4"
            >
              <div className="relative bg-[#151619]/90 border border-white/10 p-8 rounded-3xl max-w-2xl w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                {/* Top Right Controls */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                    title={soundEnabled ? t('soundOn') : t('soundOff')}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleLang}
                    className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95 text-xs font-bold tracking-tight"
                  >
                    <span className="opacity-70">{lang === 'en' ? '🇰🇭' : '🇬🇧'}</span>
                    <span className="ml-1.5">{t('langLabel')}</span>
                  </button>
                </div>

                <div className="mb-8 flex justify-center">
                  <img
                    src="typing-math-game-logo.png"
                    alt="Typing Math Game Logo"
                    className="w-52 h-auto object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                  />
                </div>

                <p className="text-gray-400 mb-10 text-sm tracking-wide">{t('subtitle')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  {/* Data Stream Card */}
                  <button
                    onClick={() => setGameMode('stream')}
                    className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all text-left group ${gameMode === 'stream'
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                      : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                  >
                    {gameMode === 'stream' && (
                      <motion.div
                        layoutId="mode-glow"
                        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none"
                      />
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${gameMode === 'stream' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-500'}`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg tracking-tight ${gameMode === 'stream' ? 'text-white' : 'text-gray-400'}`}>{t('dataStream')}</h3>
                        <div className="text-[10px] text-gray-500 mt-0.5 font-mono uppercase tracking-wider">
                          {t('highScore')}: {highScores.stream[difficulty]}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors">
                      {t('streamDesc')}
                    </p>
                  </button>

                  {/* CPU Overload Card */}
                  <button
                    onClick={() => setGameMode('cpu')}
                    className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all text-left group ${gameMode === 'cpu'
                      ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                      : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                      }`}
                  >
                    {gameMode === 'cpu' && (
                      <motion.div
                        layoutId="mode-glow"
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"
                      />
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${gameMode === 'cpu' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                        <Calculator className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg tracking-tight ${gameMode === 'cpu' ? 'text-white' : 'text-gray-400'}`}>{t('cpuOverload')}</h3>
                        <div className="text-[10px] text-gray-500 mt-0.5 font-mono uppercase tracking-wider">
                          {t('highScore')}: {highScores.cpu[difficulty]}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors">
                      {t('cpuDesc')}
                    </p>
                  </button>
                </div>

                {/* Difficulty Selector */}
                <div className="flex justify-center mb-10">
                  <div className="inline-flex p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all relative z-10 ${difficulty === d
                          ? 'text-black'
                          : 'text-gray-500 hover:text-gray-300'
                          }`}
                      >
                        {difficulty === d && (
                          <motion.div
                            layoutId="difficulty-bg"
                            className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        {t(d as 'easy' | 'medium' | 'hard')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={startGame}
                    className={`w-full font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl ${gameMode === 'cpu'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/20'
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-cyan-500/20'
                      }`}
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span className="uppercase tracking-[0.1em]">{gameMode === 'cpu' ? t('initCpu') : t('initStream')}</span>
                  </button>

                  <button
                    onClick={() => setGameState('tutorial')}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all tracking-[0.1em] uppercase text-sm"
                  >
                    <GraduationCap className="w-5 h-5" />
                    {t('trainingProtocol')}
                  </button>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
                  <div className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-medium">
                    &copy; 2026 Powered by KOOMPI
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'tutorial' && (
            <Tutorial
              onComplete={goToMenu}
              onExit={goToMenu}
            />
          )}

          {gameState === 'gameover' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 backdrop-blur-md"
            >
              <div className="bg-[#151619] border border-red-900/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                    <Activity className="w-10 h-10 text-red-500" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2 text-red-500">{t('sysCrashed')}</h2>
                <p className="text-gray-400 mb-6">{t('bufferOverflow')}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase">{t('finalScore')}</div>
                    <div className="text-2xl font-bold text-white">{score}</div>
                    {score >= highScores[gameMode][difficulty] && score > 0 && (
                      <div className="text-xs text-yellow-500 font-bold mt-1 animate-pulse">{t('newHighScore')}</div>
                    )}
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="text-xs text-gray-500 uppercase">{t('levelReached')}</div>
                    <div className="text-2xl font-bold text-white">{level}</div>
                  </div>
                </div>

                <div className="bg-gray-900/60 border border-gray-700 rounded-lg px-4 py-3 mb-6 text-left">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">{t('tip')}</div>
                  {level <= 2
                    ? <p className="text-xs text-gray-400">{t('tipPowerup')}</p>
                    : <p className="text-xs text-gray-400">{t('tipHealth')}</p>
                  }
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={startGame}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t('reboot')}
                  </button>

                  <button
                    onClick={goToMenu}
                    className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    {t('returnMenu')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-md p-4"
            >
              <div className="relative bg-[#151619]/90 border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <Pause className="w-10 h-10 text-blue-500 fill-current opacity-80" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-2 tracking-tight uppercase text-white">{t('sysOffline')}</h2>
                <p className="text-gray-400 mb-10 text-sm tracking-wide">{t('subtitle')}</p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={togglePause}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 uppercase tracking-wider text-sm"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    {t('resume')}
                  </button>

                  <button
                    onClick={goToMenu}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all tracking-wider uppercase text-sm"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    {t('returnMenu')}
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                    {t('pause')} <span className="text-gray-600">|</span> <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700 text-gray-400">ESC</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar / Reference */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-[#0f0f11] border-l border-gray-800 transform transition-transform duration-300 z-40 ${showReference ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              {t('referenceTitle')}
            </h3>
            <button onClick={() => setShowReference(false)} className="text-gray-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3 border-b border-yellow-400/20 pb-2">{t('powerUps')}</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="bg-gray-900 p-2 rounded flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">{t('slowPowerName')}</span>
                  <span>{t('slowPowerDesc')}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded flex items-start gap-2">
                  <span className="text-blue-400 font-bold shrink-0">{t('shieldPowerName')}</span>
                  <span>{t('shieldPowerDesc')}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">{t('doublePowerName')}</span>
                  <span>{t('doublePowerDesc')}</span>
                </div>
                <p className="text-gray-600 text-[10px] pt-1">{t('powerGlowHint')}</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Toggle Reference Button */}
      {!showReference && (
        <button
          onClick={() => setShowReference(true)}
          className="fixed right-4 bottom-4 bg-[#151619] border border-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-30"
          title={t('openReference')}
        >
          <BookOpen className="w-6 h-6 text-gray-400" />
        </button>
      )}
    </div>
  );
}
