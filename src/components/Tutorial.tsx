import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, Check, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useLang } from "../LanguageContext";

interface TutorialProps {
  onComplete: () => void;
  onExit: () => void;
}

const FINGER_COLORS = {
  l_pinky: "bg-red-500",
  l_ring: "bg-orange-500",
  l_middle: "bg-yellow-500",
  l_index: "bg-green-500",
  r_index: "bg-blue-500",
  r_middle: "bg-purple-500",
  r_ring: "bg-pink-500",
  r_pinky: "bg-rose-500",
};

const KEY_MAP: Record<string, string> = {
  "1": "l_pinky",
  "2": "l_ring",
  "3": "l_middle",
  "4": "l_index",
  "5": "l_index",
  "6": "r_index",
  "7": "r_index",
  "8": "r_middle",
  "9": "r_ring",
  "0": "r_pinky",
  Q: "l_pinky",
  W: "l_ring",
  E: "l_middle",
  R: "l_index",
  T: "l_index",
  Y: "r_index",
  U: "r_index",
  I: "r_middle",
  O: "r_ring",
  P: "r_pinky",
  A: "l_pinky",
  S: "l_ring",
  D: "l_middle",
  F: "l_index",
  G: "l_index",
  H: "r_index",
  J: "r_index",
  K: "r_middle",
  L: "r_ring",
  ";": "r_pinky",
  Z: "l_pinky",
  X: "l_ring",
  C: "l_middle",
  V: "l_index",
  B: "l_index",
  N: "r_index",
  M: "r_index",
  ",": "r_middle",
  ".": "r_ring",
  "/": "r_pinky",
};

// STEPS and FINGER_NAMES are defined inside the component (see below)
// so they react to language changes via useLang()

// Solid block finger component
const BlockFinger: React.FC<{
  x: number;
  y: number;
  height: number;
  width: number;
  color: string;
  label: string;
  isActive: boolean;
  dim?: boolean;
}> = ({ x, y, height, width, color, label, isActive, dim }) => (
  <g className="transition-all duration-300">
    {/* Solid finger body */}
    <rect
      x={x}
      y={y - height}
      width={width}
      height={height}
      rx={width / 2}
      ry={width / 2}
      fill={isActive ? color : color + "30"}
      stroke={color}
      strokeWidth={isActive ? 2 : 1}
      opacity={dim ? 0.25 : isActive ? 1 : 0.7}
    />
    {/* Number label embedded in fingertip */}
    <text
      x={x + width / 2}
      y={y - height + 18}
      textAnchor="middle"
      fill={isActive ? "#fff" : color}
      fontSize={label.length > 2 ? "9" : "11"}
      fontWeight="bold"
      fontFamily="monospace"
      opacity={dim ? 0.3 : isActive ? 1 : 0.9}
    >
      {label}
    </text>
    {/* Active glow */}
    {isActive && !dim && (
      <rect
        x={x - 3}
        y={y - height - 3}
        width={width + 6}
        height={height + 6}
        rx={width / 2 + 2}
        ry={width / 2 + 2}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.4}
      >
        <animate
          attributeName="opacity"
          values="0.4;0.15;0.4"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </rect>
    )}
  </g>
);

