let currentSlide = 1;
let totalSlides = 1;  // Initial number of slides


const randomWords = [
    "Abrasive", "Absurd", "Accessible", "Adaptable", "Addictive", "Adventurous", "Affectionate", "Agile", 
    "Agitated", "Aloof", "Amiable", "Amorous", "Animated", "Anxious", "Apathetic", "Apprehensive",
    "Arbitrary", "Arrogant", "Artful", "Articulate", "Assertive", "Astute", "Attentive", "Audacious",
    "Avant-garde", "Balanced", "Barbaric", "Bashful", "Belligerent", "Benevolent", "Bitter", "Blissful",
    "Boisterous", "Bombastic", "Boring", "Brazen", "Breezy", "Brilliant", "Brisk", "Brutal",
    "Calm", "Capricious", "Careful", "Careless", "Cautious", "Charming", "Cheerful", "Chic",
    "Clever", "Clumsy", "Coarse", "Cold", "Compassionate", "Complex", "Compulsive", "Conceited",
    "Confident", "Confused", "Conscientious", "Conservative", "Contemplative", "Content", "Contrived", "Controversial",
    "Conventional", "Cooperative", "Cordial", "Courageous", "Cowardly", "Crass", "Creative", "Critical",
    "Crude", "Cruel", "Cultured", "Curious", "Cynical", "Daring", "Debonair", "Decisive",
    "Defensive", "Delicate", "Delightful", "Demanding", "Depressed", "Desperate", "Determined", "Devious",
    "Devoted", "Dignified", "Diplomatic", "Discreet", "Dishonest", "Disloyal", "Dismal", "Distracted",
    "Distraught", "Docile", "Dogmatic", "Doleful", "Domineering", "Dramatic", "Dreamy", "Dreary",
    "Dubious", "Dull", "Dynamic", "Earnest", "Eccentric", "Eclectic", "Edgy", "Educated",
    "Effervescent", "Egocentric", "Elaborate", "Elegant", "Eloquent", "Elusive", "Energetic", "Enigmatic",
    "Enthusiastic", "Epicurean", "Evasive", "Even-tempered", "Exacting", "Excellent", "Excitable", "Exotic",
    "Explosive", "Extravagant", "Extreme", "Exuberant", "Fanatical", "Fanciful", "Fatalistic", "Fearful",
    "Fearless", "Feisty", "Fickle", "Fiery", "Flamboyant", "Flat", "Flexible", "Focused",
    "Foolish", "Forgiving", "Fragile", "Frank", "Frantic", "Fretful", "Frugal", "Frustrated",
    "Fun-loving", "Garrulous", "Genial", "Gentle", "Giddy", "Glamorous", "Gleeful", "Gloomy",
    "Graceful", "Gracious", "Grandiose", "Grateful", "Greedy", "Gregarious", "Grim", "Grouchy",
    "Guarded", "Guileless", "Gullible", "Haphazard", "Happy", "Harsh", "Hasty", "Haughty",
    "Hedonistic", "Hesitant", "Hopeful", "Hostile", "Humble", "Humorous", "Hyperactive", "Hysterical",
    "Idealistic", "Idiosyncratic", "Imaginative", "Immaculate", "Immature", "Immodest", "Impartial", "Impassive",
    "Impatient", "Impersonal", "Impetuous", "Impish", "Impolite", "Important", "Impressionable", "Impressive",
    "Imprudent", "Impulsive", "Inconsiderate", "Inconsistent", "Indifferent", "Indiscreet", "Individualistic", "Indulgent",
    "Inert", "Inflexible", "Informed", "Ingenious", "Inhibited", "Innocent", "Inquisitive", "Insensitive",
    "Insecure", "Insightful", "Insipid", "Insistent", "Inspiring", "Intellectual", "Intelligent", "Intense",
    "Intolerant", "Inventive", "Irascible", "Irrational", "Irresponsible", "Irritable", "Jealous", "Jolly",
    "Joyful", "Judgmental", "Keen", "Kooky", "Laid-back", "Lazy", "Lethargic", "Level-headed",
    "Lively", "Lonely", "Lovable", "Loving", "Loyal", "Lucky", "Macho", "Malicious",
    "Masculine", "Materialistic", "Mature", "Mean", "Meditative", "Melancholy", "Mellow", "Meticulous",
    "Miserable", "Modest", "Moody", "Morose", "Motivated", "Mournful", "Naive", "Nasty",
    "Natural", "Nervous", "Noble", "Nonchalant", "Nurturing", "Obnoxious", "Obsessive", "Obstinate",
    "Optimistic", "Ornery", "Outgoing", "Outrageous", "Overbearing", "Paranoid", "Passionate", "Passive",
    "Pensive", "Pessimistic", "Petty", "Philosophical", "Playful", "Pleasant", "Pompous", "Popular",
    "Positive", "Powerful", "Practical", "Precise", "Predictable", "Prejudiced", "Pretentious", "Preventive",
    "Prickly", "Private", "Productive", "Progressive", "Proud", "Provocative", "Prudent", "Punctual",
    "Quaint", "Quarrelsome", "Questioning", "Quick", "Quiet", "Quirky", "Rational", "Realistic",
    "Rebellious", "Reclusive", "Reflective", "Relaxed", "Reliable", "Relieved", "Religious", "Reserved",
    "Resilient", "Resourceful", "Respectful", "Responsible", "Restless", "Rigid", "Rough", "Rude",
    "Ruthless", "Sad", "Sarcastic", "Sardonic", "Scornful", "Secretive", "Selfish", "Sensible",
    "Sensitive", "Sentimental", "Serene", "Serious", "Shallow", "Sharp", "Shrewd", "Shy",
    "Sincere", "Skeptical", "Sloppy", "Slow", "Smart", "Sociable", "Soft", "Solitary",
    "Sophisticated", "Sour", "Spirited", "Spontaneous", "Stern", "Stingy", "Stoic", "Strict",
    "Stubborn", "Studious", "Stupid", "Suave", "Submissive", "Subtle", "Sulky", "Sullen",
    "Superficial", "Superstitious", "Surly", "Suspicious", "Sweet", "Sympathetic", "Tactful", "Tactless",
    "Talented", "Temperamental", "Tense", "Tentative", "Thoughtful", "Thrifty", "Timid", "Tolerant",
    "Tormented", "Touchy", "Tranquil", "Treacherous", "Trendy", "Troubled", "Trustful", "Trusting",
    "Unassuming", "Unconventional", "Undependable", "Unfriendly", "Unhappy", "Uninhibited", "Unpredictable", "Unreliable",
    "Uptight", "Vain", "Vengeful", "Versatile", "Vigilant", "Vigorous", "Volatile", "Vulnerable",
    "Warm", "Wary", "Weak", "Well-meaning", "Whimsical", "Witty", "Wonderful", "Worldly",
    "Worried", "Worse", "Worst", "Worthless", "Worthy", "Youthful", "Zealous", "Zany"
  ];

