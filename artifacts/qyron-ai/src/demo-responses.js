const HINGLISH_MARKERS = [
  'aap', 'aapka', 'aapki', 'akela', 'akeli', 'batao', 'banao', 'barahvi', 'chahiye',
  'dhanyavaad', 'hai', 'hain', 'ho', 'hoon', 'kaise', 'kaisa', 'kaisi', 'karna',
  'karo', 'ke', 'kyu', 'kyun', 'liye', 'madad', 'main', 'mujhe', 'nahin', 'nahi',
  'namaste', 'pareshan', 'padhai', 'please', 'samjhao', 'shukriya', 'sikho',
  'sikhna', 'suno', 'taiyari', 'tayaari', 'thaka', 'thaki', 'thoda', 'udas', 'yaar',
];

const CLASS_12_TERMS = [
  'class 12', 'class xii', 'grade 12', '12th class', '12th grade', '12vi',
  '12veen', 'barahvi', 'baarhvi', 'board exam', 'boards',
  'कक्षा 12', 'कक्षा बारह', 'बारहवीं', '12वीं', 'बारहवी',
];

const TOPIC_TERMS = {
  business: [
    'business', 'business idea', 'business plan', 'startup', 'entrepreneur',
    'side hustle', 'customer', 'market research', 'व्यवसाय', 'बिजनेस',
    'व्यापार', 'कारोबार', 'उद्यम', 'ग्राहक', 'बाजार', 'बाज़ार', 'कमाई',
    'धंधा', 'vyapar', 'karobar', 'grahak', 'kamai', 'dukaan', 'dhandha',
  ],
  coding: [
    'coding', 'programming', 'program', 'code', 'debug', 'bug', 'python',
    'javascript', 'typescript', 'html', 'css', 'c++', 'c#', 'java', 'sql',
    'react', 'function', 'loop', 'algorithm', 'कोडिंग', 'कोड', 'प्रोग्रामिंग',
    'प्रोग्राम', 'बग', 'त्रुटि', 'coding sikh', 'code likho',
  ],
  chemistry: [
    'chemistry', 'chemical', 'reaction', 'molecule', 'atom', 'mole concept',
    'periodic table', 'acid', 'base', 'oxidation', 'organic chemistry',
    'valency', 'h2o', 'water formula', 'formula for water',
    'रसायन विज्ञान', 'रसायन', 'रासायनिक', 'अभिक्रिया', 'अणु', 'परमाणु',
    'आवर्त सारणी', 'अम्ल', 'क्षार', 'ऑक्सीकरण', 'यौगिक', 'मोल',
    'rasayan', 'rasayan vigyan', 'parmanu', 'abhikriya', 'amla', 'kshar',
    'awart sarani', 'yaugik',
  ],
  physics: [
    'physics', 'newton', 'force', 'motion', 'velocity', 'acceleration',
    'energy', 'electricity', 'electric current', 'voltage', 'circuit',
    'gravity', 'magnetism', 'wave', 'optics', 'thermodynamics', 'ohm',
    'kinetic energy', 'भौतिकी', 'बल', 'गति', 'वेग', 'त्वरण', 'ऊर्जा',
    'न्यूटन', 'विद्युत', 'धारा', 'वोल्टेज', 'परिपथ', 'गुरुत्व', 'चुंबकत्व',
    'प्रकाश', 'तरंग', 'भौतिक विज्ञान', 'gati', 'tvaran', 'urja', 'vidyut',
    'gurutva', 'roshni',
  ],
  maths: [
    'math', 'maths', 'mathematics', 'algebra', 'calculus', 'geometry',
    'trigonometry', 'probability', 'quadratic', 'equation', 'derivative',
    'differentiation', 'integration', 'integral', 'matrix', 'matrices',
    'pythagoras', 'pitagoras', 'circle area', 'area of a circle',
    'गणित', 'बीजगणित', 'त्रिकोणमिति', 'कलन', 'समाकलन', 'अवकलन',
    'समीकरण', 'प्रायिकता', 'द्विघात', 'पाइथागोरस', 'वृत्त का क्षेत्रफल',
    'ganit', 'samikaran', 'avkal', 'samakalan',
  ],
};

const STUDY_TERMS = [
  'study', 'studying', 'homework', 'syllabus', 'exam prep', 'prepare for exam',
  'revision', 'revise', 'study plan', 'timetable', 'padhai', 'padhaai',
  'taiyari', 'tayaari', 'पढ़ाई', 'तैयारी', 'पुनरावृत्ति', 'रिवीजन',
  'परीक्षा', 'अध्याय',
];

const INTENT_TERMS = {
  study: STUDY_TERMS,
  debug: ['debug', 'bug', 'error', 'not working', 'does not work', 'fix my code', 'त्रुटि'],
  formula: ['formula', 'formulas', 'equation', 'सूत्र', 'फॉर्मूला', 'sutra'],
  practice: ['practice', 'practice questions', 'quiz', 'worksheet', 'numerical', 'numericals', 'अभ्यास', 'प्रश्न', 'सवाल'],
  solve: ['solve', 'calculate', 'evaluate', 'find the value', 'how much', 'हल करो', 'हल करें', 'निकालो', 'गणना', 'solve karo'],
  compare: ['compare', 'difference between', 'versus', 'vs', 'तुलना', 'अंतर'],
  why: ['why', 'क्यों', 'kyun', 'kyu'],
  how: ['how', 'कैसे', 'kaise', 'kis tarah'],
  explain: ['explain', 'meaning', 'what is', 'समझाओ', 'समझाइए', 'क्या है', 'matlab'],
};

