import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Circle,
  Play,
  Pause,
  Plus,
  RotateCcw,
  Send,
  Timer,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Room {
  id: number;
  name: string;
  members: string[];
  topic: string;
  messages: Message[];
}

interface Message {
  id: number;
  author: string;
  body: string;
  time: string;
  mine: boolean;
}

const SEED_ROOMS: Room[] = [
  {
    id: 1,
    name: "CS101 grind",
    members: ["Yuki T.", "Amara O.", "Daniel K.", "Sofia R.", "You"],
    topic: "Trees & Big-O revision",
    messages: [
      { id: 1, author: "Yuki T.", body: "Anyone up for grinding the week 8 problem set tonight?", time: "19:02", mine: false },
      { id: 2, author: "Amara O.", body: "In. I'll bring the annotated lecture notes from the Resources tab.", time: "19:04", mine: false },
      { id: 3, author: "Daniel K.", body: "Starting a 25-min pomodoro, join whenever 🍅", time: "19:05", mine: false },
      { id: 4, author: "You", body: "Joining now — tackling Q3 first.", time: "19:07", mine: true },
      { id: 5, author: "Sofia R.", body: "Q3 is the trickiest one, happy to explain heaps after the timer runs.", time: "19:09", mine: false },
    ],
  },
  {
    id: 2,
    name: "Math finals",
    members: ["Priya S.", "Noah B.", "Emma W.", "You"],
    topic: "Past paper 2023, Q4–Q7",
    messages: [
      { id: 1, author: "Priya S.", body: "2023 paper, Q4 is eigenvalues — try it solo for 15 minutes first.", time: "14:10", mine: false },
      { id: 2, author: "Noah B.", body: "Will do. Anyone finished Q5?", time: "14:22", mine: false },
      { id: 3, author: "You", body: "Halfway. The substitution in part (b) is sneaky.", time: "14:25", mine: true },
    ],
  },
  {
    id: 3,
    name: "Late night OS",
    members: ["Leo Z.", "Daniel K.", "You"],
    topic: "Scheduling algorithms",
    messages: [
      { id: 1, author: "Leo Z.", body: "Round robin vs SJF — who's presenting tomorrow?", time: "23:41", mine: false },
    ],
  },
];

const POMODORO_SECONDS = 25 * 60;

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function StudyRoom() {
  const [rooms, setRooms] = useState<Room[]>(SEED_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<number>(1);
  const [draft, setDraft] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Pomodoro state
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
  const [running, setRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          setCompletedSessions((c) => c + 1);
          toast.success("Pomodoro complete! 🍅", {
            description: "Take a 5-minute break, you earned it.",
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [rooms, activeRoomId]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? rooms[0];

  const sendMessage = () => {
    const body = draft.trim();
    if (!body) return;
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoomId
          ? {
              ...r,
              messages: [
                ...r.messages,
                {
                  id: Date.now(),
                  author: "You",
                  body,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  mine: true,
                },
              ],
            }
          : r,
      ),
    );
    setDraft("");
  };

  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(POMODORO_SECONDS);
  };

  return (
    <div className="space-y-6">
      {/* Pomodoro bar */}
      <div className="glass glass-soft flex flex-col items-center justify-between gap-4 rounded-2xl px-5 py-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8a3582]/15 to-[#bf9245]/25 text-primary">
            <Timer className="size-5" />
          </div>
          <div>
            <p
              className={cn(
                "text-3xl font-bold tabular-nums tracking-tight",
                running ? "text-[#e0b356]" : "text-card-foreground",
              )}
            >
              {formatTime(secondsLeft)}
            </p>
            <p className="text-xs text-glass-muted">
              Focus session · {completedSessions} completed today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setRunning((r) => !r)}
            className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white transition-transform duration-200 hover:scale-[1.03]"
          >
            {running ? (
              <>
                <Pause className="size-4" /> Pause
              </>
            ) : (
              <>
                <Play className="size-4" /> Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={resetTimer}
            className="glass-hover cursor-pointer rounded-xl bg-transparent"
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Main layout: rooms | chat | members */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr_220px]">
        {/* Room list */}
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 px-1 text-xs font-semibold tracking-wider uppercase text-glass-muted">
            <Users className="size-3.5" /> Study rooms
          </p>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setActiveRoomId(room.id);
                setRunning(false);
              }}
              className={cn(
                "glass w-full cursor-pointer rounded-2xl p-4 text-left transition-all duration-200",
                room.id === activeRoomId
                  ? "border-[#e0b356]/50 bg-white/10 dark:bg-white/10"
                  : "glass-hover",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold tracking-tight text-card-foreground">
                  {room.name}
                </p>
                <span className="flex items-center gap-1 text-xs text-glass-muted">
                  <Circle className="size-2 fill-[#7cd4a0] text-[#7cd4a0]" />
                  {room.members.length}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-glass-muted">
                {room.topic}
              </p>
            </button>
          ))}
          <button
            onClick={() =>
              toast.info("Room creation", {
                description: "Coming soon — rooms are curated for now.",
              })
            }
            className="glass glass-hover flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl p-4 text-sm font-medium text-glass-muted"
          >
            <Plus className="size-4" /> Create room
          </button>
        </div>

        {/* Chat panel */}
        <div className="glass flex h-[520px] flex-col rounded-3xl">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
            <div>
              <p className="font-semibold tracking-tight text-card-foreground">
                {activeRoom.name}
              </p>
              <p className="text-xs text-glass-muted">{activeRoom.topic}</p>
            </div>
            <span className="glass glass-soft rounded-full px-3 py-1 text-xs text-glass-muted">
              {activeRoom.members.length} online
            </span>
          </div>

          <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto p-5">
            {activeRoom.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.mine ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5",
                    m.mine
                      ? "bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white"
                      : "glass glass-soft text-card-foreground",
                  )}
                >
                  {!m.mine && (
                    <p className="mb-0.5 text-xs font-semibold text-[#e0b356]">
                      {m.author}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{m.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-right text-[10px]",
                      m.mine ? "text-white/70" : "text-glass-muted/70",
                    )}
                  >
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-black/10 p-4 dark:border-white/10">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder={`Message #${activeRoom.name.toLowerCase().replace(/\s+/g, "-")}…`}
              className="glass-hover h-11 rounded-xl bg-transparent"
            />
            <Button
              onClick={sendMessage}
              aria-label="Send message"
              className="size-11 shrink-0 cursor-pointer rounded-xl bg-gradient-to-r from-[#8a3582] to-[#bf9245] text-white transition-transform duration-200 hover:scale-[1.04]"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        {/* Member sidebar */}
        <div className="glass h-fit rounded-3xl p-5">
          <p className="text-xs font-semibold tracking-wider uppercase text-glass-muted">
            In this room
          </p>
          <div className="mt-4 space-y-3">
            {activeRoom.members.map((name) => (
              <div key={name} className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8a3582]/80 to-[#bf9245]/80 text-xs font-semibold text-white">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-glass-muted">
                    <Circle className="size-1.5 fill-[#7cd4a0] text-[#7cd4a0]" />
                    online
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