// Function to get a random word from the list
function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * randomWords.length);
  return randomWords[randomIndex];
}


async function setRandomBackground(slideId, slideContentDiv) {
    const response = await fetch('https://api.unsplash.com/photos/random?client_id=TZ8kR1Y2s7bVK0Zrl5HNcENDxEBYtY-1TA7oe_ki0Q0');
    const data = await response.json();
    const imageUrl = data.urls.small;
    
    // Update slide background and text
    document.getElementById(slideId).style.backgroundImage = `url(${imageUrl})`;
    slideContentDiv.innerText = getRandomWord();  // Set text to a random word
  }

// Function to initially populate slides
function populateInitialSlides() {
    const slideContainer = document.getElementById("slide-container");
    for (let i = 1; i <= totalSlides; i++) {
        const slide = document.createElement("div");
        slide.className = "slide";
        slide.id = `slide-${i}`;
        slide.innerHTML = `<div class="slide-content">${getRandomWord()}</div>`;
        slide.setAttribute("contenteditable", "true");
        slideContainer.appendChild(slide);
        for (let i = 1; i <= totalSlides; i++) {
            setRandomBackground(`slide-${i}`);
        }
    }
    showSlide(1);
}

// Function to get default text for a slide
function getSlideText(slideNumber) {
    // const defaultTexts = [
    //     'Welcome to Slide 1! 🎉',
    //     'Hey, Slide 2 here! 🐱‍🏍',
    //     'Last but not least, Slide 3! 🚀'
    // ];
    // return slideNumber <= defaultTexts.length ? defaultTexts[slideNumber - 1] : "Another slide";
    
    //return slideNumber <= defaultTexts.length ? defaultTexts[slideNumber - 1] : "Another slide";
}

function showSlide(slideNumber) {
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.display = 'none';
    });
    document.getElementById(`slide-${slideNumber}`).style.display = 'block';
}

function nextSlide() {
    // if (currentSlide < totalSlides) {
    //     currentSlide++;
    //     showSlide(currentSlide);
    addSlide();
    
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function addSlide() {
  totalSlides++;
  const slideContainer = document.getElementById("slide-container");
  const newSlide = document.createElement("div");
  const newSlideContent = document.createElement("div");

  newSlide.className = "slide";
  newSlide.id = `slide-${totalSlides}`;
  newSlideContent.className = "slide-content";
  
  newSlide.appendChild(newSlideContent);
  newSlide.setAttribute("contenteditable", "true");
  slideContainer.appendChild(newSlide);
  
  setRandomBackground(`slide-${totalSlides}`, newSlideContent);
  currentSlide = totalSlides;
  showSlide(currentSlide);
}

// Populate initial slides and show the first one
populateInitialSlides();