const LABELS = {
  en: {
    general: 'General question',
    class12: 'Class 12 study',
    maths: 'Maths',
    physics: 'Physics',
    chemistry: 'Chemistry',
    coding: 'Coding',
    business: 'Business ideas',
  },
  hi: {
    general: 'सामान्य सवाल',
    class12: 'कक्षा 12 की पढ़ाई',
    maths: 'गणित',
    physics: 'भौतिकी',
    chemistry: 'रसायन विज्ञान',
    coding: 'कोडिंग',
    business: 'व्यापार के विचार',
  },
  hinglish: {
    general: 'General sawaal',
    class12: 'Class 12 ki padhai',
    maths: 'Maths',
    physics: 'Physics',
    chemistry: 'Chemistry',
    coding: 'Coding',
    business: 'Business ideas',
  },
};

const REPLIES = {
  en: {
    general: {
      default: 'This free, local demo has no live model or reference library, so it will not guess at facts. Add a topic and say whether you want a definition, steps, comparison, or example; I can give you a structured starting point.',
      why: 'For a “why” question, separate the cause, the process, and the result. Add the topic and I can lay out those parts as a short demo explanation.',
      how: 'For a “how” question, define the goal first, list the steps in order, then check the result. Share the topic for a more focused demo guide.',
      compare: 'For a comparison, name both things and compare them using the same criteria: purpose, key difference, and one example. This local demo cannot verify current facts.',
      explain: 'For a clear explanation, start with a one-line meaning, add an everyday example, then mention what the idea does not mean. Tell me the exact concept to use that structure.',
      study: 'For a study plan, choose one small topic, recall it without notes, then solve a few questions and review the gaps. Share your subject and available time for a sample schedule.',
    },
    class12: {
      default: 'For a Class 12 question, include the subject, chapter, and exact prompt. A useful answer structure is: core idea, definition or formula, worked steps, and a quick self-check. Check the latest syllabus and textbook for your board.',
      study: 'For Class 12 revision, follow your current board syllabus: spend one focused block recalling a topic without notes, then solve board-style questions and mark gaps. Share your board, subjects, and exam date for a sample timetable.',
    },
    maths: {
      default: 'Send the complete expression or question, including brackets and units. A reliable method is: identify the rule, show each step, then substitute the result back to check it. This demo calculates simple arithmetic, not every algebra problem.',
      formula: 'Name the chapter or formula you need. Check what each symbol means, when the formula applies, and any restrictions on the answer. I can show a few common formulas when the topic is named.',
      practice: 'Pick one chapter and try a worked example, then solve three similar questions without looking. Share the chapter and level for a focused practice outline.',
      solve: 'Type the full expression with brackets. I can calculate simple arithmetic locally; for algebra, show the equation and I’ll give a step-by-step solving checklist.',
      explain: 'For a maths concept, connect the definition to one small example, then check it with a second example. Tell me the exact concept or chapter.',
      study: 'Revise one formula or rule from memory, solve a worked example, then do a short set of mixed questions. Keep an error list and revisit it the next day.',
    },
    physics: {
      default: 'For a physics problem, list the known values with SI units, sketch the situation, choose the law, and check the units after calculating. Send the exact question; this demo does not verify every numerical result.',
      formula: 'Name the topic or law. Write each symbol with its unit, note when the equation applies, and check that both sides have matching units. I can show a few common laws by name.',
      practice: 'Try one concept question and one numerical for the same topic. For each numerical, write knowns, unknown, equation, substitution, and units.',
      solve: 'Share the full problem and all values. Start with a small diagram, convert values to SI units, select the relevant law, then check whether the answer’s units and size make sense.',
      explain: 'A useful physics explanation links the idea to an observable example, names the law, then shows what changes when one variable changes. Share the exact concept.',
      study: 'For each chapter, recall the key laws and units, then practise one diagram question and two numericals. Keep a list of formulas you confuse.',
    },
    chemistry: {
      default: 'Share the exact reaction, formula, or concept. For a reaction, list each element on both sides, balance atoms and charge, then check coefficients. For numerical questions, include units and given values.',
      formula: 'Name the chapter or quantity. Write what each symbol represents, its units, and the conditions where the formula is valid. I can show a few common formulas by topic.',
      practice: 'Practise one equation-balancing question and one concept question from the same chapter. Check atoms and total charge after every balancing step.',
      solve: 'Send the full question and values. Identify the substances, balance the equation if needed, choose the mole relationship, and keep units through each step.',
      explain: 'Start with the particle-level idea, connect it to the chemical equation, then give one example. Tell me the exact concept or reaction.',
      study: 'Make a short sheet of definitions, reaction patterns, and conditions. Practise balancing equations and explaining why each step works.',
    },
    coding: {
      default: 'Tell me the language, what you want the program to do, and one example input/output. For a bug, paste the smallest code snippet plus the exact error. This local demo cannot run or test code.',
      debug: 'For a bug, share the language, smallest failing snippet, exact error, expected result, and actual result. Check the first error line and test one change at a time; this demo cannot execute code.',
      explain: 'Name the language or concept and share the snippet if you have one. I can outline what to inspect, but this local demo does not execute programs.',
      study: 'Learn one concept at a time: read a tiny example, type it yourself, change one value, and predict the output before running it. Tell me the language and your goal.',
    },
    business: {
      default: 'Three low-cost ideas to test are tutoring a subject you know, making simple social posts for nearby shops, or taking pre-orders for a small homemade product. Pick one audience, ask five potential customers about the problem, and test interest before spending.',
      study: 'Turn the idea into a small test: name one customer group, the problem, your simplest offer, and how you would ask for payment. Talk to five likely customers before buying equipment or inventory.',
    },
  },
  hi: {
    general: {
      default: 'यह मुफ़्त, स्थानीय डेमो लाइव मॉडल या संदर्भ-पुस्तक का उपयोग नहीं करता, इसलिए यह तथ्यों का अंदाज़ा नहीं लगाएगा। विषय बताइए और चुनिए कि आपको परिभाषा, चरण, तुलना या उदाहरण चाहिए; मैं एक व्यवस्थित शुरुआती रूप दे सकता हूँ।',
      why: '“क्यों” वाले सवाल में कारण, प्रक्रिया और परिणाम अलग-अलग देखें। विषय बताइए; मैं इन्हें छोटे डेमो स्पष्टीकरण में रख दूँगा।',
      how: '“कैसे” वाले सवाल में पहले लक्ष्य तय करें, फिर चरण क्रम में लिखें और अंत में परिणाम जाँचें। विषय बताएँ तो मैं केंद्रित डेमो मार्गदर्शन दूँगा।',
      compare: 'तुलना के लिए दोनों चीज़ों के नाम दें और समान आधार रखें: उपयोग, मुख्य अंतर और एक उदाहरण। यह स्थानीय डेमो ताज़ा तथ्यों की पुष्टि नहीं कर सकता।',
      explain: 'स्पष्ट समझ के लिए पहले एक पंक्ति में अर्थ बताएँ, फिर रोज़मर्रा का उदाहरण दें और अंत में बताएं कि उस विचार का क्या अर्थ नहीं है। विषय बताइए।',
      study: 'पढ़ाई के लिए एक छोटा विषय चुनें, बिना नोट्स देखे याद करें, फिर कुछ सवाल हल करके कमज़ोर हिस्से दोहराएँ। विषय और उपलब्ध समय बताएँ तो मैं नमूना योजना दूँगा।',
    },
    class12: {
      default: 'कक्षा 12 के सवाल के साथ विषय, अध्याय और पूरा प्रश्न लिखें। अच्छे उत्तर का क्रम है: मुख्य विचार, परिभाषा या सूत्र, हल के चरण और छोटी जाँच। अपने बोर्ड का नवीनतम पाठ्यक्रम और किताब भी देखें।',
      study: 'कक्षा 12 की तैयारी अपने मौजूदा बोर्ड पाठ्यक्रम के अनुसार करें: एक केंद्रित सत्र में विषय बिना नोट्स याद करें, फिर बोर्ड-जैसे सवाल हल करके कमज़ोरियाँ लिखें। बोर्ड, विषय और परीक्षा की तारीख बताएँ तो नमूना समय-सारिणी दूँगा।',
    },
    maths: {
      default: 'पूरा सवाल या समीकरण भेजें—कोष्ठक और इकाइयाँ भी शामिल करें। तरीका: नियम पहचानें, हर चरण लिखें, फिर उत्तर को वापस रखकर जाँचें। यह डेमो आसान अंकगणित करता है, हर बीजगणित सवाल नहीं।',
      formula: 'अध्याय या सूत्र का नाम बताएँ। हर चिन्ह का अर्थ, सूत्र कब लागू होता है और उत्तर की सीमाएँ जाँचें। विषय बताएँ तो कुछ आम सूत्र दिखा सकता हूँ।',
      practice: 'एक अध्याय चुनें: पहले हल किया हुआ उदाहरण देखें, फिर बिना देखे ऐसे तीन सवाल करें। अध्याय और कक्षा बताएँ तो अभ्यास की रूपरेखा दूँगा।',
      solve: 'पूरा सवाल और कोष्ठक सहित लिखें। आसान गणना यह डेमो स्थानीय रूप से कर सकता है; बीजगणित के लिए समीकरण भेजें, मैं चरणों की जाँच-सूची दूँगा।',
      explain: 'गणित की अवधारणा को परिभाषा और छोटे उदाहरण से जोड़ें, फिर दूसरे उदाहरण से जाँचें। अवधारणा या अध्याय बताएँ।',
      study: 'एक सूत्र या नियम याद से लिखें, उदाहरण हल करें, फिर मिले-जुले सवाल करें। जिन चरणों में गलती हुई, उन्हें सूची में लिखकर अगले दिन दोहराएँ।',
    },
    physics: {
      default: 'भौतिकी के सवाल में दी गई राशियाँ और SI इकाइयाँ लिखें, स्थिति का छोटा चित्र बनाएँ, नियम चुनें और गणना के बाद इकाइयाँ जाँचें। पूरा सवाल भेजें; यह डेमो हर संख्यात्मक उत्तर की पुष्टि नहीं करता।',
      formula: 'विषय या नियम का नाम बताएँ। हर चिन्ह और इकाई लिखें, सूत्र कब लागू होता है देखें और दोनों ओर की इकाइयाँ मिलाएँ। नाम बताएँ तो कुछ आम नियम दिखा सकता हूँ।',
      practice: 'एक ही विषय से एक अवधारणा वाला सवाल और एक संख्यात्मक सवाल करें। हर गणना में ज्ञात मान, अज्ञात मान, सूत्र, मान रखना और इकाइयाँ लिखें।',
      solve: 'पूरा सवाल और सभी मान भेजें। चित्र बनाएँ, मान SI इकाइयों में बदलें, नियम चुनें, फिर उत्तर की इकाइयाँ और आकार जाँचें।',
      explain: 'भौतिकी की समझ को देखे जा सकने वाले उदाहरण से जोड़ें, नियम का नाम बताएँ और समझाएँ कि एक मान बदलने पर क्या बदलेगा। विषय बताएँ।',
      study: 'हर अध्याय के नियम और इकाइयाँ याद से लिखें, फिर एक चित्र वाला सवाल और दो गणनाएँ करें। जिन सूत्रों में भ्रम होता है, उनकी सूची रखें।',
    },
    chemistry: {
      default: 'पूरा रासायनिक समीकरण, सूत्र या अवधारणा भेजें। अभिक्रिया में दोनों ओर हर तत्व गिनें, फिर परमाणु और आवेश संतुलित करके जाँचें। गणना के सवाल में मान और इकाइयाँ दें।',
      formula: 'अध्याय या राशि का नाम बताएँ। हर चिन्ह का अर्थ, इकाई और सूत्र के लागू होने की शर्तें लिखें। विषय बताएँ तो कुछ आम सूत्र दिखा सकता हूँ।',
      practice: 'एक ही अध्याय से समीकरण संतुलन और अवधारणा के सवाल करें। हर चरण के बाद परमाणुओं और कुल आवेश की जाँच करें।',
      solve: 'पूरा सवाल और मान भेजें। पदार्थ पहचानें, ज़रूरत हो तो समीकरण संतुलित करें, मोल संबंध चुनें और हर चरण में इकाइयाँ रखें।',
      explain: 'पहले कणों के स्तर पर विचार समझें, फिर उसे रासायनिक समीकरण से जोड़ें और एक उदाहरण दें। अवधारणा या अभिक्रिया बताएँ।',
      study: 'परिभाषाओं, अभिक्रिया के ढाँचों और शर्तों की छोटी सूची बनाएँ। समीकरण संतुलित करें और हर चरण का कारण समझें।',
    },
    coding: {
      default: 'भाषा, प्रोग्राम का लक्ष्य और एक नमूना इनपुट/आउटपुट बताएँ। बग के लिए छोटा कोड और पूरा त्रुटि-संदेश भेजें। यह स्थानीय डेमो कोड चला या जाँच नहीं सकता।',
      debug: 'बग के लिए भाषा, सबसे छोटा विफल कोड, पूरा त्रुटि-संदेश, अपेक्षित और मिला हुआ परिणाम भेजें। पहली त्रुटि-पंक्ति देखें और एक बार में एक बदलाव जाँचें; यह डेमो कोड नहीं चला सकता।',
      explain: 'भाषा या अवधारणा का नाम बताएँ और कोड हो तो साझा करें। मैं जाँचने के बिंदु बता सकता हूँ, लेकिन यह स्थानीय डेमो प्रोग्राम नहीं चलाता।',
      study: 'एक बार में एक अवधारणा सीखें: छोटा उदाहरण पढ़ें, खुद टाइप करें, एक मान बदलें और चलाने से पहले परिणाम का अनुमान लगाएँ। भाषा और लक्ष्य बताएँ।',
    },
    business: {
      default: 'कम लागत में जाँचने के लिए तीन विचार हैं: किसी विषय की ट्यूशन, आसपास की दुकानों के लिए सरल सोशल पोस्ट, या घर के बने उत्पाद के प्री-ऑर्डर। एक ग्राहक समूह चुनें, पाँच लोगों से समस्या के बारे में पूछें और खर्च करने से पहले रुचि जाँचें।',
      study: 'विचार को छोटे परीक्षण में बदलें: ग्राहक समूह, उनकी समस्या, सबसे सरल पेशकश और भुगतान लेने का तरीका लिखें। सामान या उपकरण खरीदने से पहले पाँच संभावित ग्राहकों से बात करें।',
    },
  },
  hinglish: {
    general: {
      default: 'Yeh free local demo live model ya reference library use nahi karta, isliye bina base ke facts guess nahi karega. Topic ke saath batao ki definition, steps, comparison ya example chahiye; main ek structured starting point de sakta hoon.',
      why: '“Kyun” wale sawal ko cause, process aur result mein baanto. Topic batao, main in parts ka short demo explanation bana dunga.',
      how: '“Kaise” wale sawal mein pehle goal clear karo, phir steps ko order mein likho aur end mein result check karo. Topic bataoge to focused demo guide milegi.',
      compare: 'Comparison ke liye dono cheezon ke naam do aur same criteria rakho: use, main difference aur ek example. Yeh local demo current facts verify nahi kar sakta.',
      explain: 'Clear explanation ke liye pehle one-line meaning, phir daily-life example, aur last mein yeh batao ki concept ka matlab kya nahi hai. Exact topic bhejo.',
      study: 'Study ke liye ek chhota topic chuno, notes dekhe bina recall karo, phir kuch questions solve karke gaps review karo. Subject aur available time bhejo, main sample plan dunga.',
    },
    class12: {
      default: 'Class 12 ke question ke saath subject, chapter aur exact prompt bhejo. Useful answer ka order hai: main idea, definition ya formula, solving steps, aur quick self-check. Apne board ka latest syllabus aur textbook bhi check karo.',
      study: 'Class 12 revision current board syllabus se jodo: ek focused session mein topic bina notes recall karo, phir board-style questions karke gaps note karo. Board, subjects aur exam date bhejo, main sample timetable dunga.',
    },
    maths: {
      default: 'Poora expression ya question bhejo—brackets aur units bhi. Method: rule identify karo, har step likho, phir answer ko substitute karke check karo. Yeh demo simple arithmetic calculate karta hai, har algebra question nahi.',
      formula: 'Chapter ya formula ka naam batao. Har symbol ka meaning, formula kab apply hota hai, aur answer ki restrictions check karo. Topic doge to kuch common formulas dikha sakta hoon.',
      practice: 'Ek chapter chuno: pehle solved example dekho, phir bina dekhe teen similar questions try karo. Chapter aur level bhejo, main focused practice outline dunga.',
      solve: 'Full question brackets ke saath type karo. Simple arithmetic yeh demo locally calculate kar sakta hai; algebra ke liye equation bhejo, main step-by-step checklist dunga.',
      explain: 'Maths concept ko definition se ek chhote example tak le jao, phir doosre example se verify karo. Exact concept ya chapter batao.',
      study: 'Ek formula ya rule memory se likho, solved example karo, phir mixed questions try karo. Galat steps ki list banao aur agle din revise karo.',
    },
    physics: {
      default: 'Physics problem mein known values aur SI units likho, chhota diagram banao, law choose karo aur calculation ke baad units check karo. Exact question bhejo; yeh demo har numerical result verify nahi karta.',
      formula: 'Topic ya law ka naam batao. Symbols ke saath units likho, equation kab apply hoti hai note karo, aur dono sides ki units match karo. Topic doge to common laws dikha sakta hoon.',
      practice: 'Ek topic ke liye ek concept question aur ek numerical try karo. Har numerical mein knowns, unknown, equation, substitution aur units likho.',
      solve: 'Full problem aur saari values bhejo. Diagram banao, values ko SI units mein convert karo, relevant law choose karo, phir units aur answer ka size check karo.',
      explain: 'Physics idea ko observable example se jodo, law ka naam batao, phir samjhao ki ek variable badalne par kya hota hai. Exact concept bhejo.',
      study: 'Har chapter ke laws aur units recall karo, phir ek diagram question aur do numericals practice karo. Confusing formulas ki list rakho.',
    },
    chemistry: {
      default: 'Exact reaction, formula ya concept bhejo. Reaction mein dono sides par elements count karo, atoms aur charge balance karke verify karo. Numerical question ke values aur units bhi bhejo.',
      formula: 'Chapter ya quantity ka naam batao. Symbols ka meaning, units aur formula ki conditions likho. Topic doge to kuch common formulas dikha sakta hoon.',
      practice: 'Same chapter se ek equation-balancing aur ek concept question karo. Har step ke baad atoms aur total charge check karo.',
      solve: 'Full question aur values bhejo. Substances identify karo, zaroorat ho to equation balance karo, mole relation choose karo aur units saath rakho.',
      explain: 'Pehle particle level par idea samjho, phir chemical equation se jodo aur ek example do. Exact concept ya reaction bhejo.',
      study: 'Definitions, reaction patterns aur conditions ki short sheet banao. Equations balance karo aur har step ka reason samjho.',
    },
    coding: {
      default: 'Language, program ka goal aur ek sample input/output batao. Bug ke liye smallest code snippet aur exact error bhejo. Yeh local demo code run ya test nahi kar sakta.',
      debug: 'Bug ke liye language, smallest failing code, exact error, expected result aur actual result bhejo. Pehli error line dekho aur ek time par ek change test karo; yeh demo code execute nahi kar sakta.',
      explain: 'Language ya concept ka naam batao aur code ho to share karo. Main check karne ke points bataunga, par yeh local demo program run nahi karta.',
      study: 'Ek concept ek baar mein seekho: chhota example padho, khud type karo, ek value badlo aur run karne se pehle output guess karo. Language aur goal batao.',
    },
    business: {
      default: 'Kam cost mein test karne ke liye teen ideas: kisi subject ki tutoring, nearby shops ke liye simple social posts, ya homemade product ke pre-orders. Ek audience chuno, paanch logon se unki problem poochho, aur kharch se pehle interest test karo.',
      study: 'Idea ko small test banao: customer group, unki problem, simplest offer aur payment ka tareeka likho. Inventory ya equipment lene se pehle paanch potential customers se baat karo.',
    },
  },
};