// Left hand: labels[0]=pinky, [1]=ring, [2]=middle, [3]=index
const LeftHandDiagram = ({
  activeFinger,
  labels,
}: {
  activeFinger?: string;
  labels: string[];
}) => {
  const w = 26;
  const gap = 4;
  const baseY = 195;
  const palmW = 4 * w + 3 * gap + 8;
  const fingers: [string, number, string, string][] = [
    ["l_pinky", 78, "#ef4444", labels[0]],
    ["l_ring", 94, "#f97316", labels[1]],
    ["l_middle", 105, "#eab308", labels[2]],
    ["l_index", 90, "#22c55e", labels[3]],
  ];
  const isPractice = !!activeFinger;
  return (
    <div className="flex flex-col items-center justify-end shrink-0 opacity-90">
      <svg width="160" height="280" viewBox="0 0 160 280">
        {/* Fingers */}
        {fingers.map(([id, h, color, label], i) => (
          <BlockFinger
            key={id}
            x={8 + i * (w + gap)}
            y={baseY}
            height={h}
            width={w}
            color={color}
            label={label}
            isActive={activeFinger === id}
            dim={isPractice && activeFinger !== id}
          />
        ))}

        {/* Thumb */}
        <rect
          x={8 + 4 * (w + gap)}
          y={baseY - 30}
          width={20}
          height={35}
          rx={10}
          fill="#334155"
          stroke="#475569"
          strokeWidth={1}
          opacity={0.4}
          transform={`rotate(20, ${8 + 4 * (w + gap) + 10}, ${baseY - 12})`}
        />

        {/* Palm */}
        <rect
          x={4}
          y={baseY}
          width={palmW}
          height={40}
          rx={12}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth={1.5}
          opacity={0.7}
        />
        <text
          x={palmW / 2 + 4}
          y={baseY + 25}
          textAnchor="middle"
          fill="#475569"
          fontSize="9"
          fontWeight="600"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          LEFT
        </text>

        {/* Wrist */}
        <rect
          x={palmW / 2 - 22}
          y={baseY + 38}
          width={52}
          height={30}
          rx={8}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth={1}
          opacity={0.5}
        />
      </svg>
    </div>
  );
};

// Right hand: labels[0]=index, [1]=middle, [2]=ring, [3]=pinky
const RightHandDiagram = ({
  activeFinger,
  labels,
}: {
  activeFinger?: string;
  labels: string[];
}) => {
  const w = 26;
  const gap = 4;
  const baseY = 195;
  const palmW = 4 * w + 3 * gap + 8;
  const startX = 160 - palmW;
  const fingers: [string, number, string, string][] = [
    ["r_index", 90, "#3b82f6", labels[0]],
    ["r_middle", 105, "#a855f7", labels[1]],
    ["r_ring", 94, "#ec4899", labels[2]],
    ["r_pinky", 78, "#f43f5e", labels[3]],
  ];
  const isPractice = !!activeFinger;
  return (
    <div className="flex flex-col items-center justify-end shrink-0 opacity-90">
      <svg width="160" height="280" viewBox="0 0 160 280">
        {/* Thumb */}
        <rect
          x={startX - 24}
          y={baseY - 30}
          width={20}
          height={35}
          rx={10}
          fill="#334155"
          stroke="#475569"
          strokeWidth={1}
          opacity={0.4}
          transform={`rotate(-20, ${startX - 14}, ${baseY - 12})`}
        />

        {/* Fingers */}
        {fingers.map(([id, h, color, label], i) => (
          <BlockFinger
            key={id}
            x={startX + i * (w + gap)}
            y={baseY}
            height={h}
            width={w}
            color={color}
            label={label}
            isActive={activeFinger === id}
            dim={isPractice && activeFinger !== id}
          />
        ))}

        {/* Palm */}
        <rect
          x={startX - 4}
          y={baseY}
          width={palmW}
          height={40}
          rx={12}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth={1.5}
          opacity={0.7}
        />
        <text
          x={startX + palmW / 2 - 4}
          y={baseY + 25}
          textAnchor="middle"
          fill="#475569"
          fontSize="9"
          fontWeight="600"
          fontFamily="sans-serif"
          letterSpacing="0.5"
        >
          RIGHT
        </text>

        {/* Wrist */}
        <rect
          x={startX + palmW / 2 - 30}
          y={baseY + 38}
          width={52}
          height={30}
          rx={8}
          fill="#0f172a"
          stroke="#334155"
          strokeWidth={1}
          opacity={0.5}
        />
      </svg>
    </div>
  );
};

