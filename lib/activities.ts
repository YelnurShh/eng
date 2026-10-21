import type { Locale } from "./i18n";

export type Localized = Record<Locale, string>;
const l = (kk: string, ru: string, en: string): Localized => ({ kk, ru, en });
export type GameKind = "word" | "sentence" | "dialogue";
export type Activity = { id: string; kind: GameKind; prompt: string; hint: Localized; answer: string; choices: string[]; explanation: Localized; xp: number };

export const activities: Activity[] = [
  { id: "w01", kind: "word", prompt: "I ___ English a little every day.", hint: l("Күн сайын ағылшынша жаттығамын.", "Я практикую английский каждый день.", "Choose the verb for regular practice."), answer: "practise", choices: ["practise", "forget", "close"], explanation: l("«Practise» — жаттығу. Күнделікті әрекетке Present Simple қолданылады.", "Practise — практиковаться. Для регулярных действий используется Present Simple.", "Practise means to do something regularly to improve. Use the present simple for habits."), xp: 15 },
  { id: "w02", kind: "word", prompt: "Could you ___ that, please?", hint: l("Қайта айтуды сыпайы сұра.", "Вежливо попроси повторить.", "Ask someone politely to say it again."), answer: "repeat", choices: ["leave", "repeat", "buy"], explanation: l("«Could you repeat that, please?» — қайта айта аласыз ба?", "Could you repeat that, please? — Не могли бы вы повторить?", "Could you repeat that, please? is a polite way to ask to hear something again."), xp: 15 },
  { id: "w03", kind: "word", prompt: "It's okay to make a ___.", hint: l("Қателік үйренуге көмектеседі.", "Ошибки помогают учиться.", "Learning includes getting things wrong."), answer: "mistake", choices: ["mistake", "window", "weather"], explanation: l("«Make a mistake» — қате жіберу. «Do a mistake» деп айтылмайды.", "Правильно make a mistake, а не do a mistake.", "We say make a mistake, not do a mistake."), xp: 15 },
  { id: "w04", kind: "word", prompt: "Let me ___ for a second.", hint: l("Ойлануға уақыт сұра.", "Попроси время подумать.", "Give yourself a moment before replying."), answer: "think", choices: ["think", "bring", "open"], explanation: l("«Let me think» — ойлануға рұқсат етіңіз. Сөйлемді жалғастыруға уақыт береді.", "Let me think даёт время сформулировать мысль.", "Let me think for a second gives you time to find your words."), xp: 15 },
  { id: "w05", kind: "word", prompt: "I feel ___ when I speak with a friend.", hint: l("Досыңмен сөйлескенде өзіңді жайлы сезінесің.", "С другом тебе спокойно и комфортно.", "Choose the feeling of being relaxed."), answer: "comfortable", choices: ["expensive", "comfortable", "delicious"], explanation: l("«Comfortable» — жайлы, еркін сезіну.", "Comfortable означает «комфортно, спокойно».", "Comfortable describes feeling relaxed and at ease."), xp: 15 },
  { id: "w06", kind: "word", prompt: "My favourite ___ is reading.", hint: l("Кітап оқу — сүйікті ісім.", "Чтение — моё любимое занятие.", "Reading is something you do for fun."), answer: "hobby", choices: ["hobby", "country", "answer"], explanation: l("«Hobby» — бос уақыттағы сүйікті іс.", "Hobby — увлечение в свободное время.", "A hobby is an activity you enjoy in your free time."), xp: 15 },
  { id: "w07", kind: "word", prompt: "I would ___ to ask a question.", hint: l("Сұрақ қойғың келетінін сыпайы айт.", "Вежливо скажи, что хочешь задать вопрос.", "Make a polite request."), answer: "like", choices: ["like", "need", "want"], explanation: l("«Would like to» — сыпайы ниет білдіру тіркесі.", "Would like to — вежливый способ выразить желание.", "Would like to is a polite way to say what you want to do."), xp: 15 },
  { id: "w08", kind: "word", prompt: "We learn ___ our mistakes.", hint: l("Қателерден сабақ аламыз.", "Мы учимся на ошибках.", "Choose the preposition used with learning from experience."), answer: "from", choices: ["on", "from", "under"], explanation: l("«Learn from» — бір нәрседен сабақ алу.", "Learn from — учиться на чём-то.", "Learn from connects learning to the experience that teaches us."), xp: 15 },
  { id: "w09", kind: "word", prompt: "Can you speak more ___, please?", hint: l("Баяуырақ сөйлеуді сұра.", "Попроси говорить медленнее.", "Ask for a slower speaking speed."), answer: "slowly", choices: ["slowly", "happy", "early"], explanation: l("«Slowly» — баяу. Ол «speak» әрекетін сипаттайды.", "Slowly — медленно. Это наречие описывает speak.", "Slowly is an adverb describing how someone speaks."), xp: 15 },
  { id: "w10", kind: "word", prompt: "I am ___ of my progress.", hint: l("Өз жетістігіңді мақтан тұт.", "Гордись своим прогрессом.", "Recognise something you have achieved."), answer: "proud", choices: ["proud", "afraid", "tired"], explanation: l("«Proud of» — бір нәрсені мақтан тұту.", "Proud of — гордиться чем-то.", "Proud of expresses satisfaction with an achievement."), xp: 15 },
  ...[
    ["s01", "I can speak English", l("Мен ағылшынша сөйлей аламын.", "Я могу говорить по-английски.", "Say that you have the ability to speak English.")],
    ["s02", "Could you help me please", l("Көмекті сыпайы сұра.", "Вежливо попроси о помощи.", "Make a polite request for help.")],
    ["s03", "I enjoy learning new things", l("Жаңа нәрсе үйренген ұнайды.", "Мне нравится узнавать новое.", "Talk about enjoying learning.")],
    ["s04", "Let me try one more time", l("Тағы бір рет тырысып көрейін.", "Позволь мне попробовать ещё раз.", "Ask for another chance to try.")],
    ["s05", "My favourite place is home", l("Сүйікті орным — үй.", "Моё любимое место — дом.", "Describe your favourite place.")],
    ["s06", "What do you like to do", l("Не істегенді ұнататынын сұра.", "Спроси, чем человек любит заниматься.", "Ask about someone's interests.")],
    ["s07", "Every small step helps me grow", l("Әр кішкентай қадам өсуге көмектеседі.", "Каждый маленький шаг помогает мне расти.", "Describe how small steps help you.")],
    ["s08", "I would like to visit London", l("Лондонға барғың келетінін айт.", "Скажи, что хочешь посетить Лондон.", "Talk about a place you would like to visit.")],
  ].map(([id, answer, hint]) => ({ id: id as string, kind: "sentence" as const, prompt: "", answer: answer as string, choices: (answer as string).split(" "), hint: hint as Localized, explanation: l(`Дұрыс реті: ${answer}.`, `Правильный порядок: ${answer}.`, `The sentence is: ${answer}.`), xp: 20 })),
  { id: "d01", kind: "dialogue", prompt: 'A new classmate says: "Hi! I am Alex."', hint: l("Өзіңді таныстыр.", "Представься в ответ.", "Introduce yourself in return."), answer: "Hi Alex! Nice to meet you. I'm Sam.", choices: ["Hi Alex! Nice to meet you. I'm Sam.", "Good night, yesterday.", "I have a question about maths."], explanation: l("Танысқанда сәлемдесіп, атыңды айт және «Nice to meet you» тіркесін қолдан.", "При знакомстве поздоровайся, назови имя и используй Nice to meet you.", "A greeting, your name, and nice to meet you make a friendly introduction."), xp: 20 },
  { id: "d02", kind: "dialogue", prompt: 'Your teacher asks: "What do you think?" You need a moment.', hint: l("Ойлануға уақыт сұра.", "Попроси время подумать.", "Give yourself a little time to think."), answer: "Let me think for a second.", choices: ["Let me think for a second.", "You are welcome.", "It is on the table."], explanation: l("Қысқа кідіріс сұрау — әңгімедегі табиғи әрекет.", "Попросить короткую паузу — естественная часть разговора.", "Asking for a brief pause is a normal part of a conversation."), xp: 20 },
  { id: "d03", kind: "dialogue", prompt: 'You did not hear a question clearly.', hint: l("Қайта айтуды өтін.", "Попроси повторить вопрос.", "Ask to hear the question again."), answer: "Could you say that again, please?", choices: ["I am thirteen.", "Could you say that again, please?", "See you tomorrow."], explanation: l("Сұрақты қайталауды өтіну түсінуге көмектеседі.", "Просьба повторить помогает понять вопрос.", "Asking for repetition helps you understand instead of guessing."), xp: 20 },
  { id: "d04", kind: "dialogue", prompt: 'A friend asks: "What do you do in your free time?"', hint: l("Хоббиің туралы жауап бер.", "Ответь о своём хобби.", "Reply with something you enjoy doing."), answer: "I like drawing and listening to music.", choices: ["It is five o'clock.", "I like drawing and listening to music.", "The library is near the park."], explanation: l("«Free time» — бос уақыт. «I like + -ing» үлгісі қолданылады.", "Free time — свободное время. Используй I like + -ing.", "Use I like followed by an -ing form to talk about activities you enjoy."), xp: 20 },
  { id: "d05", kind: "dialogue", prompt: 'You want to join a group activity.', hint: l("Қосылуға болатынын сұра.", "Спроси, можно ли присоединиться.", "Ask if you can take part."), answer: "Can I join you?", choices: ["Can I join you?", "How much is this?", "I lost my umbrella."], explanation: l("«Can I join you?» — сіздерге қосылсам бола ма?", "Can I join you? — Можно к вам присоединиться?", "Can I join you? is a simple, friendly way to enter a group activity."), xp: 20 },
  { id: "d06", kind: "dialogue", prompt: 'Someone says: "Your English is getting better!"', hint: l("Жылы пікірге жауап бер.", "Ответь на добрые слова.", "Respond to an encouraging comment."), answer: "Thank you! I've been practising.", choices: ["The bus leaves at six.", "Thank you! I've been practising.", "Can you open the book?"], explanation: l("Алғыс айтып, жаттығып жүргеніңді бөлісуге болады.", "Поблагодари и расскажи, что практикуешься.", "Accept the encouragement and mention the effort you have made."), xp: 20 },
];