const CASUAL_REPLIES = {
  en: {
    greeting: 'Hey! What are you working on today? I can help you think through a study question, a coding task, or an idea.',
    status: 'I’m doing well, thanks for asking. What’s on your mind?',
    thanks: 'You’re welcome! Want to try another question?',
    farewell: 'See you later. Your chats stay saved on this device.',
    feeling: 'That sounds like a lot to carry. Want to tell me what is making today feel that way, or would a small next step help?',
  },
  hi: {
    greeting: 'नमस्ते! आज आप किस बारे में सोच रहे हैं? पढ़ाई, कोडिंग या किसी नए विचार पर बात कर सकते हैं।',
    status: 'मैं ठीक हूँ, पूछने के लिए धन्यवाद। आपके मन में क्या है?',
    thanks: 'आपका स्वागत है! कोई और सवाल आज़माएँगे?',
    farewell: 'फिर मिलेंगे। आपकी बातचीत इसी डिवाइस पर सेव रहती है।',
    feeling: 'यह काफ़ी भारी लग सकता है। बताना चाहेंगे कि आज ऐसा क्यों लग रहा है, या कोई छोटा अगला कदम मदद करेगा?',
  },
  hinglish: {
    greeting: 'Namaste! Aaj kis cheez par kaam kar rahe ho? Study question, coding task, ya kisi idea par baat kar sakte hain.',
    status: 'Main theek hoon, poochhne ke liye shukriya. Aapke mind mein kya hai?',
    thanks: 'Welcome! Ek aur question try karna hai?',
    farewell: 'Phir milte hain. Aapki chats isi device par saved rehti hain.',
    feeling: 'Yeh kaafi heavy lag raha hoga. Bataana chahoge ki aaj aisa kyun lag raha hai, ya koi chhota next step help karega?',
  },
};

