export type QuizOption = {
  label: string;
  departments: string[];
};

export type QuizQuestion = {
  q: string;
  s: string;
  options: QuizOption[];
};

export type QuizDepartment = {
  title?: string;
  desc: string;
  scripture: string;
  video: string;
};

export const QUIZ_SLIDESHOW_IMAGES = [
  "https://images.kharis.org/site-images/kp2/8440a4a63e4ae020/serve-with-us.jpg",
  "https://images.kharis.org/site-images/kp2/9b547f88f3b4d297/worship.jpg",
  "https://images.kharis.org/site-images/kp2/2bf8a23f06e5bb67/K-music-img.jpg",
  "https://images.kharis.org/site-images/kp2/4cdb8d19355fced2/K-drama-img.jpg",
  "https://images.kharis.org/site-images/kp2/d6b67a1d5d3003b0/events-sunday-service.jpg",
] as const;

export type QuizTranslation = {
  // Hero & General
  badge: string;
  title: string;
  subtitle: string;

  // Start Screen
  stepBadge: string;
  startHeading: string;
  startDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  nameError: string;
  branchLabel: string;
  branchPlaceholder: string;
  branchError: string;
  startButton: string;
  privacyAgreement: string;
  privacyPolicyLink: string;

  // Quiz Screen
  questionBadge: string;
  nextButton: string;
  backButton: string;
  finishButton: string;

  // Results Screen
  discoveryCompleted: string;
  resultsTitle: string;
  resultsSubtitle: string;
  topMatchBadge: string;
  highestCompatibility: string;
  watchSpotlight: string;
  matchRank: string;
  previewVideo: string;
  exploreButton: string;
  filterDepartmentsPlaceholder: string;
  playDeptVideo: string;
  restartButton: string;
  nextStepTitle: string;
  nextStepSubtitle: string;
  findBranchButton: string;

  // Questions and Departments
  questions: QuizQuestion[];
  departments: Record<string, QuizDepartment>;
};

export type SupportedLanguage = "en" | "fr" | "es" | "kri" | "de";

export const QUIZ_LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "kri", label: "Krio", flag: "🇸🇱" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

export const UPCOMING_LANGUAGES = [
  { code: "tw", label: "Twi (Ghana) 🇬🇭" },
  { code: "jam", label: "Patois (Jamaica) 🇯🇲" },
  { code: "sv", label: "Svenska (Swedish) 🇸🇪" },
  { code: "gd", label: "Gàidhlig (Scottish) 🏴" },
  { code: "gr", label: "Greek 🇬🇷" },
  { code: "pt", label: "Português 🇵🇹" },
  { code: "it", label: "Italiano 🇮🇹" },
  { code: "hi", label: "हिन्दी 🇮🇳" },
  { code: "zh", label: "中文 🇨🇳" },
  { code: "ja", label: "日本語 🇯🇵" },
  { code: "ko", label: "한국어 🇰🇷" },
  { code: "ru", label: "Русский 🇷🇺" },
  { code: "ar", label: "العربية 🇸🇦" },
  { code: "he", label: "עברית 🇮🇱" },
  { code: "nl", label: "Nederlands 🇳🇱" },
  { code: "pl", label: "Polski 🇵🇱" },
  { code: "ga", label: "Gaeilge 🇮🇪" },
  { code: "sw", label: "Kiswahili 🇰🇪" },
  { code: "yo", label: "Yorùbá 🇳🇬" },
];

export const QUIZ_BRANCHES = [
  "Kharis Church Accra",
  "Kharis Church Birmingham",
  "Kharis Church Brighton",
  "Kharis Church Bristol",
  "Kharis Church Chatham",
  "Kharis Church Chelmsford",
  "Kharis Church Coventry",
  "Kharis Church Croydon",
  "Kharis Church Freetown",
  "Kharis Church London",
  "Kharis Church Luton",
  "Kharis Church Manchester",
  "Kharis Church Northampton",
  "Kharis Church Nottingham",
  "Kharis Church Orpington",
  "Kharis Church Reading",
  "Kharis Phase 2 Peterborough",
  "Kharis Phase 2 Birmingham",
  "Kharis Phase 2 London",
  "Kharis Phase 2 Romford",
  "Kharis Phase 2 Southampton",
  "Kharis Phase 2 Barking",
] as const;

export const GOOGLE_SHEETS_QUIZ_URL =
  "https://script.google.com/macros/s/AKfycbznl6ltl0ydLSa7STMUPQPguZ5Bf74aEuTMH6mhUwk88ee8xsaMA6QtVvBXclxUor28/exec";