export default function Tutorial({ onComplete, onExit }: TutorialProps) {
  const { t } = useLang();

  const STEPS = useMemo(
    () => [
      {
        title: t("t1Title"),
        content: t("t1Content"),
        action: "press_any",
      },
      {
        title: t("t2Title"),
        content: t("t2Content"),
        action: "press_any",
        showKeyboard: true,
        highlightHomeRow: true,
      },
      {
        title: t("t3Title"),
        content: t("t3Content"),
        action: "press_any",
        showKeyboard: true,
        highlightNumbers: true,
      },
      {
        title: t("t4Title"),
        content: t("t4Content"),
        action: "type_sequence",
        sequence: ["1", "2", "3", "4", "5"],
        showKeyboard: true,
      },
      {
        title: t("t5Title"),
        content: t("t5Content"),
        action: "type_sequence",
        sequence: ["6", "7", "8", "9", "0"],
        showKeyboard: true,
      },
      {
        title: t("t6Title"),
        content: t("t6Content"),
        action: "type_sequence",
        sequence: ["1", "0", "3", "8", "5", "6"],
        showKeyboard: true,
      },
      {
        title: t("t7Title"),
        content: t("t7Content"),
        action: "press_any",
      },
    ],
    [t],
  );

  const FINGER_NAMES: Record<string, string> = {
    l_pinky: t("lPinky"),
    l_ring: t("lRing"),
    l_middle: t("lMiddle"),
    l_index: t("lIndex"),
    r_index: t("rIndex"),
    r_middle: t("rMiddle"),
    r_ring: t("rRing"),
    r_pinky: t("rPinky"),
  };
  const [currentStep, setCurrentStep] = useState(0);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const typingBufferRef = useRef<AudioBuffer | null>(null);

  const step = STEPS[currentStep];

  // Determine active finger for current target
  const targetChar =
    step.action === "type_sequence" ? step.sequence![sequenceIndex] : null;
  const activeFinger = targetChar ? KEY_MAP[targetChar] : undefined;

  // Dynamic finger labels based on current step context
  // Default labels: left = [pinky, ring, middle, index], right = [index, middle, ring, pinky]
  const defaultLeftLabels = ["1", "2", "3", "4,5"];
  const defaultRightLabels = ["6,7", "8", "9", "0"];
  const homeRowLeftLabels = ["A", "S", "D", "F"];
  const homeRowRightLabels = ["J", "K", "L", ";"];

  const getFingerLabels = (): { left: string[]; right: string[] } => {
    // Home row step — show alphabet labels on fingers
    if (step.highlightHomeRow) {
      return { left: homeRowLeftLabels, right: homeRowRightLabels };
    }
    // Numbers step (non-practice) — show numbers
    if (step.highlightNumbers && step.action !== 'type_sequence') {
      return { left: defaultLeftLabels, right: defaultRightLabels };
    }
    // Number practice steps — show number labels, highlight active finger's char
    if (step.action === 'type_sequence' && targetChar && activeFinger) {
      const left = defaultLeftLabels.map((lbl, i) => {
        const ids = ['l_pinky', 'l_ring', 'l_middle', 'l_index'];
        return ids[i] === activeFinger ? targetChar : lbl;
      });
      const right = defaultRightLabels.map((lbl, i) => {
        const ids = ['r_index', 'r_middle', 'r_ring', 'r_pinky'];
        return ids[i] === activeFinger ? targetChar : lbl;
      });
      return { left, right };
    }
    // Default
    return { left: defaultLeftLabels, right: defaultRightLabels };
  };

  const fingerLabels = getFingerLabels();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    // Auto-focus interval every 2s during sequence typing steps
    if (step.action === "type_sequence") {
      const interval = setInterval(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentStep, step.action]);

  useEffect(() => {
    const loadSound = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (
            window.AudioContext || (window as any).webkitAudioContext
          )();
        }
        const response = await fetch("sounds/typing.mp3");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );
        typingBufferRef.current = audioBuffer;
      } catch (error) {
        console.error("Failed to load typing sound in tutorial:", error);
      }
    };
    loadSound();
  }, []);

  // Sound Effects
  const playSound = (type: "type" | "correct" | "error" | "step") => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    const ctx = audioContextRef.current;

    // Resume context if suspended (browser policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case "type":
        if (typingBufferRef.current) {
          const source = ctx.createBufferSource();
          source.buffer = typingBufferRef.current;
          source.connect(gain);
          gain.gain.setValueAtTime(0.15, now);
          source.start(now);
        }
        else {
          osc.type = "square";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        }
        break;
      // case "correct":
      //   osc.type = "sine";
      //   osc.frequency.setValueAtTime(440, now); // A4
      //   osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
      //   gain.gain.setValueAtTime(0.1, now);
      //   gain.gain.linearRampToValueAtTime(0, now + 0.3);
      //   osc.start(now);
      //   osc.stop(now + 0.3);
      //   break;
      case "error":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      // case "step":
      //   osc.type = "sine";
      //   osc.frequency.setValueAtTime(220, now);
      //   osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      //   gain.gain.setValueAtTime(0.1, now);
      //   gain.gain.linearRampToValueAtTime(0, now + 0.3);
      //   osc.start(now);
      //   osc.stop(now + 0.3);
      //   break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step.action === "press_any") {
        // Only Enter key advances to next step
        if (e.key !== "Enter") return;
        if (e.repeat) return;
        nextStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, step.action]); // Re-bind when step changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (step.action !== "type_sequence") return;
    if (isError) return; // Prevent typing during error animation

    const val = e.target.value.toUpperCase();
    const inputChar = val.slice(-1); // Get the last character typed
    const target = step.sequence![sequenceIndex];

    // Only allow correct character
    if (inputChar === target) {
      playSound("type");
      setInput("");
      setIsError(false);
      if (sequenceIndex + 1 >= step.sequence!.length) {
        nextStep();
      } else {
        setSequenceIndex((prev) => prev + 1);
      }
    } else {
      // Shake or error effect
      playSound("error");
      setInput(inputChar);
      setIsError(true);
      setTimeout(() => {
        setInput("");
        setIsError(false);
      }, 400);
    }
  };

  const nextStep = () => {
    playSound("step");
    if (currentStep + 1 >= STEPS.length) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
      setSequenceIndex(0);
      setInput("");
      setIsError(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      playSound("step");
      setCurrentStep((prev) => prev - 1);
      setSequenceIndex(0);
      setInput("");
      setIsError(false);
    }
  };

  const isNumberKey = (char: string) =>
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(char);
  const isCharacter = (char: string) =>
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"].includes(char);
  const isHomeRowKey = (char: string) =>
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"].includes(char);

  const renderKey = (char: string, label?: string) => {
    const finger = KEY_MAP[char];
    const colorClass = finger
      ? FINGER_COLORS[finger as keyof typeof FINGER_COLORS]
      : "bg-gray-700";
    const isTarget =
      step.action === "type_sequence" && step.sequence![sequenceIndex] === char;
    const isNumberHighlight = step.highlightNumbers && isNumberKey(char);
    const isHomeRowHighlight = step.highlightHomeRow && isHomeRowKey(char);

    // All mapped keys show their finger color at full brightness
    let bgClass = "bg-gray-800 text-gray-400";
    if (finger) {
      bgClass = colorClass + " text-white";
    }

    return (
      <div
        className={`
        relative w-10 h-10 rounded flex flex-col items-center justify-center text-sm font-bold border-b-4 transition-all
        ${bgClass}
        ${isTarget ? "scale-110 border-white z-10 ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] brightness-125" : "border-black/20"}
        ${isNumberHighlight ? "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.6)] brightness-125" : ""}
        ${isHomeRowHighlight ? "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.6)] brightness-125" : ""}
      `}
      >
        <span>{char}</span>
        {label && (
          <span className="text-[8px] absolute bottom-0.5 opacity-50">
            {label}
          </span>
        )}
      </div>
    );
  };

  const ModifierKey = ({
    label,
    width = "w-10",
    className = "",
  }: {
    label: string;
    width?: string;
    className?: string;
  }) => (
    <div
      className={`${width} h-10 bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase border-b-4 border-black/20 ${className}`}
    >
      {label}
    </div>
  );

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-y-auto"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0f172a 0%, #020617 40%, #000000 100%)",
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 text-gray-500 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all z-10"
      >
        <X className="w-4 h-4" /> {t("exitTraining")}
      </button>

      {/* ── Step Progress Bar ─────────────────────────────── */}
      <div className="flex items-center gap-0 mb-8 relative z-10">
        {STEPS.map((_, idx) => (
          <React.Fragment key={idx}>
            {/* Step Dot */}
            <div
              className={`
              relative flex items-center justify-center rounded-full transition-all duration-500 font-bold text-xs
              ${idx < currentStep
                  ? "w-8 h-8 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  : idx === currentStep
                    ? "w-10 h-10 bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] ring-2 ring-blue-400/50"
                    : "w-8 h-8 bg-gray-800 text-gray-500 border border-gray-700"
                }
            `}
            >
              {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
              {idx === currentStep && (
                <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
              )}
            </div>
            {/* Connector Line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 transition-all duration-500 ${idx < currentStep ? "bg-emerald-500" : "bg-gray-800"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Main Content Card ─────────────────────────────── */}
      <div className="max-w-3xl w-full flex flex-col items-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            {/* Glassmorphism Card */}
            <div
              className="w-full mb-8 p-6 rounded-2xl border border-white/10 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Step Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4 tracking-wider uppercase">
                <Keyboard className="w-3 h-3" />
                {t("trainingProtocolTitle")} &middot; {currentStep + 1}/
                {STEPS.length}
              </div>

              {/* Title with gradient */}
              <h3
                className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa, #38bdf8, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {step.title}
              </h3>

              {/* Content */}
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed whitespace-pre-line max-w-xl mx-auto">
                {step.content}
              </p>
            </div>

            {/* ── Dynamic Content Area ─────────────────────── */}
            <div className="flex flex-col items-center justify-center mb-6 relative w-full gap-6">
              {step.action === "type_sequence" && (
                <div className="flex flex-col items-center gap-5 z-30">
                  {/* Sequence indicators */}
                  <div className="flex gap-3">
                    {step.sequence!.map((char, idx) => (
                      <motion.div
                        key={idx}
                        initial={false}
                        animate={
                          idx === sequenceIndex ? { scale: [1, 1.08, 1] } : {}
                        }
                        transition={{ duration: 1, repeat: Infinity }}
                        className={`
                          w-14 h-16 rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition-all duration-300
                          ${idx < sequenceIndex ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-400" : ""}
                          ${idx === sequenceIndex ? "bg-blue-500/15 border-blue-400 text-white shadow-[0_0_24px_rgba(59,130,246,0.4)]" : ""}
                          ${idx > sequenceIndex ? "bg-gray-800/50 border-gray-700/50 text-gray-600" : ""}
                        `}
                      >
                        {idx < sequenceIndex ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          char
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Finger hint */}
                  {activeFinger && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm font-medium text-blue-300 bg-blue-900/20 px-5 py-2.5 rounded-full border border-blue-500/20 backdrop-blur-sm"
                    >
                      {t("useFinger")}{" "}
                      <span className="font-bold text-white">
                        {FINGER_NAMES[activeFinger]}
                      </span>{" "}
                      {t("toPress")}{" "}
                      <span className="font-bold text-white text-lg">
                        {targetChar}
                      </span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Keyboard with hands on left and right */}
              {step.showKeyboard && (
                <div className="flex items-end justify-center gap-4">
                  {/* Left Hand */}
                  <LeftHandDiagram
                    activeFinger={activeFinger}
                    labels={fingerLabels.left}
                  />

                  {/* Keyboard */}
                  <div
                    className="relative flex flex-col gap-2 p-6 rounded-2xl border border-white/5 transition-all duration-300"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(17,24,39,0.6) 0%, rgba(10,15,25,0.8) 100%)",
                      boxShadow:
                        "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex flex-col gap-1 select-none">
                      {/* Row 1 - Number Row */}
                      <div className="flex gap-1 justify-center">
                        <ModifierKey label="~" width="w-8" />
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(
                          (k) => (
                            <React.Fragment key={k}>
                              {renderKey(k)}
                            </React.Fragment>
                          ),
                        )}
                        <ModifierKey label="-" />
                        <ModifierKey label="=" />
                        <ModifierKey label="Backspace" width="w-16" />
                      </div>
                      {/* Row 2 - QWERTY */}
                      <div className="flex gap-1 justify-center">
                        <ModifierKey label="Tab" width="w-12" />
                        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(
                          (k) => (
                            <React.Fragment key={k}>
                              {renderKey(k)}
                            </React.Fragment>
                          ),
                        )}
                        <ModifierKey label="[" />
                        <ModifierKey label="]" />
                        <ModifierKey label="\\" width="w-12" />
                      </div>
                      {/* Row 3 - Home Row */}
                      <div className="flex gap-1 justify-center">
                        <ModifierKey label="Caps" width="w-14" />
                        {["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"].map(
                          (k) => (
                            <React.Fragment key={k}>
                              {renderKey(k)}
                            </React.Fragment>
                          ),
                        )}
                        <ModifierKey label="'" />
                        <ModifierKey
                          label="Enter"
                          width="w-20"
                          className="bg-blue-900/30 text-blue-400 border-blue-900/50"
                        />
                      </div>
                      {/* Row 4 - Bottom Row */}
                      <div className="flex gap-1 justify-center">
                        <ModifierKey label="Shift" width="w-20" />
                        {["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"].map(
                          (k) => (
                            <React.Fragment key={k}>
                              {renderKey(k)}
                            </React.Fragment>
                          ),
                        )}
                        <ModifierKey label="Shift" width="w-24" />
                      </div>
                      {/* Row 5 - Space */}
                      <div className="flex gap-1 justify-center">
                        <ModifierKey label="Ctrl" width="w-12" />
                        <ModifierKey label="Alt" width="w-12" />
                        <div className="w-64 h-10 bg-gray-800/60 rounded border-b-4 border-black/20 flex items-center justify-center text-xs text-gray-600">
                          SPACE
                        </div>
                        <ModifierKey label="Alt" width="w-12" />
                        <ModifierKey label="Ctrl" width="w-12" />
                      </div>
                    </div>
                  </div>

                  {/* Right Hand */}
                  <RightHandDiagram
                    activeFinger={activeFinger}
                    labels={fingerLabels.right}
                  />
                </div>
              )}
            </div>

            {/* ── Action Area ─────────────────────────────── */}
            <div className="flex justify-center mt-2">
              {step.action === "press_any" ? (
                <div className="flex items-center gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={prevStep}
                      className="px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-gray-300 border border-gray-700 hover:bg-white/5 hover:border-gray-500 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" /> {t("back")}
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 text-white transition-all duration-200 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_28px_rgba(59,130,246,0.5)] hover:brightness-110"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    }}
                  >
                    {t("continue")} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <motion.input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleChange}
                    animate={
                      isError
                        ? {
                          x: [-10, 10, -10, 10, 0],
                          color: "#ef4444",
                          borderColor: "#ef4444",
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                        }
                        : {
                          x: 0,
                          color: "#ffffff",
                          borderColor: "#3b82f6",
                          backgroundColor: "transparent",
                        }
                    }
                    transition={{ duration: 0.4 }}
                    className="bg-transparent border-b-4 text-center text-4xl focus:outline-none w-40 py-2 font-mono transition-all rounded-t-lg"
                    autoFocus
                    onBlur={(e) => e.target.focus()}
                  />
                  {isError && (
                    <div className="absolute top-full left-0 right-0 text-center text-red-500 text-xs font-bold mt-2 animate-bounce">
                      {t("incorrectKey")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enter key hint for press_any steps */}
            {step.action === "press_any" && (
              <p className="text-gray-600 text-xs mt-4 tracking-wide">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 font-mono text-[10px] border border-gray-700">
                  Enter
                </kbd>{" "}
                to continue
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