const CLASS_12_SUBJECT_GUIDES = {
  en: {
    maths: 'For maths, write the domain and given values, choose the theorem or formula, show each algebra step, and check restrictions.',
    physics: 'For physics, list knowns with SI units, sketch the situation, choose a law, substitute values, and check units.',
    chemistry: 'For chemistry, name the species, balance atoms and charge, use the right mole relation, and keep units in every step.',
  },
  hi: {
    maths: 'गणित में दिए मान और domain लिखें, प्रमेय या सूत्र चुनें, बीजगणित के चरण दिखाएँ और उत्तर की सीमाएँ जाँचें।',
    physics: 'भौतिकी में ज्ञात मान SI इकाइयों सहित लिखें, चित्र बनाएँ, नियम चुनें, मान रखें और इकाइयाँ जाँचें।',
    chemistry: 'रसायन विज्ञान में पदार्थ पहचानें, परमाणु और आवेश संतुलित करें, सही मोल संबंध चुनें और हर चरण में इकाइयाँ रखें।',
  },
  hinglish: {
    maths: 'Maths mein given values aur domain likho, theorem ya formula chuno, algebra ke steps dikhao, aur answer ki restrictions check karo.',
    physics: 'Physics mein knowns ko SI units ke saath likho, diagram banao, law chuno, values substitute karo, aur units check karo.',
    chemistry: 'Chemistry mein species identify karo, atoms aur charge balance karo, sahi mole relation chuno, aur har step mein units rakho.',
  },
};

