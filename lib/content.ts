export type FearKey = "mistakes" | "words" | "judgement" | "freeze";

export const fears: Record<FearKey, { label: string; short: string; description: string; mission: string; color: string }> = {
  mistakes: {
    label: "Fear of mistakes",
    short: "Mistakes",
    description: "You may pause to make every sentence perfect. Speaking freely first can help you build momentum.",
    mission: "Speak for 30 seconds without correcting yourself. Keep going even if a sentence feels imperfect.",
    color: "#f3a762",
  },
  words: {
    label: "Finding the words",
    short: "Vocabulary",
    description: "The words you know can disappear under pressure. A few useful phrases can help you keep a conversation moving.",
    mission: "Choose five phrases you can use when you need time, then try two in a short conversation.",
    color: "#9a9bea",
  },
  judgement: {
    label: "Fear of judgement",
    short: "Other people",
    description: "It can feel risky to speak when others are listening. Practising in safe steps can make that moment easier.",
    mission: "Say one sentence to yourself, then to a trusted friend. Notice what actually happens.",
    color: "#e48ea8",
  },
  freeze: {
    label: "Mind going blank",
    short: "Going blank",
    description: "Stress can make it harder to recall what you know. A simple pause and restart phrase gives you a way forward.",
    mission: "Take one breath and say: “Let me think for a second.” Then share one simple idea.",
    color: "#8fcbbb",
  },
};

export const questions: { text: string; category: FearKey }[] = [
  { text: "I worry that I will make a grammar mistake.", category: "mistakes" },
  { text: "I stop mid-sentence to search for the perfect word.", category: "words" },
  { text: "I worry that others will laugh at my English.", category: "judgement" },
  { text: "My mind goes blank when someone asks me a question.", category: "freeze" },
  { text: "I replay small speaking mistakes long after they happen.", category: "mistakes" },
  { text: "I avoid speaking when I do not know a specific word.", category: "words" },
  { text: "I feel nervous speaking in front of classmates or a group.", category: "judgement" },
  { text: "Even a familiar topic feels difficult when I must answer quickly.", category: "freeze" },
  { text: "I would rather stay quiet than say something imperfect.", category: "mistakes" },
  { text: "I find it hard to continue after I forget what I planned to say.", category: "freeze" },
];

export const options = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Almost always", value: 3 },
];

export const challenge = [
  { day: 1, title: "Listen & repeat", detail: "Listen to a short English sentence and repeat it aloud three times.", time: "3 min", icon: "headphones" },
  { day: 2, title: "Mirror moment", detail: "Introduce yourself to your reflection. Smile, pause and start again if needed.", time: "3 min", icon: "sparkles" },
  { day: 3, title: "Record your voice", detail: "Record a 30-second answer about your day. Listen with curiosity, not criticism.", time: "5 min", icon: "mic" },
  { day: 4, title: "Talk to the room", detail: "Try a topic in the speaking room below. Aim for a complete idea, not a perfect answer.", time: "5 min", icon: "message" },
  { day: 5, title: "Speak with a friend", detail: "Ask a trusted person one question in English and answer one back.", time: "5 min", icon: "users" },
  { day: 6, title: "One-minute story", detail: "Talk about a small memory for one minute. Use “and then…” if you get stuck.", time: "7 min", icon: "clock" },
  { day: 7, title: "Your voice, your way", detail: "Share what you learned this week in English. Notice what feels easier now.", time: "8 min", icon: "trophy" },
] as const;

export const topics = [
  { title: "My world", prompt: "Tell me about a place where you feel comfortable. What makes it special?" },
  { title: "My hobby", prompt: "What is something you enjoy doing, and how did you first discover it?" },
  { title: "My future", prompt: "What is one thing you would like to learn or try in the future? Why?" },
  { title: "Kazakhstan", prompt: "What is one thing you would like a visitor to know about Kazakhstan?" },
];