export const speakingPrompts = [
  {id:"p01",topic:0,prompt:"Tell me about a place where you feel comfortable. What makes it special?"},
  {id:"p02",topic:0,prompt:"Describe a good day at school. What happens and who is with you?"},
  {id:"p03",topic:0,prompt:"What is something small that made you smile recently? Tell the story."},
  {id:"p04",topic:0,prompt:"Introduce yourself to a new classmate. Share three things about yourself."},
  {id:"p05",topic:1,prompt:"What do you enjoy doing in your free time? Why do you like it?"},
  {id:"p06",topic:1,prompt:"Recommend a book, film, or song to a friend. What do you like about it?"},
  {id:"p07",topic:1,prompt:"Teach someone the first steps of your favourite hobby."},
  {id:"p08",topic:1,prompt:"If you could try a new hobby this weekend, what would you choose?"},
  {id:"p09",topic:2,prompt:"What is one thing you would like to learn this year? How will you start?"},
  {id:"p10",topic:2,prompt:"Imagine your perfect job. What do you do and why do you enjoy it?"},
  {id:"p11",topic:2,prompt:"Where would you like to travel? Tell me three things you would do there."},
  {id:"p12",topic:2,prompt:"What advice would you give to yourself one year from now?"},
  {id:"p13",topic:3,prompt:"What would you like a visitor to know about Kazakhstan?"},
  {id:"p14",topic:3,prompt:"Describe your favourite place in Kazakhstan. What can people do there?"},
  {id:"p15",topic:3,prompt:"Tell a visitor about a Kazakh tradition or a special celebration."},
  {id:"p16",topic:3,prompt:"Recommend a local dish to a visitor. What is it like?"},
  {id:"p17",topic:4,prompt:"What is your favourite school subject, and why do you enjoy it?"},
  {id:"p18",topic:4,prompt:"Describe a helpful teacher. What do they do to support students?"},
  {id:"p19",topic:4,prompt:"What would you change about your school if you could?"},
  {id:"p20",topic:4,prompt:"Tell me about a school project you enjoyed working on."},
  {id:"p21",topic:5,prompt:"What makes someone a good friend? Give an example."},
  {id:"p22",topic:5,prompt:"How would you welcome a new student to your class?"},
  {id:"p23",topic:5,prompt:"Describe a fun day you spent with your friends."},
  {id:"p24",topic:5,prompt:"Your friend feels nervous about a test. What would you say?"},
  {id:"p25",topic:6,prompt:"You are visiting a new city. Ask someone for directions to a museum."},
  {id:"p26",topic:6,prompt:"What three things would you pack for a weekend trip, and why?"},
  {id:"p27",topic:6,prompt:"Describe a journey you remember. Where did you go?"},
  {id:"p28",topic:6,prompt:"You are at a hotel. Ask about breakfast and the checkout time."},
  {id:"p29",topic:7,prompt:"Describe how to make your favourite simple meal."},
  {id:"p30",topic:7,prompt:"You are in a cafe. Order a drink and something to eat politely."},
  {id:"p31",topic:7,prompt:"What food would you recommend to a friend visiting your home?"},
  {id:"p32",topic:7,prompt:"Plan a picnic. What food will you bring, and why?"},
  {id:"p33",topic:8,prompt:"What app helps you learn something? Explain how you use it."},
  {id:"p34",topic:8,prompt:"What would a day without your phone be like?"},
  {id:"p35",topic:8,prompt:"Describe a useful invention and how it changes daily life."},
  {id:"p36",topic:8,prompt:"What advice would you give about being kind online?"},
  {id:"p37",topic:9,prompt:"Describe a place in nature where you feel relaxed."},
  {id:"p38",topic:9,prompt:"What can your class do to reduce waste at school?"},
  {id:"p39",topic:9,prompt:"What is your favourite season? Describe what you like doing then."},
  {id:"p40",topic:9,prompt:"Tell me about an animal you find interesting and why."},
  {id:"p41",topic:10,prompt:"What sport or physical activity do you enjoy, and why?"},
  {id:"p42",topic:10,prompt:"Explain the basic rules of a game you know."},
  {id:"p43",topic:10,prompt:"How would you encourage a teammate who made a mistake?"},
  {id:"p44",topic:10,prompt:"Plan an active afternoon with a friend. What would you do?"},
  {id:"p45",topic:11,prompt:"Describe your morning routine on a school day."},
  {id:"p46",topic:11,prompt:"How do you organise your time after school?"},
  {id:"p47",topic:11,prompt:"You need to buy a notebook. Ask a shop assistant for help."},
  {id:"p48",topic:11,prompt:"Tell me about one small thing that made you happy today."},
];

export const challengePrograms = [
  ["w01", "s01", "d01"], ["w05", "s05", "d04"], ["w02", "s02", "d03"], ["w04", "s06", "d02"], ["w06", "s03", "d05"], ["w08", "s08", "d06"], ["w10", "s07", "s04"],
];

export const rewards: Record<string, number> = {
  "first-word":20, "fear-test":60, "confidence-check":20, "mirror-thought":20,
  ...Object.fromEntries(activities.map(a=>[`game-${a.id}`,a.xp])),
  ...Object.fromEntries(speakingPrompts.map(p=>[`speak-${p.id}`,25])),
  ...Object.fromEntries(challengePrograms.map((_,i)=>[`challenge-${i+1}`,40])),
  ...Object.fromEntries(challengePrograms.flatMap((program,i)=>program.map((_,r)=>[`challenge-${i+1}-round-${r}`,0]))),
};
export const activityById = (id: string) => activities.find(a=>a.id===id)!;
export function shuffle<T>(items: T[], seed: number): T[] {
  const result = [...items]; let value=seed||1;
  for(let i=result.length-1;i>0;i--){value=(Math.imul(value,1664525)+1013904223)>>>0;const j=value%(i+1);[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