const FACT_RULES = [
  {
    topic: 'maths',
    terms: ['quadratic formula', 'द्विघात सूत्र'],
    en: 'For ax² + bx + c = 0, x = (−b ± √(b² − 4ac)) / (2a). The discriminant is b² − 4ac.',
    hi: 'ax² + bx + c = 0 के लिए x = (−b ± √(b² − 4ac)) / (2a)। विविक्तकर b² − 4ac होता है।',
    hinglish: 'ax² + bx + c = 0 ke liye x = (−b ± √(b² − 4ac)) / (2a). Discriminant b² − 4ac hota hai.',
  },
  {
    topic: 'maths',
    terms: ['circle area', 'area of a circle', 'वृत्त का क्षेत्रफल'],
    en: 'The area of a circle is A = πr², where r is the radius.',
    hi: 'वृत्त का क्षेत्रफल A = πr² होता है, जहाँ r त्रिज्या है।',
    hinglish: 'Circle ka area A = πr² hota hai, jahan r radius hai.',
  },
  {
    topic: 'maths',
    terms: ['pythagoras', 'pitagoras', 'पाइथागोरस'],
    en: 'For a right triangle, a² + b² = c², where c is the hypotenuse.',
    hi: 'समकोण त्रिभुज में a² + b² = c² होता है; c कर्ण है।',
    hinglish: 'Right triangle mein a² + b² = c² hota hai; c hypotenuse hai.',
  },
  {
    topic: 'physics',
    terms: ['newton second law', 'newton\'s second law', 'न्यूटन का दूसरा नियम'],
    en: 'Newton’s second law is F = ma: net force equals mass multiplied by acceleration.',
    hi: 'न्यूटन का दूसरा नियम F = ma है: परिणामी बल = द्रव्यमान × त्वरण।',
    hinglish: 'Newton ka second law F = ma hai: net force = mass × acceleration.',
  },
  {
    topic: 'physics',
    terms: ['ohm law', 'ohm\'s law', 'ओम का नियम'],
    en: 'Ohm’s law is V = IR, when the physical conditions of the conductor stay constant.',
    hi: 'ओम का नियम V = IR है, जब चालक की भौतिक स्थितियाँ स्थिर रहें।',
    hinglish: 'Ohm ka law V = IR hai, jab conductor ki physical conditions constant rahen.',
  },
  {
    topic: 'physics',
    terms: ['speed formula', 'distance formula', 'चाल का सूत्र'],
    en: 'For constant speed, speed = distance ÷ time (v = d/t).',
    hi: 'स्थिर चाल के लिए चाल = दूरी ÷ समय (v = d/t)।',
    hinglish: 'Constant speed ke liye speed = distance ÷ time (v = d/t).',
  },
  {
    topic: 'chemistry',
    terms: ['mole concept', 'number of moles', 'मोल संकल्पना', 'मोल की संख्या'],
    en: 'The amount in moles is n = m/M, where m is sample mass and M is molar mass.',
    hi: 'मोल की मात्रा n = m/M होती है, जहाँ m नमूने का द्रव्यमान और M मोलर द्रव्यमान है।',
    hinglish: 'Moles ki quantity n = m/M hoti hai, jahan m sample ka mass aur M molar mass hai.',
  },
  {
    topic: 'chemistry',
    terms: ['water formula', 'formula for water', 'h2o', 'पानी का सूत्र', 'जल का सूत्र'],
    en: 'A water molecule has the formula H₂O: two hydrogen atoms bonded to one oxygen atom.',
    hi: 'पानी का सूत्र H₂O है: एक ऑक्सीजन परमाणु से दो हाइड्रोजन परमाणु जुड़े होते हैं।',
    hinglish: 'Water ka formula H₂O hai: ek oxygen atom ke saath do hydrogen atoms bonded hote hain.',
  },
];