export const QUIZ_TRANSLATIONS: Record<SupportedLanguage, QuizTranslation> = {
  en: {
    badge: "Department Discovery Quiz",
    title: "Find Your Kharis Department",
    subtitle: "Answer a few short questions to see where your gifting fits best.",
    stepBadge: "Step 1 of 2",
    startHeading: "Find Your Fit in Kharis",
    startDescription: "Select your Kharis branch before we jump into the questions.",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    nameError: "Please enter your full name to begin.",
    branchLabel: "Branch",
    branchPlaceholder: "Select your branch",
    branchError: "Please select your Kharis Church or Phase 2 branch.",
    startButton: "Start Quiz",
    privacyAgreement: "By continuing, you agree to our {policy}.",
    privacyPolicyLink: "Privacy Policy",
    questionBadge: "Question {current} of {total}",
    nextButton: "Next",
    backButton: "Back",
    finishButton: "See Results 🎉",
    discoveryCompleted: "Discovery Completed",
    resultsTitle: "Your Top Departments",
    resultsSubtitle:
      "Based on your heart, gifts, and instincts, here are your top ministry matches.",
    topMatchBadge: "Top Match · #1",
    highestCompatibility: "Highest Compatibility",
    watchSpotlight: "Watch {dept} Spotlight",
    matchRank: "#{rank} Match",
    previewVideo: "Preview Video",
    exploreButton: "Explore All Departments",
    filterDepartmentsPlaceholder: "Filter department list...",
    playDeptVideo: "Play {dept} Video",
    restartButton: "Start Over",
    nextStepTitle: "Ready to take the next step?",
    nextStepSubtitle: "Connect with your campus team or discover upcoming branch services.",
    findBranchButton: "Find Your Branch",
    questions: [
      {
        q: "When faced with chaos, what grounds you most?",
        s: "1 Corinthians 14:33 – For God is not a God of disorder but of peace.",
        options: [
          {
            label: "Creating structure and clear plans",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Praying and seeking God's presence",
            departments: ["New Believers", "Follow Up", "Welfare"],
          },
          {
            label: "Gathering and encouraging people",
            departments: ["Hospitality", "Host Team", "Guest Relations Team"],
          },
          {
            label: "Expressing myself creatively",
            departments: ["Music", "Drama", "Spoken Word", "Design"],
          },
        ],
      },
      {
        q: "How do you prefer to impact others?",
        s: "Matthew 5:16 – Let your light shine before others.",
        options: [
          {
            label: "Through bold words and proclamation",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
          {
            label: "Through serving and practical help",
            departments: ["Set-up", "Sanctuary Keepers", "Ushers", "Uniform"],
          },
          {
            label: "Through music, art, or creativity",
            departments: ["Music", "K-Music", "Design", "Photography"],
          },
          {
            label: "Through technology and behind-the-scenes work",
            departments: ["Tech Team", "Sound", "Social Media", "Production"],
          },
        ],
      },
      {
        q: "In a group, you are the one who...",
        s: "Romans 12:6 – We have different gifts, according to the grace given to each of us.",
        options: [
          {
            label: "Organises everyone and keeps things on track",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Makes people feel welcome and cared for",
            departments: ["Hospitality", "Host Team", "Guest Relations Team", "Ushers"],
          },
          {
            label: "Captures moments or tells the story",
            departments: ["Photography", "Social Media", "Drama", "Design"],
          },
          {
            label: "Teaches, mentors, or encourages others' growth",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Which part of a service do you naturally notice first?",
        s: "Ephesians 6:7 – Serve wholeheartedly, as if you were serving the Lord.",
        options: [
          {
            label: "The sound, lighting, or production quality",
            departments: ["Sound", "Tech Team", "Production"],
          },
          {
            label: "Whether guests feel welcomed and comfortable",
            departments: ["Host Team", "Guest Relations Team", "Hospitality", "Ushers"],
          },
          { label: "The worship music and atmosphere", departments: ["Music", "K-Music"] },
          {
            label: "Whether the space is clean and set up well",
            departments: ["Sanctuary Keepers", "Set-up", "Uniform"],
          },
        ],
      },
      {
        q: "If you could lead something, what would it be?",
        s: "Joshua 1:9 – Be strong and courageous.",
        options: [
          {
            label: "A creative project or performance",
            departments: ["Drama", "Design", "Spoken Word", "Photography"],
          },
          {
            label: "A community outreach or mission initiative",
            departments: ["Evangelism", "Welfare", "Follow Up"],
          },
          {
            label: "A technical team or behind-the-scenes operation",
            departments: ["Tech Team", "Sound", "Production", "Security"],
          },
          {
            label: "A pastoral or discipleship programme",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "When someone is hurting, what do you naturally do?",
        s: "2 Corinthians 1:4 – God comforts us… so we can comfort others.",
        options: [
          {
            label: "Listen and offer practical support",
            departments: ["Welfare", "Follow Up", "New Believers"],
          },
          {
            label: "Pray with them and point them to God",
            departments: ["Evangelism", "New Believers", "Follow Up"],
          },
          {
            label: "Create something that expresses comfort or hope",
            departments: ["Music", "K-Music", "Design", "Spoken Word"],
          },
          {
            label: "Make sure their environment and needs are handled",
            departments: ["Hospitality", "Set-up", "Sanctuary Keepers"],
          },
        ],
      },
      {
        q: "What excites you most: creating, organising, helping, or sharing boldly?",
        s: "Colossians 3:23 – Whatever you do, work at it with all your heart.",
        options: [
          {
            label: "Creating — art, music, or visual content",
            departments: ["Design", "Photography", "Drama", "K-Music", "Social Media"],
          },
          {
            label: "Organising — systems, logistics, events",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Helping — serving people in practical ways",
            departments: ["Ushers", "Welfare", "Hospitality", "Sanctuary Keepers"],
          },
          {
            label: "Sharing boldly — speaking, preaching, or reaching out",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
        ],
      },
      {
        q: "If you had one talent to use for God, what would it be?",
        s: "1 Peter 4:10 – Each of you should use whatever gift you have received to serve others.",
        options: [
          {
            label: "A musical or artistic gift",
            departments: ["Music", "K-Music", "Drama", "Spoken Word"],
          },
          {
            label: "A technical or digital skill",
            departments: ["Tech Team", "Sound", "Social Media", "Photography", "Design"],
          },
          {
            label: "A gift for people and relationships",
            departments: ["Evangelism", "Host Team", "Guest Relations Team", "Welfare"],
          },
          {
            label: "A gift for teaching, helping, or administration",
            departments: ["Administration", "Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
    ],
    departments: {
      Administration: {
        desc: "Supports others behind the scenes, ensuring everything runs smoothly and efficiently.",
        scripture:
          "1 Corinthians 14:40 – But everything should be done in a fitting and orderly way.",
        video: "https://drive.google.com/file/d/1wnmkTsVDISdhxiXn-vK8N4zMPavjZZ7i/preview",
      },
      "Children's Department": {
        desc: "Patient, nurturing, and joyful people who love teaching, encouraging, and inspiring children to grow in faith.",
        scripture:
          "Matthew 19:14 – Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these.",
        video: "https://drive.google.com/file/d/1JJIuVS55yDnb7rIu6ktJQBux_sTSfEcQ/preview",
      },
      Design: {
        desc: "Innovative and artistic individuals who bring ideas to life visually, using creativity to communicate messages with excellence.",
        scripture:
          "Exodus 35:35 – He has filled them with skill to do all kinds of work as engravers, designers, embroiderers and weavers.",
        video: "https://drive.google.com/file/d/1d4iwdnH0K6NomtO-LvAFLYUwxx5Tozo1/preview",
      },
      Drama: {
        desc: "Expressive, imaginative, and bold individuals who use storytelling and performance to communicate the gospel in powerful ways.",
        scripture:
          "Matthew 13:34 – Jesus spoke all these things to the crowd in parables; he did not say anything to them without using a parable.",
        video: "https://drive.google.com/file/d/1hIHcNZx4wMO5O2CJm5W_6BWvZPWcVSEE/preview",
      },
      Evangelism: {
        desc: "Bold, outgoing, and confident individuals who love sharing the gospel and engaging others with compassion and courage.",
        scripture: "Mark 16:15 – Go into all the world and preach the gospel to all creation.",
        video: "https://drive.google.com/file/d/1u9AKntERi8S6rUDDGU5XRn5Tkw9QYQs3/preview",
      },
      "Follow Up": {
        desc: "Caring, attentive, and relational individuals who enjoy guiding new believers, building trust, and encouraging spiritual growth.",
        scripture: "Matthew 28:19 – Therefore go and make disciples of all nations.",
        video: "https://drive.google.com/file/d/1dwpWGFcdYopZ94QuWlxZHKMgmCoqtxpk/preview",
      },
      "Guest Relations Team": {
        desc: "Warm, attentive, and welcoming individuals who ensure every guest feels noticed, cared for, and connected from the moment they arrive.",
        scripture:
          "Hebrews 13:2 – Do not forget to show hospitality to strangers, for by so doing some people have shown hospitality to angels without knowing it.",
        video: "https://drive.google.com/file/d/115TgSFzLbYu761p70pzRFDOzcCqlo7dR/preview",
      },
      Hospitality: {
        desc: "Warm, welcoming, and caring people who create an atmosphere of love and comfort for everyone they serve.",
        scripture: "1 Peter 4:9 – Offer hospitality to one another without grumbling.",
        video: "https://drive.google.com/file/d/10YzjnTqd1lKKCMYTNI2jilM0R_MwPVJT/preview",
      },
      "Host Team": {
        desc: "Friendly, approachable, and service-minded individuals who make everyone feel seen, valued, and at home.",
        scripture:
          "Romans 15:7 – Welcome one another as Christ has welcomed you, for the glory of God.",
        video: "https://drive.google.com/file/d/1UeUhTVMnRlglNL4qv2On_mUm2EuDp_4P/preview",
      },
      "K-Music": {
        desc: "Creative, expressive, and passionate individuals who use their musical gifts — producing, writing, singing, or rapping — to glorify God and lead others into His presence.",
        scripture: "Psalm 150:6 – Let everything that has breath praise the Lord.",
        video: "https://drive.google.com/file/d/1RFqlH12EReGeWcGZiLKfH8D5YSTapnU_/preview",
      },
      Music: {
        desc: "Passionate, skilled, and Spirit-filled individuals who use their gifts to lead others into worship and the presence of God.",
        scripture:
          "Psalm 95:1-2 – Come, let us sing for joy to the Lord; let us shout aloud to the Rock of our salvation.",
        video: "https://drive.google.com/file/d/1RC0N0RV6ME4RHXyA-qBO4lsV8F9uWgDJ/preview",
      },
      "New Believers": {
        desc: "Patient, supportive, and mentoring-minded people who love helping others understand faith and grow spiritually.",
        scripture:
          "Colossians 1:28 – We proclaim him, admonishing and teaching everyone with all wisdom.",
        video: "https://drive.google.com/file/d/1DKaAQrFtE48fx_a4NEjKJ9qtYjc4SscJ/preview",
      },
      Photography: {
        desc: "Observant, creative, and detail-focused individuals who capture moments that tell stories and inspire faith.",
        scripture: "Habakkuk 2:2 – Write down the revelation and make it plain on tablets.",
        video: "https://drive.google.com/file/d/1G55nzdfTS6jT1odVe0HyVX_SKzZCUNEx/preview",
      },
      Production: {
        desc: "Diligent and detail-oriented individuals who ensure the smooth running of services through technical excellence and behind-the-scenes support.",
        scripture: "Colossians 3:23 – Whatever you do, work at it with all your heart.",
        video: "https://drive.google.com/file/d/1D8WzMj_UKZutlHTh_gTbTBfS1-ndTmLs/preview",
      },
      "Sanctuary Keepers": {
        desc: "Responsible, conscientious, and detail-focused people who take pride in maintaining a clean and orderly worship environment.",
        scripture:
          "1 Corinthians 3:16 – Don't you know that you yourselves are God's temple and that God's Spirit dwells in your midst?",
        video: "https://drive.google.com/file/d/1785CDbMGqtF1_fis7vxvpi3p01YHERE1/preview",
      },
      Security: {
        desc: "Alert, responsible, and protective individuals who prioritise safety and ensure a secure environment for others.",
        scripture:
          "Proverbs 27:12 – The prudent see danger and take refuge, but the simple keep going and pay the penalty.",
        video: "https://drive.google.com/file/d/1wXUyEaYAz7kPjlc4YHSFPDRu8hzHj3js/preview",
      },
      "Set-up": {
        desc: "Hands-on, practical, and solution-oriented individuals who enjoy preparing spaces, managing logistics, and problem-solving.",
        scripture:
          "Nehemiah 4:6 – So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart.",
        video: "https://drive.google.com/file/d/1gOw46ds7ZOUC2vh_EFFz2h0LRxf6Q9Rm/preview",
      },
      "Social Media": {
        desc: "Creative, tech-savvy, and communicative personalities who enjoy storytelling and engaging communities online.",
        scripture:
          "Psalm 19:14 – May these words of my mouth and this meditation of my heart be pleasing in your sight, Lord.",
        video: "https://drive.google.com/file/d/1UZfA8MnWeMwxo6awZivX8cZzX1-n_Oiv/preview",
      },
      Sound: {
        desc: "Technically-minded, attentive, and precise individuals who thrive on managing audio and creating seamless sound experiences.",
        scripture:
          "1 Corinthians 14:7 – If even lifeless instruments give sounds, how will anyone know what is played?",
        video: "https://drive.google.com/file/d/1gNRsC-E3ErvQTLBKjfxY-MqqNAHLRrl9/preview",
      },
      "Spoken Word": {
        desc: "Expressive and creative individuals who use poetry, spoken word, or performance art to inspire and communicate the gospel.",
        scripture:
          "Psalm 19:14 – May the words of my mouth and the meditation of my heart be pleasing in your sight, O Lord.",
        video: "https://drive.google.com/file/d/1iqS9ycSy8eCauapD-rdmjdSV9Ta5TX9M/preview",
      },
      "Tech Team": {
        desc: "Creative and detail-oriented individuals who use technology to create an atmosphere of excellence so people can encounter God freely.",
        scripture: "Colossians 3:23 – Whatever you do, work heartily, as for the Lord.",
        video: "https://drive.google.com/file/d/1l9I2AjAi1__YXZvMsgub_MQ7ggqkMwks/preview",
      },
      Uniform: {
        desc: "Meticulous, disciplined, and detail-oriented people who value presentation, consistency, and high standards.",
        scripture:
          "1 Timothy 4:12 – Set an example for the believers in speech, in conduct, in love, in faith and in purity.",
        video: "https://drive.google.com/file/d/1ulvATe92alaJff7Fs0ke1oDujdu-DRiv/preview",
      },
      Ushers: {
        desc: "Friendly, approachable, and service-minded individuals who enjoy guiding, assisting, and caring for people in practical ways.",
        scripture: "Hebrews 13:17 – Have confidence in your leaders and submit to their authority.",
        video: "https://drive.google.com/file/d/1H1DQlVu9DLl2OozCk81zye3cKRBNYYln/preview",
      },
      Welfare: {
        desc: "Compassionate, empathetic, and generous-hearted people who are motivated to help those in need and provide support.",
        scripture:
          "Galatians 6:2 – Carry each other's burdens, and in this way you will fulfill the law of Christ.",
        video: "https://drive.google.com/file/d/1BYltxeYNciIvQTaWdzoWnP7cJI8MySqD/preview",
      },
    },
  },
  fr: {
    badge: "Quiz de Découverte des Départements",
    title: "Découvrez Votre Département Kharis",
    subtitle: "Répondez à quelques questions pour voir où vos dons s'intègrent le mieux.",
    stepBadge: "Étape 1 sur 2",
    startHeading: "Trouvez votre place à Kharis",
    startDescription: "Sélectionnez votre branche Kharis avant de commencer les questions.",
    nameLabel: "Nom complet",
    namePlaceholder: "Entrez votre nom complet",
    nameError: "Veuillez entrer votre nom complet pour commencer.",
    branchLabel: "Branche / Église",
    branchPlaceholder: "Sélectionnez votre branche",
    branchError: "Veuillez sélectionner votre branche Kharis Church ou Phase 2.",
    startButton: "Commencer le Quiz",
    privacyAgreement: "En continuant, vous acceptez notre {policy}.",
    privacyPolicyLink: "Politique de confidentialité",
    questionBadge: "Question {current} sur {total}",
    nextButton: "Suivant",
    backButton: "Retour",
    finishButton: "Voir les résultats 🎉",
    discoveryCompleted: "Découverte terminée",
    resultsTitle: "Vos Départements Principaux",
    resultsSubtitle:
      "D'après votre cœur, vos dons et vos inclinations, voici vos meilleures correspondances.",
    topMatchBadge: "Meilleure Correspondance · #1",
    highestCompatibility: "Plus haute compatibilité",
    watchSpotlight: "Regarder la vidéo {dept}",
    matchRank: "#{rank} Correspondance",
    previewVideo: "Aperçu vidéo",
    exploreButton: "Explorer Tous les Départements",
    filterDepartmentsPlaceholder: "Filtrer la liste des départements...",
    playDeptVideo: "Lire la vidéo {dept}",
    restartButton: "Recommencer",
    nextStepTitle: "Prêt à passer à l'étape suivante ?",
    nextStepSubtitle:
      "Connectez-vous avec l'équipe de votre église ou découvrez les prochains cultes.",
    findBranchButton: "Trouver votre église",
    questions: [
      {
        q: "Face au chaos, qu'est-ce qui vous ancre le plus?",
        s: "1 Corinthiens 14:33 – Car Dieu n'est pas un Dieu de désordre, mais de paix.",
        options: [
          {
            label: "Créer de la structure et des plans clairs",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Prier et chercher la présence de Dieu",
            departments: ["New Believers", "Follow Up", "Welfare"],
          },
          {
            label: "Rassembler et encourager les gens",
            departments: ["Hospitality", "Host Team", "Guest Relations Team"],
          },
          {
            label: "M'exprimer de manière créative",
            departments: ["Music", "Drama", "Spoken Word", "Design"],
          },
        ],
      },
      {
        q: "Comment préférez-vous avoir un impact sur les autres?",
        s: "Matthieu 5:16 – Que votre lumière luise ainsi devant les hommes.",
        options: [
          {
            label: "Par des paroles audacieuses et proclamation",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
          {
            label: "Par le service et l'aide pratique",
            departments: ["Set-up", "Sanctuary Keepers", "Ushers", "Uniform"],
          },
          {
            label: "Par la musique, l'art ou la créativité",
            departments: ["Music", "K-Music", "Design", "Photography"],
          },
          {
            label: "Par la technologie et le travail en coulisses",
            departments: ["Tech Team", "Sound", "Social Media", "Production"],
          },
        ],
      },
      {
        q: "Dans un groupe, vous êtes celui qui...",
        s: "Romains 12:6 – Nous avons des dons différents.",
        options: [
          {
            label: "Organise tout et garde tout sur la bonne voie",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Fait sentir à chacun qu'il est accueilli",
            departments: ["Hospitality", "Host Team", "Guest Relations Team", "Ushers"],
          },
          {
            label: "Capture les moments ou raconte l'histoire",
            departments: ["Photography", "Social Media", "Drama", "Design"],
          },
          {
            label: "Enseigne, mentor ou encourage la croissance",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Quelle partie d'un service remarquez-vous naturellement en premier?",
        s: "Éphésiens 6:7 – Servez de bon cœur, comme pour le Seigneur.",
        options: [
          {
            label: "La qualité du son, de l'éclairage ou de la production",
            departments: ["Sound", "Tech Team", "Production"],
          },
          {
            label: "Si les invités se sentent accueillis",
            departments: ["Host Team", "Guest Relations Team", "Hospitality", "Ushers"],
          },
          { label: "La musique de louange et l'atmosphère", departments: ["Music", "K-Music"] },
          {
            label: "Si l'espace est propre et bien préparé",
            departments: ["Sanctuary Keepers", "Set-up", "Uniform"],
          },
        ],
      },
      {
        q: "Si vous pouviez diriger quelque chose, ce serait quoi?",
        s: "Josué 1:9 – Fortifie-toi et prends courage.",
        options: [
          {
            label: "Un projet créatif ou une performance",
            departments: ["Drama", "Design", "Spoken Word", "Photography"],
          },
          {
            label: "Une initiative de sensibilisation ou mission",
            departments: ["Evangelism", "Welfare", "Follow Up"],
          },
          {
            label: "Une équipe technique ou travail en coulisses",
            departments: ["Tech Team", "Sound", "Production", "Security"],
          },
          {
            label: "Un programme pastoral ou de formation",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Quand quelqu'un souffre, que faites-vous naturellement?",
        s: "2 Corinthiens 1:4 – Dieu nous console... afin que nous puissions consoler les autres.",
        options: [
          {
            label: "Écouter et offrir un soutien pratique",
            departments: ["Welfare", "Follow Up", "New Believers"],
          },
          {
            label: "Prier avec eux et les pointer vers Dieu",
            departments: ["Evangelism", "New Believers", "Follow Up"],
          },
          {
            label: "Créer quelque chose qui exprime le réconfort",
            departments: ["Music", "K-Music", "Design", "Spoken Word"],
          },
          {
            label: "S'assurer que leur environnement et besoins sont satisfaits",
            departments: ["Hospitality", "Set-up", "Sanctuary Keepers"],
          },
        ],
      },
      {
        q: "Qu'est-ce qui vous passionne le plus: créer, organiser, aider ou partager hardiment?",
        s: "Colossiens 3:23 – Tout ce que vous faites, faites-le de bon cœur.",
        options: [
          {
            label: "Créer — art, musique ou contenu visuel",
            departments: ["Design", "Photography", "Drama", "K-Music", "Social Media"],
          },
          {
            label: "Organiser — systèmes, logistique, événements",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Aider — servir les gens de manière pratique",
            departments: ["Ushers", "Welfare", "Hospitality", "Sanctuary Keepers"],
          },
          {
            label: "Partager hardiment — parler, prêcher ou tendre la main",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
        ],
      },
      {
        q: "Si vous aviez un talent à utiliser pour Dieu, ce serait lequel?",
        s: "1 Pierre 4:10 – Que chacun de vous mette au service des autres le don qu'il a reçu.",
        options: [
          {
            label: "Un don musical ou artistique",
            departments: ["Music", "K-Music", "Drama", "Spoken Word"],
          },
          {
            label: "Une compétence technique ou numérique",
            departments: ["Tech Team", "Sound", "Social Media", "Photography", "Design"],
          },
          {
            label: "Un don pour les personnes et les relations",
            departments: ["Evangelism", "Host Team", "Guest Relations Team", "Welfare"],
          },
          {
            label: "Un don pour enseigner, aider ou l'administration",
            departments: ["Administration", "Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
    ],
    departments: {
      Administration: {
        title: "Administration",
        desc: "Soutient les autres en coulisses, veillant à ce que tout fonctionne efficacement.",
        scripture: "1 Corinthiens 14:40 – Que tout se fasse convenablement et avec ordre.",
        video: "https://drive.google.com/file/d/1wnmkTsVDISdhxiXn-vK8N4zMPavjZZ7i/preview",
      },
      "Children's Department": {
        title: "Département des Enfants",
        desc: "Personnes patientes, nourricières et joyeuses qui aiment enseigner et inspirer les enfants.",
        scripture: "Matthieu 19:14 – Laissez les petits enfants venir à moi.",
        video: "https://drive.google.com/file/d/1JJIuVS55yDnb7rIu6ktJQBux_sTSfEcQ/preview",
      },
      Design: {
        title: "Design & Graphisme",
        desc: "Personnes innovantes et artistiques qui donnent vie visuellement aux idées.",
        scripture: "Exode 35:35 – Il les a remplis d'intelligence pour exécuter tous les ouvrages.",
        video: "https://drive.google.com/file/d/1d4iwdnH0K6NomtO-LvAFLYUwxx5Tozo1/preview",
      },
      Drama: {
        title: "Théâtre & Drama",
        desc: "Personnes expressives et audacieuses qui utilisent la narration pour communiquer l'évangile.",
        scripture: "Matthieu 13:34 – Jésus parla en paraboles.",
        video: "https://drive.google.com/file/d/1hIHcNZx4wMO5O2CJm5W_6BWvZPWcVSEE/preview",
      },
      Evangelism: {
        title: "Évangélisation",
        desc: "Personnes audacieuses qui aiment partager l'évangile avec compassion et courage.",
        scripture: "Marc 16:15 – Allez dans tout le monde et prêchez la bonne nouvelle.",
        video: "https://drive.google.com/file/d/1u9AKntERi8S6rUDDGU5XRn5Tkw9QYQs3/preview",
      },
      "Follow Up": {
        title: "Suivi (Follow Up)",
        desc: "Personnes attentionnées qui aiment guider les nouveaux croyants et encourager leur croissance.",
        scripture: "Matthieu 28:19 – Allez, faites de toutes les nations des disciples.",
        video: "https://drive.google.com/file/d/1dwpWGFcdYopZ94QuWlxZHKMgmCoqtxpk/preview",
      },
      "Guest Relations Team": {
        title: "Relations Invités",
        desc: "Personnes chaleureuses qui s'assurent que chaque invité se sente remarqué et pris en charge.",
        scripture: "Hébreux 13:2 – N'oubliez pas l'hospitalité envers les étrangers.",
        video: "https://drive.google.com/file/d/115TgSFzLbYu761p70pzRFDOzcCqlo7dR/preview",
      },
      Hospitality: {
        title: "Hospitalité",
        desc: "Personnes chaleureuses qui créent une atmosphère d'amour et de confort pour tous.",
        scripture: "1 Pierre 4:9 – Exercez l'hospitalité les uns envers les autres sans murmures.",
        video: "https://drive.google.com/file/d/10YzjnTqd1lKKCMYTNI2jilM0R_MwPVJT/preview",
      },
      "Host Team": {
        title: "Équipe d'Accueil",
        desc: "Personnes amicales qui font que chacun se sente vu, valorisé et comme à la maison.",
        scripture: "Romains 15:7 – Accueillez-vous donc les uns les autres.",
        video: "https://drive.google.com/file/d/1UeUhTVMnRlglNL4qv2On_mUm2EuDp_4P/preview",
      },
      "K-Music": {
        title: "K-Music",
        desc: "Personnes créatives et passionnées qui utilisent leurs dons musicaux pour glorifier Dieu.",
        scripture: "Psaume 150:6 – Que tout ce qui respire loue l'Éternel!",
        video: "https://drive.google.com/file/d/1RFqlH12EReGeWcGZiLKfH8D5YSTapnU_/preview",
      },
      Music: {
        title: "Musique & Louange",
        desc: "Personnes passionnées qui utilisent leurs dons pour conduire les autres dans l'adoration.",
        scripture: "Psaume 95:1-2 – Venez, chantons avec allégresse à l'Éternel!",
        video: "https://drive.google.com/file/d/1RC0N0RV6ME4RHXyA-qBO4lsV8F9uWgDJ/preview",
      },
      "New Believers": {
        title: "Nouveaux Croyants",
        desc: "Personnes patientes qui aident les autres à comprendre la foi et à grandir spirituellement.",
        scripture: "Colossiens 1:28 – C'est lui que nous annonçons.",
        video: "https://drive.google.com/file/d/1DKaAQrFtE48fx_a4NEjKJ9qtYjc4SscJ/preview",
      },
      Photography: {
        title: "Photographie",
        desc: "Personnes créatives et observatrices qui capturent des moments significatifs.",
        scripture: "Habacuc 2:2 – Écris la vision et grave-la sur des tables.",
        video: "https://drive.google.com/file/d/1G55nzdfTS6jT1odVe0HyVX_SKzZCUNEx/preview",
      },
      Production: {
        title: "Production",
        desc: "Personnes diligentes qui assurent le bon déroulement des services.",
        scripture: "Colossiens 3:23 – Tout ce que vous faites, faites-le de bon cœur.",
        video: "https://drive.google.com/file/d/1D8WzMj_UKZutlHTh_gTbTBfS1-ndTmLs/preview",
      },
      "Sanctuary Keepers": {
        title: "Gardiens du Sanctuaire",
        desc: "Personnes responsables qui prennent soin de maintenir un environnement de culte propre.",
        scripture: "1 Corinthiens 3:16 – Ne savez-vous pas que vous êtes le temple de Dieu?",
        video: "https://drive.google.com/file/d/1785CDbMGqtF1_fis7vxvpi3p01YHERE1/preview",
      },
      Security: {
        title: "Sécurité",
        desc: "Personnes vigilantes qui priorisent la sécurité pour tous.",
        scripture: "Proverbes 27:12 – L'homme prudent voit le mal et se cache.",
        video: "https://drive.google.com/file/d/1wXUyEaYAz7kPjlc4YHSFPDRu8hzHj3js/preview",
      },
      "Set-up": {
        title: "Installation & Logistique",
        desc: "Personnes pratiques qui aiment préparer les espaces et gérer la logistique.",
        scripture: "Néhémie 4:6 – Nous rebâtîmes la muraille.",
        video: "https://drive.google.com/file/d/1gOw46ds7ZOUC2vh_EFFz2h0LRxf6Q9Rm/preview",
      },
      "Social Media": {
        title: "Réseaux Sociaux",
        desc: "Personnes créatives qui aiment raconter des histoires et engager des communautés en ligne.",
        scripture: "Psaume 19:14 – Que les paroles de ma bouche soient agréables devant toi.",
        video: "https://drive.google.com/file/d/1UZfA8MnWeMwxo6awZivX8cZzX1-n_Oiv/preview",
      },
      Sound: {
        title: "Sonorisation (Sound)",
        desc: "Personnes techniquement douées qui excellent dans la gestion audio.",
        scripture: "1 Corinthiens 14:7 – Si les instruments ne rendent pas des sons distincts.",
        video: "https://drive.google.com/file/d/1gNRsC-E3ErvQTLBKjfxY-MqqNAHLRrl9/preview",
      },
      "Spoken Word": {
        title: "Spoken Word & Poésie",
        desc: "Personnes expressives qui utilisent la poésie pour communiquer l'évangile.",
        scripture: "Psaume 19:14 – Que les paroles de ma bouche soient agréables.",
        video: "https://drive.google.com/file/d/1iqS9ycSy8eCauapD-rdmjdSV9Ta5TX9M/preview",
      },
      "Tech Team": {
        title: "Équipe Technique",
        desc: "Personnes créatives qui utilisent la technologie pour créer une atmosphère d'excellence.",
        scripture: "Colossiens 3:23 – Travaillez de bon cœur, comme pour le Seigneur.",
        video: "https://drive.google.com/file/d/1l9I2AjAi1__YXZvMsgub_MQ7ggqkMwks/preview",
      },
      Uniform: {
        title: "Tenue & Présentation",
        desc: "Personnes méticuleuses qui valorisent la présentation et les normes élevées.",
        scripture: "1 Timothée 4:12 – Sois un modèle pour les fidèles.",
        video: "https://drive.google.com/file/d/1ulvATe92alaJff7Fs0ke1oDujdu-DRiv/preview",
      },
      Ushers: {
        title: "Service d'Ordre (Ushers)",
        desc: "Personnes amicales qui aident et prennent soin des personnes de manière pratique.",
        scripture: "Hébreux 13:17 – Obéissez à vos conducteurs.",
        video: "https://drive.google.com/file/d/1H1DQlVu9DLl2OozCk81zye3cKRBNYYln/preview",
      },
      Welfare: {
        title: "Action Sociale (Welfare)",
        desc: "Personnes compatissantes qui sont motivées à aider ceux dans le besoin.",
        scripture: "Galates 6:2 – Portez les fardeaux les uns des autres.",
        video: "https://drive.google.com/file/d/1BYltxeYNciIvQTaWdzoWnP7cJI8MySqD/preview",
      },
    },
  },
  es: {
    badge: "Quiz de Descubrimiento de Departamentos",
    title: "Descubre Tu Departamento en Kharis",
    subtitle: "Responde algunas preguntas para ver dónde encajan mejor tus dones.",
    stepBadge: "Paso 1 de 2",
    startHeading: "Encuentra tu lugar en Kharis",
    startDescription: "Selecciona tu sucursal de Kharis antes de comenzar con las preguntas.",
    nameLabel: "Nombre completo",
    namePlaceholder: "Ingresa tu nombre completo",
    nameError: "Por favor, ingresa tu nombre completo para comenzar.",
    branchLabel: "Sucursal / Iglesia",
    branchPlaceholder: "Selecciona tu sucursal",
    branchError: "Por favor, selecciona tu sucursal de Kharis Church o Phase 2.",
    startButton: "Comenzar Quiz",
    privacyAgreement: "Al continuar, aceptas nuestra {policy}.",
    privacyPolicyLink: "Política de privacidad",
    questionBadge: "Pregunta {current} de {total}",
    nextButton: "Siguiente",
    backButton: "Atrás",
    finishButton: "Ver resultados 🎉",
    discoveryCompleted: "Descubrimiento completado",
    resultsTitle: "Tus Departamentos Principales",
    resultsSubtitle:
      "Según tu corazón, dones e instintos, aquí están tus mejores coincidencias ministeriales.",
    topMatchBadge: "Mejor Coincidencia · #1",
    highestCompatibility: "Mayor compatibilidad",
    watchSpotlight: "Ver vídeo de {dept}",
    matchRank: "#{rank} Coincidencia",
    previewVideo: "Ver vista previa",
    exploreButton: "Explorar Todos los Departamentos",
    filterDepartmentsPlaceholder: "Filtrar lista de departamentos...",
    playDeptVideo: "Reproducir vídeo de {dept}",
    restartButton: "Comenzar de Nuevo",
    nextStepTitle: "¿Listo para dar el siguiente paso?",
    nextStepSubtitle: "Conéctate con el equipo de tu iglesia o descubre los próximos servicios.",
    findBranchButton: "Encuentra tu sucursal",
    questions: [
      {
        q: "Cuando te enfrentas al caos, ¿qué te da más estabilidad?",
        s: "1 Corintios 14:33 – Porque Dios no es Dios de confusión, sino de paz.",
        options: [
          {
            label: "Crear estructura y planes claros",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Orar y buscar la presencia de Dios",
            departments: ["New Believers", "Follow Up", "Welfare"],
          },
          {
            label: "Reunir y animar a las personas",
            departments: ["Hospitality", "Host Team", "Guest Relations Team"],
          },
          {
            label: "Expresarme creativamente",
            departments: ["Music", "Drama", "Spoken Word", "Design"],
          },
        ],
      },
      {
        q: "¿Cómo prefieres impactar a los demás?",
        s: "Mateo 5:16 – Así alumbre vuestra luz delante de los hombres.",
        options: [
          {
            label: "A través de palabras valientes y proclamación",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
          {
            label: "A través del servicio y ayuda práctica",
            departments: ["Set-up", "Sanctuary Keepers", "Ushers", "Uniform"],
          },
          {
            label: "A través de la música, arte o creatividad",
            departments: ["Music", "K-Music", "Design", "Photography"],
          },
          {
            label: "A través de tecnología y trabajo entre bastidores",
            departments: ["Tech Team", "Sound", "Social Media", "Production"],
          },
        ],
      },
      {
        q: "En un grupo, eres el que...",
        s: "Romanos 12:6 – Tenemos dones diferentes.",
        options: [
          {
            label: "Organiza a todos y mantiene todo en orden",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Hace que todos se sientan bienvenidos",
            departments: ["Hospitality", "Host Team", "Guest Relations Team", "Ushers"],
          },
          {
            label: "Captura momentos o cuenta la historia",
            departments: ["Photography", "Social Media", "Drama", "Design"],
          },
          {
            label: "Enseña, mentoriza o alienta el crecimiento",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "¿Qué parte de un servicio notas naturalmente primero?",
        s: "Efesios 6:7 – Sirviendo de buena voluntad, como al Señor.",
        options: [
          {
            label: "La calidad del sonido, iluminación o producción",
            departments: ["Sound", "Tech Team", "Production"],
          },
          {
            label: "Si los invitados se sienten bienvenidos",
            departments: ["Host Team", "Guest Relations Team", "Hospitality", "Ushers"],
          },
          { label: "La música de adoración y la atmósfera", departments: ["Music", "K-Music"] },
          {
            label: "Si el espacio está limpio y bien preparado",
            departments: ["Sanctuary Keepers", "Set-up", "Uniform"],
          },
        ],
      },
      {
        q: "Si pudieras liderar algo, ¿qué sería?",
        s: "Josué 1:9 – Esfuérzate y sé valiente.",
        options: [
          {
            label: "Un proyecto creativo o una actuación",
            departments: ["Drama", "Design", "Spoken Word", "Photography"],
          },
          {
            label: "Una iniciativa de alcance comunitario",
            departments: ["Evangelism", "Welfare", "Follow Up"],
          },
          {
            label: "Un equipo técnico o trabajo entre bastidores",
            departments: ["Tech Team", "Sound", "Production", "Security"],
          },
          {
            label: "Un programa pastoral o de discipulado",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Cuando alguien está sufriendo, ¿qué haces naturalmente?",
        s: "2 Corintios 1:4 – Dios nos consuela... para que podamos consolar a otros.",
        options: [
          {
            label: "Escuchar y ofrecer apoyo práctico",
            departments: ["Welfare", "Follow Up", "New Believers"],
          },
          {
            label: "Orar con ellos y apuntarlos a Dios",
            departments: ["Evangelism", "New Believers", "Follow Up"],
          },
          {
            label: "Crear algo que exprese consuelo o esperanza",
            departments: ["Music", "K-Music", "Design", "Spoken Word"],
          },
          {
            label: "Asegurarse de que su entorno y necesidades estén cubiertos",
            departments: ["Hospitality", "Set-up", "Sanctuary Keepers"],
          },
        ],
      },
      {
        q: "¿Qué te emociona más: crear, organizar, ayudar o compartir con valentía?",
        s: "Colosenses 3:23 – Todo lo que hagáis, hacedlo de corazón.",
        options: [
          {
            label: "Crear — arte, música o contenido visual",
            departments: ["Design", "Photography", "Drama", "K-Music", "Social Media"],
          },
          {
            label: "Organizar — sistemas, logística, eventos",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Ayudar — servir a personas de manera práctica",
            departments: ["Ushers", "Welfare", "Hospitality", "Sanctuary Keepers"],
          },
          {
            label: "Compartir con valentía — hablar, predicar o alcanzar",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
        ],
      },
      {
        q: "Si tuvieras un talento para usar para Dios, ¿cuál sería?",
        s: "1 Pedro 4:10 – Cada uno según el don que ha recibido.",
        options: [
          {
            label: "Un don musical o artístico",
            departments: ["Music", "K-Music", "Drama", "Spoken Word"],
          },
          {
            label: "Una habilidad técnica o digital",
            departments: ["Tech Team", "Sound", "Social Media", "Photography", "Design"],
          },
          {
            label: "Un don para las personas y las relaciones",
            departments: ["Evangelism", "Host Team", "Guest Relations Team", "Welfare"],
          },
          {
            label: "Un don para enseñar, ayudar o administrar",
            departments: ["Administration", "Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
    ],
    departments: {
      Administration: {
        title: "Administración",
        desc: "Apoya a otros entre bastidores, asegurando que todo funcione sin problemas.",
        scripture: "1 Corintios 14:40 – Pero hágase todo decentemente y con orden.",
        video: "https://drive.google.com/file/d/1wnmkTsVDISdhxiXn-vK8N4zMPavjZZ7i/preview",
      },
      "Children's Department": {
        title: "Departamento Infantil",
        desc: "Personas pacientes y alegres que aman enseñar e inspirar a los niños.",
        scripture: "Mateo 19:14 – Dejad a los niños venir a mí.",
        video: "https://drive.google.com/file/d/1JJIuVS55yDnb7rIu6ktJQBux_sTSfEcQ/preview",
      },
      Design: {
        title: "Diseño",
        desc: "Personas innovadoras que dan vida visualmente a las ideas.",
        scripture: "Éxodo 35:35 – Los ha llenado de sabiduría para hacer toda obra de arte.",
        video: "https://drive.google.com/file/d/1d4iwdnH0K6NomtO-LvAFLYUwxx5Tozo1/preview",
      },
      Drama: {
        title: "Teatro y Drama",
        desc: "Personas expresivas y audaces que usan la narración para comunicar el evangelio.",
        scripture: "Mateo 13:34 – Jesús habló en parábolas.",
        video: "https://drive.google.com/file/d/1hIHcNZx4wMO5O2CJm5W_6BWvZPWcVSEE/preview",
      },
      Evangelism: {
        title: "Evangelismo",
        desc: "Personas audaces que aman compartir el evangelio con compasión.",
        scripture: "Marcos 16:15 – Id por todo el mundo y predicad el evangelio.",
        video: "https://drive.google.com/file/d/1u9AKntERi8S6rUDDGU5XRn5Tkw9QYQs3/preview",
      },
      "Follow Up": {
        title: "Seguimiento (Follow Up)",
        desc: "Personas atentas que guían a los nuevos creyentes y fomentan el crecimiento.",
        scripture: "Mateo 28:19 – Haced discípulos a todas las naciones.",
        video: "https://drive.google.com/file/d/1dwpWGFcdYopZ94QuWlxZHKMgmCoqtxpk/preview",
      },
      "Guest Relations Team": {
        title: "Atención a Invitados",
        desc: "Personas cálidas que se aseguran de que cada invitado se sienta atendido.",
        scripture: "Hebreos 13:2 – No olvidéis la hospitalidad con los extraños.",
        video: "https://drive.google.com/file/d/115TgSFzLbYu761p70pzRFDOzcCqlo7dR/preview",
      },
      Hospitality: {
        title: "Hospitalidad",
        desc: "Personas cálidas que crean una atmósfera de amor y confort.",
        scripture: "1 Pedro 4:9 – Sed hospitalarios sin murmuraciones.",
        video: "https://drive.google.com/file/d/10YzjnTqd1lKKCMYTNI2jilM0R_MwPVJT/preview",
      },
      "Host Team": {
        title: "Equipo de Anfitriones",
        desc: "Personas amigables que hacen que todos se sientan vistos y valorados.",
        scripture: "Romanos 15:7 – Recibíos los unos a los otros.",
        video: "https://drive.google.com/file/d/1UeUhTVMnRlglNL4qv2On_mUm2EuDp_4P/preview",
      },
      "K-Music": {
        title: "K-Music",
        desc: "Personas creativas y apasionadas que usan sus dones musicales para glorificar a Dios.",
        scripture: "Salmo 150:6 – ¡Todo lo que respira alabe al Señor!",
        video: "https://drive.google.com/file/d/1RFqlH12EReGeWcGZiLKfH8D5YSTapnU_/preview",
      },
      Music: {
        title: "Música y Alabanza",
        desc: "Personas apasionadas que usan sus dones para guiar a otros en adoración.",
        scripture: "Salmos 95:1-2 – Venid, aclamemos con júbilo a Jehová.",
        video: "https://drive.google.com/file/d/1RC0N0RV6ME4RHXyA-qBO4lsV8F9uWgDJ/preview",
      },
      "New Believers": {
        title: "Nuevos Creyentes",
        desc: "Personas pacientes que ayudan a otros a entender la fe y crecer.",
        scripture: "Colosenses 1:28 – A quien anunciamos, enseñando a todo hombre.",
        video: "https://drive.google.com/file/d/1DKaAQrFtE48fx_a4NEjKJ9qtYjc4SscJ/preview",
      },
      Photography: {
        title: "Fotografía",
        desc: "Personas creativas y observadoras que capturan momentos significativos.",
        scripture: "Habacuc 2:2 – Escribe la visión y hazla clara.",
        video: "https://drive.google.com/file/d/1G55nzdfTS6jT1odVe0HyVX_SKzZCUNEx/preview",
      },
      Production: {
        title: "Producción",
        desc: "Personas diligentes que aseguran el buen funcionamiento de los servicios.",
        scripture: "Colosenses 3:23 – Todo lo que hagáis, hacedlo de corazón.",
        video: "https://drive.google.com/file/d/1D8WzMj_UKZutlHTh_gTbTBfS1-ndTmLs/preview",
      },
      "Sanctuary Keepers": {
        title: "Cuidado del Santuario",
        desc: "Personas responsables que mantienen un entorno de adoración limpio.",
        scripture: "1 Corintios 3:16 – ¿No sabéis que sois templo de Dios?",
        video: "https://drive.google.com/file/d/1785CDbMGqtF1_fis7vxvpi3p01YHERE1/preview",
      },
      Security: {
        title: "Seguridad",
        desc: "Personas alertas que priorizan la seguridad para todos.",
        scripture: "Proverbios 27:12 – El avisado ve el mal y se esconde.",
        video: "https://drive.google.com/file/d/1wXUyEaYAz7kPjlc4YHSFPDRu8hzHj3js/preview",
      },
      "Set-up": {
        title: "Montaje y Logística",
        desc: "Personas prácticas que disfrutan preparando espacios y gestionando logística.",
        scripture: "Nehemías 4:6 – Edificamos la muralla.",
        video: "https://drive.google.com/file/d/1gOw46ds7ZOUC2vh_EFFz2h0LRxf6Q9Rm/preview",
      },
      "Social Media": {
        title: "Redes Sociales",
        desc: "Personas creativas que disfrutan contando historias y enganchando comunidades en línea.",
        scripture: "Salmos 19:14 – Que las palabras de mi boca sean agradables.",
        video: "https://drive.google.com/file/d/1UZfA8MnWeMwxo6awZivX8cZzX1-n_Oiv/preview",
      },
      Sound: {
        title: "Sonido",
        desc: "Personas técnicas y precisas que gestionan el audio.",
        scripture: "1 Corintios 14:7 – Si los instrumentos no emiten sonidos distintos.",
        video: "https://drive.google.com/file/d/1gNRsC-E3ErvQTLBKjfxY-MqqNAHLRrl9/preview",
      },
      "Spoken Word": {
        title: "Spoken Word y Poesía",
        desc: "Personas expresivas que usan poesía para comunicar el evangelio.",
        scripture: "Salmos 19:14 – Que las palabras de mi boca sean agradables.",
        video: "https://drive.google.com/file/d/1iqS9ycSy8eCauapD-rdmjdSV9Ta5TX9M/preview",
      },
      "Tech Team": {
        title: "Equipo Técnico",
        desc: "Personas creativas que usan tecnología para crear una atmósfera de excelencia.",
        scripture: "Colosenses 3:23 – Todo lo que hagáis, hacedlo de corazón.",
        video: "https://drive.google.com/file/d/1l9I2AjAi1__YXZvMsgub_MQ7ggqkMwks/preview",
      },
      Uniform: {
        title: "Uniforme y Presentación",
        desc: "Personas meticulosas que valoran la presentación y los altos estándares.",
        scripture: "1 Timoteo 4:12 – Sé un ejemplo para los creyentes.",
        video: "https://drive.google.com/file/d/1ulvATe92alaJff7Fs0ke1oDujdu-DRiv/preview",
      },
      Ushers: {
        title: "Ujieres (Ushers)",
        desc: "Personas amigables que guían y cuidan a las personas de manera práctica.",
        scripture: "Hebreos 13:17 – Obedeced a vuestros pastores.",
        video: "https://drive.google.com/file/d/1H1DQlVu9DLl2OozCk81zye3cKRBNYYln/preview",
      },
      Welfare: {
        title: "Bienestar Social (Welfare)",
        desc: "Personas compasivas motivadas a ayudar a los necesitados.",
        scripture: "Gálatas 6:2 – Sobrellevad los unos las cargas de los otros.",
        video: "https://drive.google.com/file/d/1BYltxeYNciIvQTaWdzoWnP7cJI8MySqD/preview",
      },
    },
  },
  kri: {
    badge: "Dipatment Diskova Kwiz",
    title: "Diskova Yu Kharis Dipament",
    subtitle: "Ansa som kɔt kweshɔn fɔ si wɛ yu gif fit.",
    stepBadge: "Stɛp 1 pan 2",
    startHeading: "Fɛn yu ples na Kharis",
    startDescription: "Shus yu Kharis branch bifo wi stat di kweshɔn dem.",
    nameLabel: "Ful Nem",
    namePlaceholder: "Put yu ful nem",
    nameError: "Plis put yu ful nem bifo yu stat.",
    branchLabel: "Branch",
    branchPlaceholder: "Shus yu branch",
    branchError: "Plis shus yu Kharis Choch o Phase 2 branch.",
    startButton: "Stat Kwiz",
    privacyAgreement: "Bai yu de kɔntinyu, yu gri to awa {policy}.",
    privacyPolicyLink: "Priivasì Politik",
    questionBadge: "Kweshɔn {current} pan {total}",
    nextButton: "Nɛks",
    backButton: "Bak",
    finishButton: "Luk di Rizɔlt 🎉",
    discoveryCompleted: "Diskova Dɔn Kɔmplit",
    resultsTitle: "Yu Top Dipament dem",
    resultsSubtitle:
      "Beste pan yu at, yu gift dem, an yu instinct, ya na yu top dipatment match dem.",
    topMatchBadge: "Top Match · #1",
    highestCompatibility: "Ayest Kompatibiliti",
    watchSpotlight: "Luk {dept} Video",
    matchRank: "#{rank} Match",
    previewVideo: "Luk di Video",
    exploreButton: "Luk Ɔl Dipament",
    filterDepartmentsPlaceholder: "Filta di dipatment list...",
    playDeptVideo: "Pley {dept} Video",
    restartButton: "Stat Agen",
    nextStepTitle: "Yu rɛdi fɔ tek di nɛks stɛp?",
    nextStepSubtitle: "Kɔnɛkt wit yu choch tim o si wetin de kɔm na yu branch.",
    findBranchButton: "Fɛn Yu Branch",
    questions: [
      {
        q: "Wen tin dɔn kɔnfyuz, wetin hɛlp yu most?",
        s: "1 Korinti 14:33 – Bikos God na God ɔf pis, no kɔnfyuzɔn.",
        options: [
          {
            label: "Mek plan an putu tin ɔda",
            departments: ["Administration", "Production", "Set-up"],
          },
          { label: "Pre an sɛk God fes", departments: ["New Believers", "Follow Up", "Welfare"] },
          {
            label: "Gɛda pipul an ankɔrij dem",
            departments: ["Hospitality", "Host Team", "Guest Relations Team"],
          },
          {
            label: "Ekspres miself kɔntiniyu",
            departments: ["Music", "Drama", "Spoken Word", "Design"],
          },
        ],
      },
      {
        q: "Aw yu laik fɔ afɛkt ɔda pipul?",
        s: "Matyu 5:16 – Mek yu layt shain bifo pipul.",
        options: [
          {
            label: "Tru bold wɔd an prɔklameshɔn",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
          {
            label: "Tru sɛvis an praktikɔl hɛlp",
            departments: ["Set-up", "Sanctuary Keepers", "Ushers", "Uniform"],
          },
          {
            label: "Tru myuzik, ɔt, ɔ kɔntiniyu",
            departments: ["Music", "K-Music", "Design", "Photography"],
          },
          {
            label: "Tru teknɔlɔji an wɔk bihayn si",
            departments: ["Tech Team", "Sound", "Social Media", "Production"],
          },
        ],
      },
      {
        q: "Insɛd grɔp, yu na di wan we...",
        s: "Rɔmɔns 12:6 – Wi gɛt difren gif.",
        options: [
          {
            label: "Ɔganays ɔlbɔdi an ki tin ɔda",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Mek pipul fil welkɔm an ɔlrait",
            departments: ["Hospitality", "Host Team", "Guest Relations Team", "Ushers"],
          },
          {
            label: "Kach mɔmɛnt ɔ tɛl stori",
            departments: ["Photography", "Social Media", "Drama", "Design"],
          },
          {
            label: "Tich, mentɔ, ɔ ankɔrij grɔt",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Which paat ɔf sɛvis yu nɔtis fɔs?",
        s: "Ɛfɛsɔns 6:7 – Sɛv wɛl, layk fɔ God.",
        options: [
          {
            label: "Di saund, lait ɔ prodɔkshɔn kwɔliti",
            departments: ["Sound", "Tech Team", "Production"],
          },
          {
            label: "If gɛs dem fil welkɔm",
            departments: ["Host Team", "Guest Relations Team", "Hospitality", "Ushers"],
          },
          { label: "Di wɔship myuzik an atmɔsfiya", departments: ["Music", "K-Music"] },
          {
            label: "If di ples kɔmot kɔmɔt an rɛdi",
            departments: ["Sanctuary Keepers", "Set-up", "Uniform"],
          },
        ],
      },
      {
        q: "If yu kɔd lid sɔmtin, wetin i bɔ bi?",
        s: "Jɔsha 1:9 – Bi strang an kɔrij.",
        options: [
          {
            label: "Kriɛtiv projɛk ɔ pafɔmans",
            departments: ["Drama", "Design", "Spoken Word", "Photography"],
          },
          {
            label: "Kɔmyuniti ritchi ɔ mishɔn",
            departments: ["Evangelism", "Welfare", "Follow Up"],
          },
          {
            label: "Tɛknikɔl tim ɔ wɔk bihayn si",
            departments: ["Tech Team", "Sound", "Production", "Security"],
          },
          {
            label: "Pastɔrɔl ɔ disaipɔlship prɔgram",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Wen sɔmbɔdi dɔn hɛt, wetin yu nɔrmɔli du?",
        s: "2 Korinti 1:4 – God kɔmfɔt wi... so wi kɛn kɔmfɔt ɔda.",
        options: [
          {
            label: "Listɛn an ɔfa praktikɔl sapɔt",
            departments: ["Welfare", "Follow Up", "New Believers"],
          },
          {
            label: "Pre wid dem an pɔint dem tɔwɔds God",
            departments: ["Evangelism", "New Believers", "Follow Up"],
          },
          {
            label: "Kriɛt sɔmtin we ekspres kɔmfɔt",
            departments: ["Music", "K-Music", "Design", "Spoken Word"],
          },
          {
            label: "Mek shɔ dia ɛnvayrɔnmɛnt an nis kɔvad",
            departments: ["Hospitality", "Set-up", "Sanctuary Keepers"],
          },
        ],
      },
      {
        q: "Wetin mek yu glad mɔs: kriɛt, ɔganays, hɛlp ɔ shia bɔldli?",
        s: "Kɔlɔsɔns 3:23 – Ɔniting yu du, du am ɔlhɛt.",
        options: [
          {
            label: "Kriɛt — ɔt, myuzik ɔ vizhuwɔl kɔntɛnt",
            departments: ["Design", "Photography", "Drama", "K-Music", "Social Media"],
          },
          {
            label: "Ɔganays — sistɛm, lɔjistiks, ɛvɛnts",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Hɛlp — sɛv pipul praktikɔli",
            departments: ["Ushers", "Welfare", "Hospitality", "Sanctuary Keepers"],
          },
          {
            label: "Shia bɔldli — tɔk, pritsh ɔ ritsh awt",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
        ],
      },
      {
        q: "If yu gɛt wan talɛnt fɔ yuz fɔ God, wetin i bɔ bi?",
        s: "1 Pita 4:10 – Ɔlwan yuz dɛm gif fɔ sɛv ɔda.",
        options: [
          {
            label: "Myuzikɔl ɔ ɔtistik gif",
            departments: ["Music", "K-Music", "Drama", "Spoken Word"],
          },
          {
            label: "Tɛknikɔl ɔ dijitɔl skil",
            departments: ["Tech Team", "Sound", "Social Media", "Photography", "Design"],
          },
          {
            label: "Gif fɔ pipul an rileshɔnship",
            departments: ["Evangelism", "Host Team", "Guest Relations Team", "Welfare"],
          },
          {
            label: "Gif fɔ tich, hɛlp ɔ ɔdministrɛshɔn",
            departments: ["Administration", "Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
    ],
    departments: {
      Administration: {
        title: "Administration",
        desc: "Sapɔt ɔda bihayn si, mek ɔltin wɔk wɛl.",
        scripture: "1 Korinti 14:40 – Mek ɔltin du ɔda an wɛl.",
        video: "https://drive.google.com/file/d/1wnmkTsVDISdhxiXn-vK8N4zMPavjZZ7i/preview",
      },
      "Children's Department": {
        title: "Pikin Dipatment",
        desc: "Pɛshɛnt an joyful pipul we luv tich pikin dem.",
        scripture: "Matyu 19:14 – Mek di pikin dem kɔm tɔ mi.",
        video: "https://drive.google.com/file/d/1JJIuVS55yDnb7rIu6ktJQBux_sTSfEcQ/preview",
      },
      Design: {
        title: "Dizayn",
        desc: "Kriɛtiv pipul we bring aydias tɔ laif vizhuwɔli.",
        scripture: "Ɛksɔdɔs 35:35 – I fil dem wid wizdɔm fɔ du ɔl kayn wɔk.",
        video: "https://drive.google.com/file/d/1d4iwdnH0K6NomtO-LvAFLYUwxx5Tozo1/preview",
      },
      Drama: {
        title: "Drama",
        desc: "Ekspresiv pipul we yuz storitɛlin fɔ kɔmyunikɛt di gospɛl.",
        scripture: "Matyu 13:34 – Jisos tɔk ɔl dis tin in parɔbɔls.",
        video: "https://drive.google.com/file/d/1hIHcNZx4wMO5O2CJm5W_6BWvZPWcVSEE/preview",
      },
      Evangelism: {
        title: "Ivandjɛlizim",
        desc: "Bold pipul we luv shia di gospɛl wid kɔmpashɔn.",
        scripture: "Mak 16:15 – Go insɛd ɔl di wɔld an pritsh di gud nyuz.",
        video: "https://drive.google.com/file/d/1u9AKntERi8S6rUDDGU5XRn5Tkw9QYQs3/preview",
      },
      "Follow Up": {
        title: "Fɔlo Ɔp",
        desc: "Kerful pipul we luv gaid nyu biliva dem.",
        scripture: "Matyu 28:19 – Go mek disaipɔl ɔl nɛshɔn.",
        video: "https://drive.google.com/file/d/1dwpWGFcdYopZ94QuWlxZHKMgmCoqtxpk/preview",
      },
      "Guest Relations Team": {
        title: "Gɛs Rileshɔns Tim",
        desc: "Wɔm pipul we mek shɔ ɔl gɛs fil nitist an keit fɔ.",
        scripture: "Hibru 13:2 – Nɔ fɔgɛt fɔ sho ɔspitaliti tɔ stɛnjaz.",
        video: "https://drive.google.com/file/d/115TgSFzLbYu761p70pzRFDOzcCqlo7dR/preview",
      },
      Hospitality: {
        title: "Ɔspitaliti",
        desc: "Wɔm pipul we kriɛt ɛtmɔsfiya ɔf luv an kɔmfɔt.",
        scripture: "1 Pita 4:9 – Ɔfa ɔspitaliti witawt grɔmblin.",
        video: "https://drive.google.com/file/d/10YzjnTqd1lKKCMYTNI2jilM0R_MwPVJT/preview",
      },
      "Host Team": {
        title: "Host Tim",
        desc: "Frɛndli pipul we mek ɔlbɔdi fil si, vɛlyu an ɔm.",
        scripture: "Rɔmɔns 15:7 – Welkɔm ɔnɔda layk Krayst welkɔm yu.",
        video: "https://drive.google.com/file/d/1UeUhTVMnRlglNL4qv2On_mUm2EuDp_4P/preview",
      },
      "K-Music": {
        title: "K-Myuzik",
        desc: "Kriɛtiv pipul we yuz dem myuzikɔl gif fɔ glorifay God.",
        scripture: "Sɔm 150:6 – Mek ɔltin we brɛf prez di Lɔd.",
        video: "https://drive.google.com/file/d/1RFqlH12EReGeWcGZiLKfH8D5YSTapnU_/preview",
      },
      Music: {
        title: "Myuzik",
        desc: "Pashɔnit pipul we yuz dem gif fɔ lid ɔda in wɔship.",
        scripture: "Sɔm 95:1-2 – Kɔm, lɛt wi sing fɔ joy tɔ di Lɔd.",
        video: "https://drive.google.com/file/d/1RC0N0RV6ME4RHXyA-qBO4lsV8F9uWgDJ/preview",
      },
      "New Believers": {
        title: "Nyu Bilivas",
        desc: "Pɛshɛnt pipul we hɛlp ɔda andastand fɛt an grow.",
        scripture: "Kɔlɔsɔns 1:28 – Wi prɔklaim am, tich ɔlwan wid wizdɔm.",
        video: "https://drive.google.com/file/d/1DKaAQrFtE48fx_a4NEjKJ9qtYjc4SscJ/preview",
      },
      Photography: {
        title: "Fɔtɔgrafi",
        desc: "Ɔbzɔvant pipul we kach mɔmɛnts we tɛl stɔriz.",
        scripture: "Abakuk 2:2 – Rait dɔn di vizhɔn an mek am klia.",
        video: "https://drive.google.com/file/d/1G55nzdfTS6jT1odVe0HyVX_SKzZCUNEx/preview",
      },
      Production: {
        title: "Prodɔkshɔn",
        desc: "Dɛlɔjɛnt pipul we mek shɔ sɛvis rɔn smuɔli.",
        scripture: "Kɔlɔsɔns 3:23 – Ɔniting yu du, du am ɔlhɛt.",
        video: "https://drive.google.com/file/d/1D8WzMj_UKZutlHTh_gTbTBfS1-ndTmLs/preview",
      },
      "Sanctuary Keepers": {
        title: "Sankchwari Kipaz",
        desc: "Rɛspɔnsibɔl pipul we praid demsɛlf ɔn kip wɔship ɛnvayrɔnmɛnt kɔmɔt.",
        scripture: "1 Korinti 3:16 – Yu nɔ kno se yu na God tempɔl?",
        video: "https://drive.google.com/file/d/1785CDbMGqtF1_fis7vxvpi3p01YHERE1/preview",
      },
      Security: {
        title: "Sɛkyuriti",
        desc: "Alɛt pipul we prayɔratayz seyfti fɔ ɔlbɔdi.",
        scripture: "Prɔvɔbs 27:12 – Di wayzmɛn si denjɔ an haid.",
        video: "https://drive.google.com/file/d/1wXUyEaYAz7kPjlc4YHSFPDRu8hzHj3js/preview",
      },
      "Set-up": {
        title: "Sɛt-ɔp",
        desc: "Prɛktikɔl pipul we layks pɔpɛ speys an mɛnij lɔjistiks.",
        scripture: "Nehemaya 4:6 – Wi bilɔd bak di wɔl.",
        video: "https://drive.google.com/file/d/1gOw46ds7ZOUC2vh_EFFz2h0LRxf6Q9Rm/preview",
      },
      "Social Media": {
        title: "Soshɔl Midia",
        desc: "Kriɛtiv pipul we layks tɛlin stɔriz an ɛngejin kɔmyuniti.",
        scripture: "Sɔm 19:14 – Mek di wɔds ɔf mai mawt bi plizin bifɔ yu.",
        video: "https://drive.google.com/file/d/1UZfA8MnWeMwxo6awZivX8cZzX1-n_Oiv/preview",
      },
      Sound: {
        title: "Saund Tim",
        desc: "Tɛknikɔl pipul we mɛnij ɔdio an kriɛt simlis saund.",
        scripture: "1 Korinti 14:7 – If ɛvɛn layflis instrumɛnts giv saund.",
        video: "https://drive.google.com/file/d/1gNRsC-E3ErvQTLBKjfxY-MqqNAHLRrl9/preview",
      },
      "Spoken Word": {
        title: "Spokɛn Wɔd",
        desc: "Ekspresiv pipul we yuz pɔitri tɔ inspaya an kɔmyunikɛt di gospɛl.",
        scripture: "Sɔm 19:14 – Mek di wɔds ɔf mai mawt bi plizin.",
        video: "https://drive.google.com/file/d/1iqS9ycSy8eCauapD-rdmjdSV9Ta5TX9M/preview",
      },
      "Tech Team": {
        title: "Tɛk Tim",
        desc: "Kriɛtiv pipul we yuz teknɔlɔji fɔ kriɛt ɛkselɛns.",
        scripture: "Kɔlɔsɔns 3:23 – Du ɔl wɔk wɛl, layk fɔ di Lɔd.",
        video: "https://drive.google.com/file/d/1l9I2AjAi1__YXZvMsgub_MQ7ggqkMwks/preview",
      },
      Uniform: {
        title: "Yunifɔm",
        desc: "Mɛtikɔlɔs pipul we vɛlyu prɛzɛntɛshɔn an hayi standɔds.",
        scripture: "1 Tɔmɔti 4:12 – Set ɛgzɔmpl fɔ ɔda bilivas.",
        video: "https://drive.google.com/file/d/1ulvATe92alaJff7Fs0ke1oDujdu-DRiv/preview",
      },
      Ushers: {
        title: "Ɔshaz (Ushers)",
        desc: "Frɛndli pipul we layk gaid an tɛk kia ɔf pipul.",
        scripture: "Hibru 13:17 – Ɔbey yu lidaz.",
        video: "https://drive.google.com/file/d/1H1DQlVu9DLl2OozCk81zye3cKRBNYYln/preview",
      },
      Welfare: {
        title: "Wɛlfia (Welfare)",
        desc: "Kɔmpashɔnit pipul we motɔvɛtid fɔ hɛlp di nidy.",
        scripture: "Galeshɔns 6:2 – Kɛri ɔnɔda bɔdn.",
        video: "https://drive.google.com/file/d/1BYltxeYNciIvQTaWdzoWnP7cJI8MySqD/preview",
      },
    },
  },
  de: {
    badge: "Abteilungs-Entdeckungs-Quiz",
    title: "Entdecke Deine Kharis Abteilung",
    subtitle: "Beantworte einige kurze Fragen, um zu sehen, wo deine Gaben am besten passen.",
    stepBadge: "Schritt 1 von 2",
    startHeading: "Finde deinen Platz bei Kharis",
    startDescription: "Wähle deinen Kharis Standort aus, bevor wir mit den Fragen beginnen.",
    nameLabel: "Vollständiger Name",
    namePlaceholder: "Gib deinen vollständigen Namen ein",
    nameError: "Bitte gib deinen vollständigen Namen ein, um zu beginnen.",
    branchLabel: "Gemeinde / Standort",
    branchPlaceholder: "Wähle deine Gemeinde",
    branchError: "Bitte wähle deine Kharis Church oder Phase 2 Gemeinde aus.",
    startButton: "Quiz Starten",
    privacyAgreement: "Mit dem Fortfahren stimmst du unserer {policy} zu.",
    privacyPolicyLink: "Datenschutzerklärung",
    questionBadge: "Frage {current} von {total}",
    nextButton: "Weiter",
    backButton: "Zurück",
    finishButton: "Ergebnisse anzeigen 🎉",
    discoveryCompleted: "Entdeckung abgeschlossen",
    resultsTitle: "Deine Top Abteilungen",
    resultsSubtitle:
      "Basierend auf deinem Herzen, deinen Gaben und Instinkten sind hier deine besten Übereinstimmungen.",
    topMatchBadge: "Top Treffer · #1",
    highestCompatibility: "Höchste Übereinstimmung",
    watchSpotlight: "{dept} Video ansehen",
    matchRank: "#{rank} Treffer",
    previewVideo: "Video ansehen",
    exploreButton: "Alle Abteilungen Erkunden",
    filterDepartmentsPlaceholder: "Abteilungsliste filtern...",
    playDeptVideo: "{dept} Video abspielen",
    restartButton: "Von vorne beginnen",
    nextStepTitle: "Bereit für den nächsten Schritt?",
    nextStepSubtitle: "Verbinde dich mit deinem Gemeindeteam oder entdecke Gottesdienste vor Ort.",
    findBranchButton: "Finde deine Gemeinde",
    questions: [
      {
        q: "Wenn du Chaos begegnest, was gibt dir am meisten Halt?",
        s: "1 Korinther 14:33 – Denn Gott ist kein Gott der Unordnung, sondern des Friedens.",
        options: [
          {
            label: "Struktur und klare Pläne erstellen",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Beten und Gottes Gegenwart suchen",
            departments: ["New Believers", "Follow Up", "Welfare"],
          },
          {
            label: "Menschen zusammenbringen und ermutigen",
            departments: ["Hospitality", "Host Team", "Guest Relations Team"],
          },
          {
            label: "Mich kreativ ausdrücken",
            departments: ["Music", "Drama", "Spoken Word", "Design"],
          },
        ],
      },
      {
        q: "Wie möchtest du andere am liebsten beeinflussen?",
        s: "Matthäus 5:16 – So lasst euer Licht leuchten vor den Menschen.",
        options: [
          {
            label: "Durch mutige Worte und Verkündigung",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
          {
            label: "Durch Dienst und praktische Hilfe",
            departments: ["Set-up", "Sanctuary Keepers", "Ushers", "Uniform"],
          },
          {
            label: "Durch Musik, Kunst oder Kreativität",
            departments: ["Music", "K-Music", "Design", "Photography"],
          },
          {
            label: "Durch Technologie und Arbeit hinter den Kulissen",
            departments: ["Tech Team", "Sound", "Social Media", "Production"],
          },
        ],
      },
      {
        q: "In einer Gruppe bist du derjenige, der...",
        s: "Römer 12:6 – Wir haben verschiedene Gaben.",
        options: [
          {
            label: "Alle organisiert und den Überblick behält",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Dafür sorgt, dass sich alle willkommen fühlen",
            departments: ["Hospitality", "Host Team", "Guest Relations Team", "Ushers"],
          },
          {
            label: "Momente festhält oder die Geschichte erzählt",
            departments: ["Photography", "Social Media", "Drama", "Design"],
          },
          {
            label: "Lehrt, mentort oder das Wachstum ermutigt",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Welchen Teil eines Gottesdienstes bemerkst du naturgemäß zuerst?",
        s: "Epheser 6:7 – Dient von Herzen, als ob ihr dem Herrn dient.",
        options: [
          {
            label: "Die Ton-, Licht- oder Produktionsqualität",
            departments: ["Sound", "Tech Team", "Production"],
          },
          {
            label: "Ob sich Gäste willkommen fühlen",
            departments: ["Host Team", "Guest Relations Team", "Hospitality", "Ushers"],
          },
          { label: "Die Worship-Musik und Atmosphäre", departments: ["Music", "K-Music"] },
          {
            label: "Ob der Raum sauber und gut vorbereitet ist",
            departments: ["Sanctuary Keepers", "Set-up", "Uniform"],
          },
        ],
      },
      {
        q: "Wenn du etwas leiten könntest, was wäre es?",
        s: "Josua 1:9 – Sei stark und mutig.",
        options: [
          {
            label: "Ein kreatives Projekt oder eine Aufführung",
            departments: ["Drama", "Design", "Spoken Word", "Photography"],
          },
          {
            label: "Eine Gemeinde-Outreach oder Mission",
            departments: ["Evangelism", "Welfare", "Follow Up"],
          },
          {
            label: "Ein technisches Team oder Hintergrundarbeit",
            departments: ["Tech Team", "Sound", "Production", "Security"],
          },
          {
            label: "Ein Pastoral- oder Jüngerschaftsprogramm",
            departments: ["Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
      {
        q: "Wenn jemand leidet, was tust du von Natur aus?",
        s: "2 Korinther 1:4 – Gott tröstet uns... damit wir andere trösten können.",
        options: [
          {
            label: "Zuhören und praktische Unterstützung anbieten",
            departments: ["Welfare", "Follow Up", "New Believers"],
          },
          {
            label: "Mit ihnen beten und sie auf Gott hinweisen",
            departments: ["Evangelism", "New Believers", "Follow Up"],
          },
          {
            label: "Etwas schaffen, das Trost ausdrückt",
            departments: ["Music", "K-Music", "Design", "Spoken Word"],
          },
          {
            label: "Sicherstellen, dass ihre Umgebung und Bedürfnisse erfüllt sind",
            departments: ["Hospitality", "Set-up", "Sanctuary Keepers"],
          },
        ],
      },
      {
        q: "Was begeistert dich am meisten: kreieren, organisieren, helfen oder mutig teilen?",
        s: "Kolosser 3:23 – Was auch immer ihr tut, arbeitet von Herzen.",
        options: [
          {
            label: "Kreieren — Kunst, Musik oder visuellen Inhalt",
            departments: ["Design", "Photography", "Drama", "K-Music", "Social Media"],
          },
          {
            label: "Organisieren — Systeme, Logistik, Events",
            departments: ["Administration", "Production", "Set-up"],
          },
          {
            label: "Helfen — Menschen auf praktische Weise dienen",
            departments: ["Ushers", "Welfare", "Hospitality", "Sanctuary Keepers"],
          },
          {
            label: "Mutig teilen — sprechen, predigen oder hinausgehen",
            departments: ["Evangelism", "Spoken Word", "Drama"],
          },
        ],
      },
      {
        q: "Wenn du ein Talent für Gott nutzen könntest, was wäre es?",
        s: "1 Petrus 4:10 – Jeder soll die Gabe, die er empfangen hat, zum Dienst nutzen.",
        options: [
          {
            label: "Eine musikalische oder künstlerische Gabe",
            departments: ["Music", "K-Music", "Drama", "Spoken Word"],
          },
          {
            label: "Eine technische oder digitale Fähigkeit",
            departments: ["Tech Team", "Sound", "Social Media", "Photography", "Design"],
          },
          {
            label: "Eine Gabe für Menschen und Beziehungen",
            departments: ["Evangelism", "Host Team", "Guest Relations Team", "Welfare"],
          },
          {
            label: "Eine Gabe zum Lehren, Helfen oder Verwalten",
            departments: ["Administration", "Children's Department", "New Believers", "Follow Up"],
          },
        ],
      },
    ],
    departments: {
      Administration: {
        title: "Administration (Verwaltung)",
        desc: "Unterstützt andere hinter den Kulissen und sorgt für reibungslose Abläufe.",
        scripture: "1 Korinther 14:40 – Alles soll ordentlich und geordnet geschehen.",
        video: "https://drive.google.com/file/d/1wnmkTsVDISdhxiXn-vK8N4zMPavjZZ7i/preview",
      },
      "Children's Department": {
        title: "Kinderdienst",
        desc: "Geduldige und freudige Menschen, die Kinder im Glauben begleiten.",
        scripture: "Matthäus 19:14 – Lasset die Kinder zu mir kommen.",
        video: "https://drive.google.com/file/d/1JJIuVS55yDnb7rIu6ktJQBux_sTSfEcQ/preview",
      },
      Design: {
        title: "Design & Grafik",
        desc: "Innovative und künstlerische Menschen, die Ideen visuell zum Leben erwecken.",
        scripture:
          "Exodus 35:35 – Er hat sie mit Weisheit erfüllt, um alle Arten von Werk auszuführen.",
        video: "https://drive.google.com/file/d/1d4iwdnH0K6NomtO-LvAFLYUwxx5Tozo1/preview",
      },
      Drama: {
        title: "Theater & Drama",
        desc: "Ausdrucksstarke Menschen, die Geschichten nutzen, um das Evangelium zu vermitteln.",
        scripture: "Matthäus 13:34 – Jesus sprach alles in Gleichnissen.",
        video: "https://drive.google.com/file/d/1hIHcNZx4wMO5O2CJm5W_6BWvZPWcVSEE/preview",
      },
      Evangelism: {
        title: "Evangelisation",
        desc: "Mutige Menschen, die das Evangelium mit Mitgefühl und Mut teilen.",
        scripture: "Markus 16:15 – Gehet hin in alle Welt und predigt das Evangelium.",
        video: "https://drive.google.com/file/d/1u9AKntERi8S6rUDDGU5XRn5Tkw9QYQs3/preview",
      },
      "Follow Up": {
        title: "Nacharbeit (Follow Up)",
        desc: "Fürsorgliche Menschen, die neue Gläubige begleiten und geistliches Wachstum fördern.",
        scripture: "Matthäus 28:19 – Gehet hin und machet zu Jüngern alle Völker.",
        video: "https://drive.google.com/file/d/1dwpWGFcdYopZ94QuWlxZHKMgmCoqtxpk/preview",
      },
      "Guest Relations Team": {
        title: "Gästebetreuung",
        desc: "Herzliche Menschen, die sicherstellen, dass sich jeder Gast wahrgenommen fühlt.",
        scripture: "Hebräer 13:2 – Vergesst nicht, Fremden gegenüber gastfreundlich zu sein.",
        video: "https://drive.google.com/file/d/115TgSFzLbYu761p70pzRFDOzcCqlo7dR/preview",
      },
      Hospitality: {
        title: "Gastfreundschaft",
        desc: "Herzliche Menschen, die eine Atmosphäre der Liebe und des Komforts schaffen.",
        scripture: "1 Petrus 4:9 – Seid gastfreundlich untereinander ohne Murren.",
        video: "https://drive.google.com/file/d/10YzjnTqd1lKKCMYTNI2jilM0R_MwPVJT/preview",
      },
      "Host Team": {
        title: "Empfangsteam (Host Team)",
        desc: "Freundliche Menschen, die jeden willkommen heißen.",
        scripture: "Römer 15:7 – Nehmt einander an, wie Christus euch angenommen hat.",
        video: "https://drive.google.com/file/d/1UeUhTVMnRlglNL4qv2On_mUm2EuDp_4P/preview",
      },
      "K-Music": {
        title: "K-Music",
        desc: "Kreative und leidenschaftliche Menschen, die ihre Musikgaben zur Ehre Gottes einsetzen.",
        scripture: "Psalm 150:6 – Alles was Odem hat, lobe den Herrn.",
        video: "https://drive.google.com/file/d/1RFqlH12EReGeWcGZiLKfH8D5YSTapnU_/preview",
      },
      Music: {
        title: "Musik & Lobpreis",
        desc: "Leidenschaftliche Menschen, die ihre Gaben nutzen, um andere in die Anbetung zu führen.",
        scripture: "Psalm 95:1-2 – Kommt, lasst uns dem Herrn jauchzen.",
        video: "https://drive.google.com/file/d/1RC0N0RV6ME4RHXyA-qBO4lsV8F9uWgDJ/preview",
      },
      "New Believers": {
        title: "Neue Gläubige",
        desc: "Geduldige Menschen, die anderen helfen, den Glauben zu verstehen und zu wachsen.",
        scripture: "Kolosser 1:28 – Ihn verkündigen wir und lehren jeden Menschen.",
        video: "https://drive.google.com/file/d/1DKaAQrFtE48fx_a4NEjKJ9qtYjc4SscJ/preview",
      },
      Photography: {
        title: "Fotografie",
        desc: "Aufmerksame und kreative Menschen, die bedeutsame Momente festhalten.",
        scripture: "Habakuk 2:2 – Schreibe die Vision auf und mach sie deutlich.",
        video: "https://drive.google.com/file/d/1G55nzdfTS6jT1odVe0HyVX_SKzZCUNEx/preview",
      },
      Production: {
        title: "Produktion",
        desc: "Fleißige Menschen, die durch technische Exzellenz den reibungslosen Ablauf sicherstellen.",
        scripture: "Kolosser 3:23 – Was ihr auch tut, arbeitet von Herzen.",
        video: "https://drive.google.com/file/d/1D8WzMj_UKZutlHTh_gTbTBfS1-ndTmLs/preview",
      },
      "Sanctuary Keepers": {
        title: "Kirchenpflege",
        desc: "Verantwortungsvolle Menschen, die eine saubere Gottesdienstumgebung aufrechterhalten.",
        scripture: "1 Korinther 3:16 – Wisst ihr nicht, dass ihr Gottes Tempel seid?",
        video: "https://drive.google.com/file/d/1785CDbMGqtF1_fis7vxvpi3p01YHERE1/preview",
      },
      Security: {
        title: "Sicherheitsteam",
        desc: "Wachsame Menschen, die die Sicherheit für alle priorisieren.",
        scripture: "Sprüche 27:12 – Ein Kluger sieht das Böse und verbirgt sich.",
        video: "https://drive.google.com/file/d/1wXUyEaYAz7kPjlc4YHSFPDRu8hzHj3js/preview",
      },
      "Set-up": {
        title: "Aufbau & Logistik",
        desc: "Praktische Menschen, die Räume vorbereiten und Logistik verwalten.",
        scripture: "Nehemia 4:6 – So bauten wir die Mauer.",
        video: "https://drive.google.com/file/d/1gOw46ds7ZOUC2vh_EFFz2h0LRxf6Q9Rm/preview",
      },
      "Social Media": {
        title: "Social Media",
        desc: "Kreative Menschen, die Geschichten erzählen und Gemeinschaften online engagieren.",
        scripture: "Psalm 19:14 – Lass die Worte meines Mundes dir wohlgefällig sein.",
        video: "https://drive.google.com/file/d/1UZfA8MnWeMwxo6awZivX8cZzX1-n_Oiv/preview",
      },
      Sound: {
        title: "Tontechnik (Sound)",
        desc: "Technisch versierte Menschen, die Audio verwalten und nahtlose Klangerlebnisse schaffen.",
        scripture: "1 Korinther 14:7 – Wenn auch leblose Instrumente Töne geben.",
        video: "https://drive.google.com/file/d/1gNRsC-E3ErvQTLBKjfxY-MqqNAHLRrl9/preview",
      },
      "Spoken Word": {
        title: "Spoken Word & Poesie",
        desc: "Ausdrucksstarke Menschen, die Poesie nutzen, um das Evangelium zu inspirieren.",
        scripture: "Psalm 19:14 – Lass die Worte meines Mundes dir wohlgefällig sein.",
        video: "https://drive.google.com/file/d/1iqS9ycSy8eCauapD-rdmjdSV9Ta5TX9M/preview",
      },
      "Tech Team": {
        title: "Technik-Team",
        desc: "Kreative Menschen, die Technologie nutzen, um eine Atmosphäre der Exzellenz zu schaffen.",
        scripture: "Kolosser 3:23 – Was ihr auch tut, arbeitet von Herzen.",
        video: "https://drive.google.com/file/d/1l9I2AjAi1__YXZvMsgub_MQ7ggqkMwks/preview",
      },
      Uniform: {
        title: "Ordnung & Erscheinungsbild",
        desc: "Akribische Menschen, die Präsentation und hohe Standards schätzen.",
        scripture: "1 Timotheus 4:12 – Sei ein Vorbild für die Gläubigen.",
        video: "https://drive.google.com/file/d/1ulvATe92alaJff7Fs0ke1oDujdu-DRiv/preview",
      },
      Ushers: {
        title: "Ordnerdienst (Ushers)",
        desc: "Freundliche Menschen, die Menschen praktisch führen und betreuen.",
        scripture: "Hebräer 13:17 – Gehorcht euren Anführern.",
        video: "https://drive.google.com/file/d/1H1DQlVu9DLl2OozCk81zye3cKRBNYYln/preview",
      },
      Welfare: {
        title: "Fürsorge & Soziales",
        desc: "Mitfühlende Menschen, die motiviert sind, Bedürftigen zu helfen.",
        scripture: "Galater 6:2 – Einer trage des anderen Last.",
        video: "https://drive.google.com/file/d/1BYltxeYNciIvQTaWdzoWnP7cJI8MySqD/preview",
      },
    },
  },
};

export type PrivacySubsection = {
  title: string;
  items: string[];
};

export type PrivacySection = {
  heading: string;
  icon: string;
  paragraphs?: string[];
  subsections?: PrivacySubsection[];
  items?: string[];
  contact?: {
    officer: string;
    email: string;
  };
};

export type PrivacyContent = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  backButton: string;
  sections: PrivacySection[];
};

export const QUIZ_PRIVACY_CONTENT: Record<SupportedLanguage, PrivacyContent> = {
  en: {
    title: "Privacy Policy",
    subtitle: "Kharis Church Department Discovery Quiz",
    lastUpdated: "Last Updated: September 19, 2025",
    backButton: "Back to Quiz",
    sections: [
      {
        heading: "1. Introduction",
        icon: "info",
        paragraphs: [
          'Kharis Church ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Department Discovery Quiz.',
          "By using the Quiz, you consent to the data practices described in this policy. If you do not agree, please do not use the Quiz.",
        ],
      },
      {
        heading: "2. Information We Collect",
        icon: "database",
        subsections: [
          {
            title: "Personal Information:",
            items: [
              "Date, TimeStamp, Chosen Departments, Language, Selected Kharis Church branch location",
            ],
          },
          {
            title: "Quiz Responses:",
            items: ["Answers to chosen department questions, Department compatibility results"],
          },
          {
            title: "Technical Information:",
            items: [
              "IP address and browser type, Device information, Usage data and quiz interaction patterns",
            ],
          },
        ],
      },
      {
        heading: "3. How We Use Your Information",
        icon: "settings",
        items: [
          "To generate your personalized department compatibility results",
          "To connect you with ministry opportunities at your selected branch",
          "To improve our quiz and church services",
          "For internal analytical purposes to understand congregation gifts",
          "To communicate with you about church activities (with your consent)",
        ],
      },
      {
        heading: "4. Data Storage and Security",
        icon: "lock",
        paragraphs: [
          "Your data is stored securely in Google Sheets with appropriate access controls. We implement measures to protect your personal information against unauthorized access, alteration, or destruction.",
          "Data is retained for ministry purposes unless you request deletion. Quiz responses are anonymized for analytical purposes after 24 months.",
        ],
      },
      {
        heading: "5. Your Rights",
        icon: "shield",
        items: [
          "Right to access and receive a copy of your personal data",
          "Right to rectify inaccurate or incomplete data",
          "Right to erasure of your personal data",
          "Right to restrict or object to processing",
          "Right to withdraw consent at any time",
        ],
      },
      {
        heading: "6. Contact Us",
        icon: "mail",
        paragraphs: [
          "If you have questions about this Privacy Policy or our data practices, please contact:",
        ],
        contact: {
          officer: "Kharis Church Data Protection Officer",
          email: "dataprotection@kharis.org",
        },
      },
    ],
  },
  fr: {
    title: "Politique de Confidentialité",
    subtitle: "Quiz de Découverte des Départements de l'Église Kharis",
    lastUpdated: "Dernière mise à jour: 19 septembre 2025",
    backButton: "Retour au Quiz",
    sections: [
      {
        heading: "1. Introduction",
        icon: "info",
        paragraphs: [
          "Kharis Church (« nous », « notre » ou « nos ») s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre Quiz de Découverte des Départements.",
          "En utilisant le Quiz, vous consentez aux pratiques de données décrites dans cette politique. Si vous n'êtes pas d'accord, veuillez ne pas utiliser le Quiz.",
        ],
      },
      {
        heading: "2. Informations que nous collectons",
        icon: "database",
        subsections: [
          {
            title: "Informations personnelles :",
            items: [
              "Date, Horodatage, Départements choisis, Langue, Emplacement de la branche sélectionnée de Kharis Church",
            ],
          },
          {
            title: "Réponses au quiz :",
            items: [
              "Réponses aux questions des départements choisis, Résultats de compatibilité des départements",
            ],
          },
          {
            title: "Informations techniques :",
            items: [
              "Adresse IP et type de navigateur, Informations sur l'appareil, Données d'utilisation et modèles d'interaction avec le quiz",
            ],
          },
        ],
      },
      {
        heading: "3. Comment nous utilisons vos informations",
        icon: "settings",
        items: [
          "Pour générer vos résultats personnalisés de compatibilité avec les départements",
          "Pour vous mettre en relation avec des opportunités de ministère dans votre branche sélectionnée",
          "Pour améliorer notre quiz et les services de l'église",
          "À des fins analytiques internes pour comprendre les dons de la congrégation",
          "Pour communiquer avec vous concernant les activités de l'église (avec votre consentement)",
        ],
      },
      {
        heading: "4. Stockage et sécurité des données",
        icon: "lock",
        paragraphs: [
          "Vos données sont stockées en toute sécurité dans Google Sheets avec des contrôles d'accès appropriés. Nous mettons en œuvre des mesures pour protéger vos informations personnelles contre tout accès, modification ou destruction non autorisé.",
          "Les données sont conservées à des fins ministérielles sauf si vous demandez leur suppression. Les réponses au quiz sont anonymisées à des fins analytiques après 24 mois.",
        ],
      },
      {
        heading: "5. Vos droits",
        icon: "shield",
        items: [
          "Droit d'accéder et de recevoir une copie de vos données personnelles",
          "Droit de rectifier des données inexactes ou incomplètes",
          "Droit à l'effacement de vos données personnelles",
          "Droit de restreindre ou de vous opposer au traitement",
          "Droit de retirer votre consentement à tout moment",
        ],
      },
      {
        heading: "6. Contactez-nous",
        icon: "mail",
        paragraphs: [
          "Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez contacter :",
        ],
        contact: {
          officer: "Délégué à la protection des données de Kharis Church",
          email: "dataprotection@kharis.org",
        },
      },
    ],
  },
  es: {
    title: "Política de Privacidad",
    subtitle: "Quiz de Descubrimiento de Departamentos de la Iglesia Kharis",
    lastUpdated: "Última actualización: 19 de septiembre de 2025",
    backButton: "Volver al Quiz",
    sections: [
      {
        heading: "1. Introducción",
        icon: "info",
        paragraphs: [
          'Kharis Church ("nosotros", "nuestro" o "nos") se compromete a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos su información cuando utiliza nuestro Quiz de Descubrimiento de Departamentos.',
          "Al utilizar el Quiz, usted acepta las prácticas de datos descritas en esta política. Si no está de acuerdo, por favor no utilice el Quiz.",
        ],
      },
      {
        heading: "2. Información que recopilamos",
        icon: "database",
        subsections: [
          {
            title: "Información personal:",
            items: [
              "Fecha, Sello de tiempo, Departamentos elegidos, Idioma, Ubicación de la sucursal de la Iglesia Kharis seleccionada",
            ],
          },
          {
            title: "Respuestas del Quiz:",
            items: [
              "Respuestas a las preguntas de los departamentos elegidos, Resultados de compatibilidad de departamentos",
            ],
          },
          {
            title: "Información técnica:",
            items: [
              "Dirección IP y tipo de navegador, Información del dispositivo, Datos de uso y patrones de interacción con el quiz",
            ],
          },
        ],
      },
      {
        heading: "3. Cómo utilizamos su información",
        icon: "settings",
        items: [
          "Generar sus resultados personalizados de compatibilidad con departamentos",
          "Conectarlo con oportunidades de ministerio en su sucursal seleccionada",
          "Mejorar nuestro quiz y los servicios de la iglesia",
          "Para fines analíticos internos para entender los dones de la congregación",
          "Comunicarnos con usted sobre actividades de la iglesia (con su consentimiento)",
        ],
      },
      {
        heading: "4. Almacenamiento y seguridad de datos",
        icon: "lock",
        paragraphs: [
          "Sus datos se almacenan de forma segura en Google Sheets con controles de acceso apropiados. Implementamos medidas para proteger su información personal contra acceso, alteración o destrucción no autorizados.",
          "Los datos se conservan con fines ministeriales a menos que solicite su eliminación. Las respuestas del quiz se anonimizan con fines analíticos después de 24 meses.",
        ],
      },
      {
        heading: "5. Sus derechos",
        icon: "shield",
        items: [
          "Derecho a acceder y recibir una copia de sus datos personales",
          "Derecho a rectificar datos inexactos o incompletos",
          "Derecho a la eliminación de sus datos personales",
          "Derecho a restringir u oponerse al procesamiento",
          "Derecho a retirar su consentimiento en cualquier momento",
        ],
      },
      {
        heading: "6. Contáctenos",
        icon: "mail",
        paragraphs: [
          "Si tiene preguntas sobre esta Política de Privacidad o nuestras prácticas de datos, por favor contacte a:",
        ],
        contact: {
          officer: "Oficial de Protección de Datos de Kharis Church",
          email: "dataprotection@kharis.org",
        },
      },
    ],
  },
  kri: {
    title: "Politik fɔ Priivasì",
    subtitle: "Kharis Choch Dipatment Diskova Kwiz",
    lastUpdated: "Las Apdet: Septemba 19, 2025",
    backButton: "Go Bak to Kwiz",
    sections: [
      {
        heading: "1. Introdokshon",
        icon: "info",
        paragraphs: [
          'Kharis Choch ("wi", "awa", "wi wan") de komit fɔ protɛkt yu priivasì. Dis Priivasì Politik eksplen aw wi de kolekt, yuz, an protɛkt yu infɔmeshɔn wen yu yuz awa Dipatment Diskova Kwiz.',
          "Bai yuzin di Kwiz, yu de gri fɔ di data praktis we de diskraib fɔ dis politik. If yu nɔ gri, plɛs nɔ yuz di Kwiz.",
        ],
      },
      {
        heading: "2. Infɔmeshɔn Wi de Kolekt",
        icon: "database",
        subsections: [
          {
            title: "Pasonal Infɔmeshɔn:",
            items: [
              "Det, Temstamp, Dipatment we yu chuz, Langwej, Kharis Choch branch we yu selekt",
            ],
          },
          {
            title: "Kwiz Ansas:",
            items: ["Ansas to kweshɔns fɔ dipatment we yu chuz, Dipatment kompatibiliti rizɔlt"],
          },
          {
            title: "Teknikal Infɔmeshɔn:",
            items: [
              "IP adres an browser taip, Divais infɔmeshɔn, Yuz data an kwiz intarakshon patan",
            ],
          },
        ],
      },
      {
        heading: "3. Aw Wi de Yuz Yu Infɔmeshɔn",
        icon: "settings",
        items: [
          "Fɔ mek yu pasonal dipatment kompatibiliti rizɔlt",
          "Fɔ konekt yu wit minestri opɔchuniti fɔ yu branch we yu selekt",
          "Fɔ impruv awa kwiz an choch sɔvis",
          "Fɔ intanal analitik pɔpɔs fɔ andastan kongrigeshon gift",
          "Fɔ tɔk to yu baut choch aktivitis (wit yu kɔnsɛnt)",
        ],
      },
      {
        heading: "4. Data Stɔrij an Sɛkuriti",
        icon: "lock",
        paragraphs: [
          "Yu data de stɔr sɛkurlì fɔ Google Sheets wit apropriet akses kontrɔl. Wi de put mɛja fɔ protɛkt yu pasonal infɔmeshɔn from pípul we nɔ gɛt pɔmishɔn fɔ akses, chenj, o distrɔy am.",
          "Wi de kip data fɔ minestri pɔpɔs if yu nɔ aks fɔ dilit. Kwiz ansas de mek anonimas fɔ analitik pɔpɔs afta 24 mont.",
        ],
      },
      {
        heading: "5. Yu Rat",
        icon: "shield",
        items: [
          "Rat fɔ akses an gɛt kopi fɔ yu pasonal data",
          "Rat fɔ kɔrɛkt infɔmeshɔn we nɔ kɔrɛkt o we nɔ komplit",
          "Rat fɔ dilit yu pasonal data",
          "Rat fɔ ristrik o objɛk to prosesin",
          "Rat fɔ widdro yu kɔnsɛnt enitaim",
        ],
      },
      {
        heading: "6. Kontak Wi",
        icon: "mail",
        paragraphs: [
          "If yu gɛt kweshɔn baut dis Priivasì Politik o awa data praktis, plɛs kontak:",
        ],
        contact: {
          officer: "Kharis Choch Data Prɔtɛkshɔn Ofisa",
          email: "dataprotection@kharis.org",
        },
      },
    ],
  },
  de: {
    title: "Datenschutzrichtlinie",
    subtitle: "Kharis Church Abteilung-Entdeckungs-Quiz",
    lastUpdated: "Zuletzt aktualisiert: 19. September 2025",
    backButton: "Zurück zum Quiz",
    sections: [
      {
        heading: "1. Einführung",
        icon: "info",
        paragraphs: [
          'Kharis Church ("wir", "uns" oder "unser") ist bestrebt, Ihre Privatsphäre zu schützen. Diese Datenschutzrichtlinie erklärt, wie wir Ihre Informationen sammeln, verwenden und schützen, wenn Sie unser Abteilung-Entdeckungs-Quiz verwenden.',
          "Durch die Nutzung des Quiz stimmen Sie den in dieser Richtlinie beschriebenen Datenpraktiken zu. Wenn Sie nicht einverstanden sind, verwenden Sie bitte das Quiz nicht.",
        ],
      },
      {
        heading: "2. Informationen, die wir sammeln",
        icon: "database",
        subsections: [
          {
            title: "Persönliche Informationen:",
            items: [
              "Datum, Zeitstempel, Ausgewählte Abteilungen, Sprache, Ausgewählter Kharis Church Standort",
            ],
          },
          {
            title: "Quiz-Antworten:",
            items: [
              "Antworten auf Fragen der gewählten Abteilungen, Abteilungskompatibilitätsergebnisse",
            ],
          },
          {
            title: "Technische Informationen:",
            items: [
              "IP-Adresse und Browsertyp, Geräteinformationen, Nutzungsdaten und Quiz-Interaktionsmuster",
            ],
          },
        ],
      },
      {
        heading: "3. Wie wir Ihre Informationen verwenden",
        icon: "settings",
        items: [
          "Um Ihre personalisierten Abteilungskompatibilitätsergebnisse zu generieren",
          "Um Sie mit Ministeriumsmöglichkeiten an Ihrem ausgewählten Standort zu verbinden",
          "Um unser Quiz und die kirchlichen Dienste zu verbessern",
          "Für interne analytische Zwecke, um die Gaben der Gemeinde zu verstehen",
          "Um mit Ihnen über Kirchenaktivitäten zu kommunizieren (mit Ihrer Zustimmung)",
        ],
      },
      {
        heading: "4. Datenspeicherung und Sicherheit",
        icon: "lock",
        paragraphs: [
          "Ihre Daten werden sicher in Google Sheets mit entsprechenden Zugriffskontrollen gespeichert. Wir implementieren Maßnahmen zum Schutz Ihrer persönlichen Informationen vor unbefugtem Zugriff, Veränderung oder Zerstörung.",
          "Daten werden für ministerielle Zwecke aufbewahrt, es sei denn, Sie fordern deren Löschung. Quiz-Antworten werden nach 24 Monaten für analytische Zwecke anonymisiert.",
        ],
      },
      {
        heading: "5. Ihre Rechte",
        icon: "shield",
        items: [
          "Recht auf Zugang zu und Erhalt einer Kopie Ihrer persönlichen Daten",
          "Recht auf Berichtigung ungenauer oder unvollständiger Daten",
          "Recht auf Löschung Ihrer persönlichen Daten",
          "Recht auf Einschränkung oder Widerspruch gegen die Verarbeitung",
          "Recht, Ihre Einwilligung jederzeit zu widerrufen",
        ],
      },
      {
        heading: "6. Kontaktieren Sie uns",
        icon: "mail",
        paragraphs: [
          "Wenn Sie Fragen zu dieser Datenschutzrichtlinie oder unseren Datenpraktiken haben, wenden Sie sich bitte an:",
        ],
        contact: {
          officer: "Kharis Church Datenschutzbeauftragter",
          email: "dataprotection@kharis.org",
        },
      },
    ],
  },
};