function normalize(value) {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('en-IN').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
}

function matchesTerm(text, term) {
  if (/[\u0900-\u097F]/.test(term)) return text.includes(term);
  if (/^[a-z0-9]+$/i.test(term)) return new RegExp(`\\b${term}\\b`, 'i').test(text);
  return text.includes(term);
}

function matchesAny(text, terms = []) {
  return terms.some((term) => matchesTerm(text, term));
}

function detectLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (matchesAny(text, HINGLISH_MARKERS)) return 'hinglish';
  return 'en';
}

function normalizeArithmeticWords(text) {
  return text
    .replace(/\b(?:multiplied by|multiply by|times)\b/g, '*')
    .replace(/\b(?:divided by|divide by|over)\b/g, '/')
    .replace(/\b(?:plus|add)\b/g, '+')
    .replace(/\b(?:minus|subtract)\b/g, '-')
    .replace(/\bmodulo\b/g, '%')
    .replace(/(\d+(?:\.\d+)?)\s*(?:%|percent|प्रतिशत)\s*(?:of|का|ke|ki)?\s*(\d+(?:\.\d+)?)/g, '($1/100*$2)')
    .replace(/गुणा(?: करें| करो)?|गुना/g, '*')
    .replace(/भाग(?: दें| दो)?/g, '/')
    .replace(/जोड़(?:ें|ो)?|प्लस/g, '+')
    .replace(/घटाएँ|घटाओ|माइनस/g, '-');
}

function tokenizeArithmetic(expression) {
  const tokens = [];
  const tokenPattern = /\s*(\d+(?:\.\d+)?|[()+\-*/^%])\s*/gy;
  let position = 0;
  while (position < expression.length) {
    tokenPattern.lastIndex = position;
    const match = tokenPattern.exec(expression);
    if (!match) return null;
    tokens.push(match[1]);
    position = tokenPattern.lastIndex;
  }
  return tokens;
}

function evaluateArithmetic(expression) {
  const tokens = tokenizeArithmetic(expression);
  if (!tokens) return null;
  let index = 0;

  function primary() {
    const token = tokens[index++];
    if (token === '(') {
      const value = addSubtract();
      if (tokens[index++] !== ')') throw new Error('Missing closing parenthesis');
      return value;
    }
    const value = Number(token);
    if (!Number.isFinite(value)) throw new Error('Expected a number');
    return value;
  }

  function power() {
    const left = primary();
    if (tokens[index] === '^') {
      index += 1;
      return left ** unary();
    }
    return left;
  }

  function unary() {
    if (tokens[index] === '+') {
      index += 1;
      return unary();
    }
    if (tokens[index] === '-') {
      index += 1;
      return -unary();
    }
    return power();
  }

  function multiplyDivide() {
    let value = unary();
    while (['*', '/', '%'].includes(tokens[index])) {
      const operator = tokens[index++];
      const right = unary();
      if ((operator === '/' || operator === '%') && right === 0) throw new Error('Division by zero');
      if (operator === '*') value *= right;
      if (operator === '/') value /= right;
      if (operator === '%') value %= right;
    }
    return value;
  }

  function addSubtract() {
    let value = multiplyDivide();
    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = tokens[index++];
      const right = multiplyDivide();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }

  try {
    const result = addSubtract();
    if (index !== tokens.length || !Number.isFinite(result) || Math.abs(result) > 1e12) return null;
    return result;
  } catch {
    return null;
  }
}

function extractArithmeticExpression(text) {
  const normalized = normalizeArithmeticWords(text);
  const runs = normalized.match(/[0-9()+\-*\/^%.\s]+/g) || [];
  for (const run of runs) {
    const expression = run.trim().replace(/[.]+$/, '');
    const numberCount = expression.match(/\d+(?:\.\d+)?/g)?.length || 0;
    if (numberCount < 2 || !/[+\-*/^%]/.test(expression)) continue;
    if (tokenizeArithmetic(expression)) return expression;
  }
  return null;
}

function detectIntent(text) {
  for (const intent of ['study', 'debug', 'formula', 'practice', 'solve', 'compare', 'why', 'how', 'explain']) {
    if (matchesAny(text, INTENT_TERMS[intent])) return intent;
  }
  return 'default';
}

function detectCasualKind(text) {
  const clean = text.replace(/[!?.,।]+$/g, '').trim();
  if (/^(?:hi|hello|hey|yo|namaste|namaskar)(?:\s+there)?$/i.test(clean) || /^(?:नमस्ते|नमस्कार)$/.test(clean)) return 'greeting';
  if (/^(?:(?:hi|hello|hey|namaste|namaskar|नमस्ते|नमस्कार)[\s,]+)?(?:how are you|how are things|kaise ho|kaisi ho|kya haal hai|क्या हाल है|कैसे हो|कैसी हो)\??$/i.test(clean)) return 'status';
  if (/^(?:thanks|thank you|thx|shukriya|dhanyavaad|शुक्रिया|धन्यवाद)$/i.test(clean)) return 'thanks';
  if (/^(?:bye|goodbye|see you|phir milte hain|फिर मिलेंगे|अलविदा)$/i.test(clean)) return 'farewell';
  if (/\b(?:i feel|i am|i'm)\s+(?:sad|bored|lonely|stressed|tired)\b/i.test(clean)
      || /(?:उदास|अकेला|अकेली|तनाव में|थका हुआ|थकी हुई)/.test(clean)
      || /\b(?:udas|akela|akeli|pareshan|thaka|thaki)\b/i.test(clean)) return 'feeling';
  return null;
}

function classifyPrompt(text, arithmeticExpression) {
  const intent = detectIntent(text);
  let topic = null;
  for (const candidate of ['business', 'coding', 'chemistry', 'physics', 'maths']) {
    if (matchesAny(text, TOPIC_TERMS[candidate])) {
      topic = candidate;
      break;
    }
  }
  if (!topic && arithmeticExpression) topic = 'maths';

  const mentionsClass12 = matchesAny(text, CLASS_12_TERMS);
  const hasSchoolSubject = ['maths', 'physics', 'chemistry'].includes(topic);
  if (mentionsClass12 && (hasSchoolSubject || !topic || matchesAny(text, STUDY_TERMS))) {
    return {
      topic: 'class12',
      subject: hasSchoolSubject ? topic : null,
      intent,
    };
  }
  if (topic) return { topic, subject: null, intent };

  const casual = detectCasualKind(text);
  if (casual) return { topic: 'casual', subject: null, intent: casual };
  return { topic: 'general', subject: null, intent };
}

function findLocalFact(topic, text) {
  return FACT_RULES.find((fact) => fact.topic === topic && matchesAny(text, fact.terms));
}

function formatNumber(value) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(10)));
}

function buildDemoReply(prompt) {
  const text = normalize(prompt);
  if (!text) return REPLIES.en.general.default;

  const arithmeticExpression = extractArithmeticExpression(text);
  const classification = classifyPrompt(text, arithmeticExpression);
  const language = detectLanguage(text);
  const { topic, subject, intent } = classification;

  if (topic === 'casual') return CASUAL_REPLIES[language][intent];

  const targetTopic = subject || topic;
  const title = subject
    ? `${LABELS[language].class12} · ${LABELS[language][subject]}`
    : LABELS[language][topic];

  if ((targetTopic === 'maths') && arithmeticExpression) {
    const result = evaluateArithmetic(arithmeticExpression);
    if (result !== null) {
      const intro = {
        en: `Using order of operations, **${arithmeticExpression} = ${formatNumber(result)}**.`,
        hi: `गणना के क्रम से, **${arithmeticExpression} = ${formatNumber(result)}**।`,
        hinglish: `Operations ke order se, **${arithmeticExpression} = ${formatNumber(result)}**.`,
      };
      return `**${title} · local demo**\n\n${intro[language]}`;
    }
  }

  const fact = findLocalFact(targetTopic, text);
  if (fact) return `**${title} · local demo**\n\n${fact[language]}`;

  if (topic === 'class12') {
    const base = REPLIES[language].class12[intent] || REPLIES[language].class12.default;
    const subjectGuide = subject ? `\n\n${CLASS_12_SUBJECT_GUIDES[language][subject]}` : '';
    return `**${title} · local demo**\n\n${base}${subjectGuide}`;
  }

  if (topic === 'coding' && language === 'en'
      && matchesAny(text, ['hello world', 'print hello'])
      && matchesAny(text, ['python'])) {
    return `**${title} · local demo**\n\nA minimal Python example is \`print("Hello, world!")\`. Tell me what input and output you want for the next step.`;
  }
  if (topic === 'coding' && language === 'hinglish'
      && matchesAny(text, ['hello world', 'print hello'])
      && matchesAny(text, ['python'])) {
    return `**${title} · local demo**\n\nPython mein simple example: \`print("Hello, world!")\`. Agla step batane ke liye required input aur expected output share karo.`;
  }
  if (topic === 'coding' && language === 'hi'
      && matchesAny(text, ['hello world', 'print hello', 'हैलो वर्ल्ड'])
      && matchesAny(text, ['python'])) {
    return `**${title} · local demo**\n\nPython का छोटा उदाहरण: \`print("Hello, world!")\`। अगला चरण बताने के लिए इनपुट और अपेक्षित आउटपुट साझा करें।`;
  }

  const topicReplies = REPLIES[language][topic];
  const reply = topicReplies[intent] || topicReplies.default;
  return `**${title} · local demo**\n\n${reply}`;
}

export { buildDemoReply };