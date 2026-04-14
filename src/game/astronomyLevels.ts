import type { Level } from "./types";

export const ASTRONOMY_CATEGORY_LABELS: Record<string, string> = {
  all: "All Categories",
  "solar-system": "Solar System",
  "stars-galaxies": "Stars & Galaxies",
  "space-exploration": "Space Exploration",
  "nasa-ksc": "NASA & Kennedy Space Center",
  "earth-space": "Earth & Space",
  "fun-fact": "Fun Facts",
  "astronomy-vocab": "Astronomy Vocabulary"
};

export const ASTRONOMY_LEVELS: Level[] = [
  // ── Solar System ──────────────────────────────────────────────────
  {
    id: "astro-ss-01",
    grade: 0,
    type: "solar-system",
    word: "Jupiter",
    prompt: "Which planet is the largest in our solar system?",
    choices: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    answer: "Jupiter",
    definition: "The largest planet in our solar system, a gas giant.",
    contextSentence: "Jupiter is so large that more than 1,300 Earths could fit inside it.",
    hints: ["It is the fifth planet from the Sun.", "It has a famous giant storm called the Great Red Spot."],
    coach: "Jupiter is the biggest planet — a gas giant so large that 1,300 Earths could fit inside it!"
  },
  {
    id: "astro-ss-02",
    grade: 0,
    type: "solar-system",
    word: "Mercury",
    prompt: "Which planet is closest to the Sun?",
    choices: ["Venus", "Earth", "Mercury", "Mars"],
    answer: "Mercury",
    definition: "The smallest planet and the one closest to the Sun.",
    contextSentence: "Mercury completes one orbit around the Sun in just 88 Earth days.",
    hints: ["It is the smallest planet in our solar system.", "It has almost no atmosphere and is covered in craters."],
    coach: "Mercury is the closest planet to the Sun — its year is only 88 Earth days long!"
  },
  {
    id: "astro-ss-03",
    grade: 0,
    type: "solar-system",
    word: "Saturn",
    prompt: "Which planet is famous for its spectacular ring system?",
    choices: ["Jupiter", "Uranus", "Neptune", "Saturn"],
    answer: "Saturn",
    definition: "The sixth planet from the Sun, known for its beautiful rings made of ice and rock.",
    contextSentence: "Saturn's rings are made of billions of chunks of ice and rock orbiting the planet.",
    hints: ["It is the second largest planet.", "Its rings are visible through a small telescope."],
    coach: "Saturn is famous for its beautiful rings made of ice and rock. Its rings stretch out nearly 300,000 km from the planet!"
  },
  {
    id: "astro-ss-04",
    grade: 0,
    type: "solar-system",
    word: "8",
    prompt: "How many planets are in our solar system?",
    choices: ["7", "8", "9", "10"],
    answer: "8",
    definition: "Our solar system has eight official planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
    contextSentence: "In 2006 Pluto was reclassified as a dwarf planet, leaving 8 planets.",
    hints: ["Pluto was removed from the list in 2006.", "Count from Mercury all the way out to Neptune."],
    coach: "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Pluto is now called a dwarf planet."
  },
  {
    id: "astro-ss-05",
    grade: 0,
    type: "solar-system",
    word: "Venus",
    prompt: "Which is the hottest planet in our solar system, even though it is not the closest to the Sun?",
    choices: ["Mercury", "Venus", "Mars", "Jupiter"],
    answer: "Venus",
    definition: "The second planet from the Sun and the hottest planet, thanks to its thick greenhouse atmosphere.",
    contextSentence: "Venus's surface temperature is around 465°C — hot enough to melt lead.",
    hints: ["It is the second planet from the Sun.", "Its thick atmosphere traps heat like a greenhouse."],
    coach: "Venus is the hottest planet at about 465°C. Its thick atmosphere traps heat — even hotter than Mercury which is closer to the Sun!"
  },
  {
    id: "astro-ss-06",
    grade: 0,
    type: "solar-system",
    word: "Asteroid Belt",
    prompt: "What lies between Mars and Jupiter?",
    choices: ["The Kuiper Belt", "The Asteroid Belt", "The Oort Cloud", "The Habitable Zone"],
    answer: "The Asteroid Belt",
    definition: "A region between Mars and Jupiter containing millions of rocky objects called asteroids.",
    contextSentence: "The Asteroid Belt is home to millions of space rocks of all sizes.",
    hints: ["It is a region full of rocky objects orbiting the Sun.", "The dwarf planet Ceres is found here."],
    coach: "The Asteroid Belt sits between Mars and Jupiter and contains millions of rocky objects called asteroids."
  },
  {
    id: "astro-ss-07",
    grade: 0,
    type: "solar-system",
    word: "365.25 days",
    prompt: "How long does Earth take to complete one full orbit around the Sun?",
    choices: ["24 hours", "30 days", "365.25 days", "100 days"],
    answer: "365.25 days",
    definition: "Earth takes about 365.25 days (one year) to travel all the way around the Sun.",
    contextSentence: "The extra 0.25 day per year is why we add a leap day every four years.",
    hints: ["It is the length of one calendar year.", "The extra quarter day explains why we have leap years."],
    coach: "Earth takes 365.25 days to orbit the Sun. Every four years we add a 'leap day' (Feb 29) to keep our calendar aligned!"
  },
  {
    id: "astro-ss-08",
    grade: 0,
    type: "solar-system",
    word: "dwarf planet",
    prompt: "What is Pluto classified as?",
    choices: ["A major planet", "A moon", "A dwarf planet", "An asteroid"],
    answer: "A dwarf planet",
    definition: "A dwarf planet orbits the Sun, is round, but has not cleared its orbit of other objects.",
    contextSentence: "Pluto was reclassified as a dwarf planet in 2006 by the International Astronomical Union.",
    hints: ["It lives in the Kuiper Belt beyond Neptune.", "It was removed from the list of major planets in 2006."],
    coach: "Pluto is a dwarf planet. It orbits the Sun but shares its neighbourhood with many other icy objects in the Kuiper Belt."
  },
  {
    id: "astro-ss-09",
    grade: 0,
    type: "solar-system",
    word: "Uranus",
    prompt: "Which planet rotates on its side, with its axis tilted nearly 98°?",
    choices: ["Saturn", "Neptune", "Uranus", "Jupiter"],
    answer: "Uranus",
    definition: "Uranus is unique because its axis is tilted so far it essentially rolls around the Sun on its side.",
    contextSentence: "A single season on Uranus can last over 20 years due to its extreme tilt.",
    hints: ["It is an ice giant, the seventh planet from the Sun.", "Each pole faces the Sun for about 42 years at a time."],
    coach: "Uranus is tilted at 98° — it rolls around the Sun on its side! Each pole gets 42 years of sunlight then 42 years of darkness."
  },
  {
    id: "astro-ss-10",
    grade: 0,
    type: "solar-system",
    word: "Moon",
    prompt: "What is the name of Earth's only natural satellite?",
    choices: ["Titan", "Europa", "Phobos", "Moon"],
    answer: "Moon",
    definition: "The Moon is Earth's natural satellite, about 384,400 km away.",
    contextSentence: "The Moon's gravity pulls on Earth's oceans, creating the tides.",
    hints: ["It lights up the night sky and goes through phases.", "Humans first landed on it in 1969."],
    coach: "Earth has one natural satellite: the Moon. Its gravity creates our ocean tides, and humans first walked on it during Apollo 11 in 1969."
  },
  {
    id: "astro-ss-11",
    grade: 0,
    type: "solar-system",
    word: "Ganymede",
    prompt: "What is the largest moon in our solar system?",
    choices: ["Europa", "Titan", "Ganymede", "Io"],
    answer: "Ganymede",
    definition: "Ganymede is Jupiter's largest moon and the largest moon in the solar system — even bigger than the planet Mercury.",
    contextSentence: "Ganymede is so large that it has its own magnetic field.",
    hints: ["It orbits Jupiter.", "It is even larger than the planet Mercury."],
    coach: "Ganymede orbits Jupiter and is the largest moon in the solar system — bigger than Mercury! It even has its own magnetic field."
  },
  {
    id: "astro-ss-12",
    grade: 0,
    type: "solar-system",
    word: "Kuiper Belt",
    prompt: "What is the Kuiper Belt?",
    choices: ["A ring around Saturn", "A region beyond Neptune full of icy objects and dwarf planets", "The asteroid belt between Mars and Jupiter", "A cloud of comets surrounding the whole solar system"],
    answer: "A region beyond Neptune full of icy objects and dwarf planets",
    definition: "The Kuiper Belt is a region of the solar system beyond Neptune containing many icy objects, including Pluto.",
    contextSentence: "Many short-period comets originate in the Kuiper Belt.",
    hints: ["Pluto is found here.", "It begins just beyond the orbit of Neptune."],
    coach: "The Kuiper Belt is a disc of icy objects beyond Neptune. Pluto lives here, along with many other dwarf planets and icy bodies."
  },
  {
    id: "astro-ss-13",
    grade: 0,
    type: "solar-system",
    word: "Phobos and Deimos",
    prompt: "What are the names of Mars's two small moons?",
    choices: ["Titan and Triton", "Phobos and Deimos", "Io and Europa", "Callisto and Ganymede"],
    answer: "Phobos and Deimos",
    definition: "Phobos and Deimos are the two small, potato-shaped moons of Mars.",
    contextSentence: "Phobos orbits so close to Mars that it circles the planet three times a day.",
    hints: ["Their names mean 'Fear' and 'Dread' in Greek.", "They are very small and potato-shaped."],
    coach: "Mars has two tiny moons: Phobos ('Fear') and Deimos ('Dread'). Phobos orbits Mars so fast it rises in the west and sets in the east!"
  },
  {
    id: "astro-ss-14",
    grade: 0,
    type: "solar-system",
    word: "Neptune",
    prompt: "Which planet is farthest from the Sun in our solar system?",
    choices: ["Uranus", "Saturn", "Neptune", "Pluto"],
    answer: "Neptune",
    definition: "Neptune is the eighth and farthest planet from the Sun, an ice giant with the strongest winds in the solar system.",
    contextSentence: "Neptune takes 165 Earth years to complete one orbit around the Sun.",
    hints: ["It is an ice giant, blue in colour.", "One year on this planet equals 165 Earth years."],
    coach: "Neptune is the farthest planet from the Sun. It has the strongest winds in the solar system — up to 2,100 km/h — and one year there takes 165 Earth years!"
  },
  {
    id: "astro-ss-15",
    grade: 0,
    type: "solar-system",
    word: "Mercury → Gemini → Apollo",
    prompt: "In what order do the planets appear from closest to farthest from the Sun?",
    choices: [
      "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune",
      "Mercury, Earth, Venus, Mars, Jupiter, Saturn, Neptune, Uranus",
      "Venus, Mercury, Earth, Mars, Saturn, Jupiter, Uranus, Neptune",
      "Mercury, Venus, Mars, Earth, Jupiter, Saturn, Uranus, Neptune"
    ],
    answer: "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune",
    definition: "The eight planets in order from closest to farthest from the Sun.",
    contextSentence: "A helpful way to remember: My Very Educated Mother Just Served Us Nachos.",
    hints: ["The mnemonic 'My Very Educated Mother Just Served Us Nachos' can help.", "Earth is the third planet."],
    coach: "In order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Remember with: My Very Educated Mother Just Served Us Nachos!"
  },

  // ── Stars & Galaxies ──────────────────────────────────────────────
  {
    id: "astro-sg-01",
    grade: 0,
    type: "stars-galaxies",
    word: "yellow dwarf",
    prompt: "What type of star is our Sun?",
    choices: ["Red giant", "White dwarf", "Yellow dwarf", "Blue supergiant"],
    answer: "Yellow dwarf",
    definition: "A yellow dwarf (G-type star) is a medium-sized star with a surface temperature around 5,500°C.",
    contextSentence: "Our Sun is a yellow dwarf star about halfway through its 10-billion-year life.",
    hints: ["It is a medium-sized, middle-aged star.", "It is also called a G-type main-sequence star."],
    coach: "The Sun is a yellow dwarf star. It is about halfway through its 10-billion-year life. When it runs out of fuel, it will swell into a red giant."
  },
  {
    id: "astro-sg-02",
    grade: 0,
    type: "stars-galaxies",
    word: "Proxima Centauri",
    prompt: "What is the closest star to our solar system (other than the Sun)?",
    choices: ["Sirius", "Betelgeuse", "Proxima Centauri", "Vega"],
    answer: "Proxima Centauri",
    definition: "Proxima Centauri is a red dwarf star about 4.24 light-years from Earth.",
    contextSentence: "Even at the speed of light it would take over 4 years to reach Proxima Centauri.",
    hints: ["It is part of the Alpha Centauri star system.", "It is a small, dim red dwarf star."],
    coach: "Proxima Centauri is our nearest stellar neighbour at 4.24 light-years. At the speed of light it would take 4 years to get there — and our fastest rockets would take tens of thousands of years!"
  },
  {
    id: "astro-sg-03",
    grade: 0,
    type: "stars-galaxies",
    word: "supernova",
    prompt: "What is the huge explosion called when a massive star runs out of fuel?",
    choices: ["A solar flare", "A supernova", "A comet impact", "A pulsar burst"],
    answer: "A supernova",
    definition: "A supernova is an enormous explosion that occurs when a massive star collapses at the end of its life.",
    contextSentence: "A supernova can briefly outshine an entire galaxy of billions of stars.",
    hints: ["It is one of the most powerful explosions in the universe.", "It can leave behind a neutron star or black hole."],
    coach: "When a massive star runs out of fuel, it explodes as a supernova — one of the brightest events in the universe!"
  },
  {
    id: "astro-sg-04",
    grade: 0,
    type: "stars-galaxies",
    word: "Sirius",
    prompt: "What is the brightest star visible in the night sky as seen from Earth?",
    choices: ["Polaris", "Betelgeuse", "Sirius", "Vega"],
    answer: "Sirius",
    definition: "Sirius, the Dog Star, is the brightest star in the night sky, about 8.6 light-years from Earth.",
    contextSentence: "Ancient Egyptians used Sirius's rising to predict the annual Nile flood.",
    hints: ["It is in the constellation Canis Major (the Big Dog).", "It is also called the Dog Star."],
    coach: "Sirius is the brightest star in the night sky. It is called the Dog Star because it is in the constellation Canis Major (the Big Dog)."
  },
  {
    id: "astro-sg-05",
    grade: 0,
    type: "stars-galaxies",
    word: "Milky Way",
    prompt: "What is the name of the galaxy our solar system lives in?",
    choices: ["Andromeda", "Triangulum", "Sombrero", "The Milky Way"],
    answer: "The Milky Way",
    definition: "The Milky Way is a spiral galaxy containing our solar system, home to over 200 billion stars.",
    contextSentence: "On a clear night far from city lights you can see the Milky Way as a glowing band across the sky.",
    hints: ["It looks like a glowing band of stars on dark nights.", "It is a spiral galaxy with a supermassive black hole at its centre."],
    coach: "We live in the Milky Way — a spiral galaxy with over 200 billion stars. Our Sun is just one of them, about halfway out from the centre."
  },
  {
    id: "astro-sg-06",
    grade: 0,
    type: "stars-galaxies",
    word: "blue",
    prompt: "What colour are the hottest stars?",
    choices: ["Red", "Yellow", "Orange", "Blue"],
    answer: "Blue",
    definition: "Blue stars are the hottest, with surface temperatures above 25,000°C. Red stars are the coolest.",
    contextSentence: "A blue star burns much hotter than our yellow Sun.",
    hints: ["Think of a flame: which part is hottest — red or blue?", "Cooler stars appear red or orange; hotter ones appear white or blue."],
    coach: "In stars, blue = hot and red = cool. Blue stars are the hottest, then white, yellow, orange, and finally red — the coolest."
  },
  {
    id: "astro-sg-07",
    grade: 0,
    type: "stars-galaxies",
    word: "black hole",
    prompt: "What is a black hole?",
    choices: ["A star with no light output", "A gap between galaxies", "A region where gravity is so strong nothing — not even light — can escape", "A dark planet"],
    answer: "A region where gravity is so strong nothing — not even light — can escape",
    definition: "A black hole is a region of space where gravity is so intense that nothing, not even light, can escape.",
    contextSentence: "Black holes often form when a massive star collapses at the end of its life.",
    hints: ["Even light cannot escape from it.", "They often form from collapsed massive stars."],
    coach: "A black hole has gravity so strong that not even light can escape — that's why it looks completely black!"
  },
  {
    id: "astro-sg-08",
    grade: 0,
    type: "stars-galaxies",
    word: "red giant",
    prompt: "What happens to a Sun-like star when it runs out of hydrogen fuel in its core?",
    choices: ["It instantly goes dark", "It explodes as a supernova", "It swells into a red giant", "It becomes a black hole"],
    answer: "It swells into a red giant",
    definition: "A red giant is a large, cool star in a late stage of life — a Sun-like star expands enormously after its core fuel runs out.",
    contextSentence: "In about 5 billion years our Sun will expand into a red giant, engulfing the inner planets.",
    hints: ["It is the next stage for our Sun in about 5 billion years.", "The star swells to many times its original size."],
    coach: "When a Sun-like star uses up its core hydrogen, it puffs up into a red giant. In 5 billion years our Sun will do this, expanding large enough to swallow Earth!"
  },
  {
    id: "astro-sg-09",
    grade: 0,
    type: "stars-galaxies",
    word: "Big Bang",
    prompt: "According to scientists, how did the universe begin?",
    choices: ["A star exploded and created everything", "The universe has always existed", "A Big Bang — an extremely hot, dense explosion about 13.8 billion years ago", "Two galaxies collided to create the universe"],
    answer: "A Big Bang — an extremely hot, dense explosion about 13.8 billion years ago",
    definition: "The Big Bang theory describes how the universe began as an extremely hot, dense point and has been expanding ever since.",
    contextSentence: "All the matter, energy, space, and time in the universe began at the Big Bang 13.8 billion years ago.",
    hints: ["It happened about 13.8 billion years ago.", "The universe has been expanding ever since."],
    coach: "Scientists believe the universe began with the Big Bang about 13.8 billion years ago — from an incredibly hot, tiny point that rapidly expanded into everything we see today."
  },
  {
    id: "astro-sg-10",
    grade: 0,
    type: "stars-galaxies",
    word: "white dwarf",
    prompt: "What is left behind after a Sun-like star becomes a red giant and sheds its outer layers?",
    choices: ["A neutron star", "A black hole", "A white dwarf", "A new blue star"],
    answer: "A white dwarf",
    definition: "A white dwarf is the hot, dense remnant of a Sun-like star's core after it has shed its outer layers.",
    contextSentence: "A white dwarf is about the size of Earth but packs the mass of the Sun.",
    hints: ["It is roughly the size of Earth.", "Our Sun will eventually become one of these."],
    coach: "After a Sun-like star sheds its outer layers as a planetary nebula, the leftover core is a white dwarf — Earth-sized but incredibly dense!"
  },
  {
    id: "astro-sg-11",
    grade: 0,
    type: "stars-galaxies",
    word: "constellation",
    prompt: "What is a constellation?",
    choices: ["A group of galaxies", "A pattern of stars that appears to form a picture or shape in the night sky", "A type of comet", "A cluster of planets"],
    answer: "A pattern of stars that appears to form a picture or shape in the night sky",
    definition: "A constellation is a named pattern of stars as seen from Earth. There are 88 officially recognized constellations.",
    contextSentence: "Orion the Hunter is one of the most easily recognized constellations.",
    hints: ["There are 88 official ones recognised by astronomers.", "Examples include Orion, Ursa Major, and Cassiopeia."],
    coach: "Constellations are patterns of stars in the sky that people have named — like Orion the Hunter or the Big Dipper. There are 88 official constellations."
  },
  {
    id: "astro-sg-12",
    grade: 0,
    type: "stars-galaxies",
    word: "2.5 million light-years",
    prompt: "How far away is the Andromeda Galaxy from Earth?",
    choices: ["4.24 light-years", "100 light-years", "About 2.5 million light-years", "About 1 billion light-years"],
    answer: "About 2.5 million light-years",
    definition: "The Andromeda Galaxy is about 2.5 million light-years from Earth — the farthest object visible to the naked eye.",
    contextSentence: "The Andromeda Galaxy is on a collision course with the Milky Way, expected to merge in about 4.5 billion years.",
    hints: ["It is the nearest large galaxy to our Milky Way.", "It is the farthest thing you can see with just your eyes."],
    coach: "Andromeda is about 2.5 million light-years away — the farthest object you can see without a telescope. It is heading toward the Milky Way and will merge with us in 4.5 billion years!"
  },

  // ── Space Exploration ─────────────────────────────────────────────
  {
    id: "astro-se-01",
    grade: 0,
    type: "space-exploration",
    word: "Sputnik 1",
    prompt: "What was the name of the first artificial satellite ever launched into space?",
    choices: ["Apollo 1", "Sputnik 1", "Explorer 1", "Voyager 1"],
    answer: "Sputnik 1",
    definition: "Sputnik 1 was launched by the Soviet Union on October 4, 1957, becoming the first human-made object to orbit Earth.",
    contextSentence: "Sputnik 1's successful launch started the Space Race between the USA and USSR.",
    hints: ["It was launched by the Soviet Union in 1957.", "Its name means 'fellow traveller' in Russian."],
    coach: "Sputnik 1 was the first artificial satellite, launched by the Soviet Union in 1957. It was a metal ball that just beeped as it orbited Earth — and it started the Space Race!"
  },
  {
    id: "astro-se-02",
    grade: 0,
    type: "space-exploration",
    word: "Space Shuttle",
    prompt: "What was the Space Shuttle?",
    choices: ["A one-time-use rocket", "A reusable spacecraft that carried astronauts and cargo to orbit", "A Mars rover", "A weather satellite"],
    answer: "A reusable spacecraft that carried astronauts and cargo to orbit",
    definition: "The Space Shuttle was NASA's reusable launch system that flew 135 missions from 1981 to 2011.",
    contextSentence: "The Space Shuttle helped build the International Space Station and launched the Hubble Space Telescope.",
    hints: ["It could land like an airplane after returning from space.", "It flew 135 missions between 1981 and 2011."],
    coach: "The Space Shuttle was special because it was reusable — it launched like a rocket, orbited like a spacecraft, and landed like a glider. It flew for 30 years!"
  },
  {
    id: "astro-se-03",
    grade: 0,
    type: "space-exploration",
    word: "ISS",
    prompt: "What is the International Space Station (ISS)?",
    choices: ["A space telescope in deep space", "A permanent orbiting laboratory where astronauts from many countries live and do science", "A rocket launch site", "A Mars colony"],
    answer: "A permanent orbiting laboratory where astronauts from many countries live and do science",
    definition: "The ISS is a habitable space station in low Earth orbit, continuously crewed since November 2000.",
    contextSentence: "The ISS orbits Earth about every 90 minutes at an altitude of roughly 400 km.",
    hints: ["It orbits Earth about every 90 minutes.", "It has been continuously crewed since November 2000."],
    coach: "The ISS is a football-field-sized laboratory orbiting 400 km above Earth. Astronauts from the US, Russia, Europe, Japan, and Canada have all lived and worked there!"
  },
  {
    id: "astro-se-04",
    grade: 0,
    type: "space-exploration",
    word: "SpaceX Falcon 9",
    prompt: "Which rocket company regularly launches astronauts to the ISS and is famous for landing its rocket boosters back on Earth?",
    choices: ["Boeing", "Blue Origin", "SpaceX", "Lockheed Martin"],
    answer: "SpaceX",
    definition: "SpaceX, founded by Elon Musk, developed the reusable Falcon 9 rocket that routinely lands its first stage for reuse.",
    contextSentence: "SpaceX's Falcon 9 was the first orbital rocket to successfully land its booster for reuse.",
    hints: ["It was founded by Elon Musk.", "Its Falcon 9 rocket lands its first stage back on a drone ship or landing pad."],
    coach: "SpaceX revolutionized rocketry by landing and reusing rocket boosters. Their Falcon 9 regularly carries astronauts and cargo to the ISS!"
  },
  {
    id: "astro-se-05",
    grade: 0,
    type: "space-exploration",
    word: "orbit",
    prompt: "How does a rocket reach orbit around Earth?",
    choices: [
      "It flies straight up until gravity stops",
      "It uses wings to glide into orbit",
      "It goes fast enough sideways that as it falls it keeps missing Earth",
      "Earth's magnetic field pulls it into orbit"
    ],
    answer: "It goes fast enough sideways that as it falls it keeps missing Earth",
    definition: "Orbital motion means going sideways fast enough that the curve of Earth's surface drops away as fast as you fall.",
    contextSentence: "The ISS travels at about 7.7 km/s — that's over 27,000 km/h — to stay in orbit.",
    hints: ["Orbital speed is about 27,000 km/h sideways.", "Isaac Newton described this with his 'cannon ball' thought experiment."],
    coach: "Orbit is controlled falling! A rocket goes sideways so fast (27,000 km/h) that as it falls, Earth's surface curves away just as fast — so it keeps going around and around."
  },
  {
    id: "astro-se-06",
    grade: 0,
    type: "space-exploration",
    word: "Voyager 1",
    prompt: "What is Voyager 1 famous for?",
    choices: [
      "It was the first spacecraft to land on Mars",
      "It is the farthest human-made object from Earth, now in interstellar space",
      "It landed astronauts on the Moon",
      "It discovered the rings of Saturn"
    ],
    answer: "It is the farthest human-made object from Earth, now in interstellar space",
    definition: "Voyager 1 was launched in 1977, flew past Jupiter and Saturn, and in 2012 became the first human-made object to enter interstellar space.",
    contextSentence: "Voyager 1 is over 23 billion km from Earth — and still sending data back!",
    hints: ["It was launched in 1977.", "It crossed into interstellar space (beyond our solar system) in 2012."],
    coach: "Voyager 1 was launched in 1977 and has been travelling ever since. In 2012 it entered interstellar space — the space between the stars. It is the most distant human-made object ever!"
  },
  {
    id: "astro-se-07",
    grade: 0,
    type: "space-exploration",
    word: "SLS",
    prompt: "What is the name of NASA's powerful new rocket built for the Artemis Moon program?",
    choices: ["Saturn V", "Falcon 9", "Space Launch System (SLS)", "Atlas V"],
    answer: "Space Launch System (SLS)",
    definition: "The Space Launch System (SLS) is NASA's most powerful rocket, designed to send astronauts to the Moon and eventually Mars.",
    contextSentence: "SLS launched its first test flight in November 2022, sending the Orion capsule around the Moon.",
    hints: ["It stands for Space Launch System.", "Its first launch sent an uncrewed Orion capsule around the Moon in 2022."],
    coach: "The SLS (Space Launch System) is NASA's new mega-rocket for the Artemis program. Its first test flight in 2022 sent the Orion capsule around the Moon — no crew, just a test!"
  },
  {
    id: "astro-se-08",
    grade: 0,
    type: "space-exploration",
    word: "rover",
    prompt: "What is a space rover?",
    choices: [
      "An astronaut who walks in space",
      "A remote-controlled vehicle designed to explore the surface of other planets",
      "A type of satellite in deep space",
      "A rocket booster"
    ],
    answer: "A remote-controlled vehicle designed to explore the surface of other planets",
    definition: "A rover is a space exploration vehicle that moves across the surface of a planet or moon to take photos, collect samples, and conduct experiments.",
    contextSentence: "NASA's Perseverance rover landed on Mars in February 2021 to search for signs of ancient life.",
    hints: ["NASA has sent several of these to Mars.", "They move slowly across rocky surfaces and beam data back to Earth."],
    coach: "Rovers are robotic vehicles we drive on other planets from Earth! Mars rovers like Curiosity and Perseverance move across the Martian surface collecting rock samples and taking pictures."
  },
  {
    id: "astro-se-09",
    grade: 0,
    type: "space-exploration",
    word: "EVA",
    prompt: "What does EVA stand for in spaceflight?",
    choices: ["External Vehicle Approach", "Extravehicular Activity (spacewalk)", "Earth Viewing Apparatus", "Emergency Vehicle Alert"],
    answer: "Extravehicular Activity (spacewalk)",
    definition: "Extravehicular Activity (EVA) is any activity performed by an astronaut outside a spacecraft, commonly called a spacewalk.",
    contextSentence: "Astronauts perform EVAs to repair equipment and install hardware on the outside of the ISS.",
    hints: ["'Extra' means outside; 'vehicular' means the vehicle.", "Most people call it a spacewalk."],
    coach: "EVA stands for Extravehicular Activity — what most people call a spacewalk. Astronauts wear specially pressurized suits to work outside their spacecraft in the vacuum of space."
  },
  {
    id: "astro-se-10",
    grade: 0,
    type: "space-exploration",
    word: "Hubble Space Telescope",
    prompt: "What is the Hubble Space Telescope used for?",
    choices: [
      "Tracking weather on Earth",
      "Communicating with astronauts on the ISS",
      "Observing distant stars, galaxies, and nebulae from orbit",
      "Guiding rockets during launch"
    ],
    answer: "Observing distant stars, galaxies, and nebulae from orbit",
    definition: "The Hubble Space Telescope has been orbiting Earth since 1990, taking stunning images of the universe free from atmospheric distortion.",
    contextSentence: "Hubble's images have revealed details of galaxies billions of light-years away.",
    hints: ["It has been orbiting Earth since 1990.", "It was launched by the Space Shuttle Discovery."],
    coach: "Hubble orbits Earth above the blurry atmosphere, giving us crystal-clear views of galaxies billions of light-years away. Space Shuttle astronauts even flew up to fix it when it had a faulty mirror!"
  },
  {
    id: "astro-se-11",
    grade: 0,
    type: "space-exploration",
    word: "James Webb Space Telescope",
    prompt: "What makes the James Webb Space Telescope (JWST) different from Hubble?",
    choices: [
      "It orbits Earth closer than Hubble",
      "It uses infrared light to see further back in time and peer through dust clouds",
      "It is used to study the Sun",
      "It can land on asteroids"
    ],
    answer: "It uses infrared light to see further back in time and peer through dust clouds",
    definition: "JWST uses infrared (heat) light to observe the earliest galaxies formed after the Big Bang and to study star-forming regions hidden in dust.",
    contextSentence: "JWST launched in December 2021 and orbits 1.5 million km from Earth.",
    hints: ["It launched in December 2021 and orbits 1.5 million km from Earth.", "Infrared light lets it see through gas and dust clouds where stars are born."],
    coach: "The James Webb Telescope uses infrared light — like night-vision goggles — to see through dust clouds and peer back to some of the very first galaxies formed after the Big Bang!"
  },
  {
    id: "astro-se-12",
    grade: 0,
    type: "space-exploration",
    word: "docking",
    prompt: "What does 'docking' mean in space exploration?",
    choices: [
      "Landing on a planet's surface",
      "When a spacecraft connects and joins with another spacecraft or space station in orbit",
      "Returning a capsule to Earth",
      "Firing the rocket to slow down"
    ],
    answer: "When a spacecraft connects and joins with another spacecraft or space station in orbit",
    definition: "Docking is the process by which two spacecraft join together in space, allowing crew and supplies to transfer between them.",
    contextSentence: "SpaceX Crew Dragon docks with the ISS to deliver astronauts and supplies.",
    hints: ["It is needed to deliver astronauts and supplies to the ISS.", "Two spacecraft have to align perfectly to connect."],
    coach: "Docking is when two spacecraft link together in orbit. It requires incredibly precise flying — at 27,000 km/h, you have to connect two vehicles with millimetre accuracy!"
  },
  {
    id: "astro-se-13",
    grade: 0,
    type: "space-exploration",
    word: "Apollo program",
    prompt: "What was the main goal of NASA's Apollo program?",
    choices: [
      "Build the International Space Station",
      "Send humans to Mars",
      "Land humans on the Moon and return them safely to Earth",
      "Launch the first satellites"
    ],
    answer: "Land humans on the Moon and return them safely to Earth",
    definition: "The Apollo program ran from 1961 to 1972, successfully landing astronauts on the Moon six times.",
    contextSentence: "Apollo 11 achieved the first Moon landing on July 20, 1969.",
    hints: ["It achieved its goal in July 1969 with Apollo 11.", "Six missions successfully landed on the Moon between 1969 and 1972."],
    coach: "The Apollo program's goal was to land humans on the Moon and bring them home safely. Apollo 11 did it first on July 20, 1969 — and five more missions landed successfully after that!"
  },
  {
    id: "astro-se-14",
    grade: 0,
    type: "space-exploration",
    word: "Perseverance",
    prompt: "What is the name of NASA's Mars rover that landed in Jezero Crater in February 2021?",
    choices: ["Curiosity", "Spirit", "Perseverance", "Opportunity"],
    answer: "Perseverance",
    definition: "Perseverance is NASA's most advanced Mars rover, searching for signs of ancient microbial life and collecting rock samples for future return to Earth.",
    contextSentence: "Perseverance also carried the Ingenuity helicopter — the first powered aircraft to fly on another planet.",
    hints: ["It landed in Jezero Crater in February 2021.", "It brought along a small helicopter called Ingenuity."],
    coach: "Perseverance landed on Mars in 2021 to look for signs of ancient life. It also carried Ingenuity — a tiny helicopter that became the first powered aircraft to fly on another planet!"
  },
  {
    id: "astro-se-15",
    grade: 0,
    type: "space-exploration",
    word: "re-entry",
    prompt: "What happens during re-entry when a spacecraft returns to Earth?",
    choices: [
      "The spacecraft floats gently through the atmosphere",
      "The spacecraft hits the atmosphere at high speed, creating intense heat from friction",
      "The spacecraft uses rockets to slow down in space",
      "The spacecraft glides through the atmosphere without any heating"
    ],
    answer: "The spacecraft hits the atmosphere at high speed, creating intense heat from friction",
    definition: "Re-entry is when a spacecraft returns through Earth's atmosphere. Friction with air molecules creates temperatures of up to 1,650°C, requiring heat shields.",
    contextSentence: "Heat shields protect astronauts during re-entry, when the capsule can glow like a shooting star.",
    hints: ["The capsule can glow red-hot from friction with the atmosphere.", "Heat shields are required to protect the crew."],
    coach: "During re-entry, a spacecraft is going so fast that friction with the atmosphere heats it to 1,650°C — as hot as a volcano! Heat shields protect the astronauts inside."
  },

  // ── NASA & Kennedy Space Center ───────────────────────────────────
  {
    id: "astro-ksc-01",
    grade: 0,
    type: "nasa-ksc",
    word: "NASA",
    prompt: "What does NASA stand for?",
    choices: [
      "National Astronomy and Space Administration",
      "National Aeronautics and Space Administration",
      "North American Space Agency",
      "New Aerospace and Science Authority"
    ],
    answer: "National Aeronautics and Space Administration",
    definition: "NASA is the U.S. government agency responsible for the nation's civilian space program and aerospace research.",
    contextSentence: "NASA was established in 1958, the year after Sputnik was launched.",
    hints: ["It is the US government's civilian space agency.", "It was founded in 1958, the year after the Soviet Union launched Sputnik."],
    coach: "NASA stands for National Aeronautics and Space Administration. It was created in 1958 in response to the Soviet Union launching Sputnik — and it has been exploring space ever since!"
  },
  {
    id: "astro-ksc-02",
    grade: 0,
    type: "nasa-ksc",
    word: "Florida",
    prompt: "Where is the Kennedy Space Center located?",
    choices: ["Texas", "California", "Florida, on Merritt Island near Cape Canaveral", "Alabama"],
    answer: "Florida, on Merritt Island near Cape Canaveral",
    definition: "Kennedy Space Center (KSC) is NASA's primary launch site, located on Merritt Island, Florida, adjacent to Cape Canaveral.",
    contextSentence: "KSC has been the launch site for every US human spaceflight mission since the Gemini program.",
    hints: ["It is near Cape Canaveral on the Atlantic coast.", "Florida's location close to the equator is ideal for rocket launches."],
    coach: "Kennedy Space Center is on Merritt Island, Florida — right next to Cape Canaveral. Florida's location near the equator gives rockets a speed boost from Earth's rotation, saving fuel!"
  },
  {
    id: "astro-ksc-03",
    grade: 0,
    type: "nasa-ksc",
    word: "Alan Shepard",
    prompt: "Who was the first American to travel to space?",
    choices: ["John Glenn", "Neil Armstrong", "Alan Shepard", "Buzz Aldrin"],
    answer: "Alan Shepard",
    definition: "Alan Shepard became the first American in space on May 5, 1961, flying a 15-minute suborbital mission on Freedom 7.",
    contextSentence: "Alan Shepard later walked on the Moon during Apollo 14 and even hit a golf ball on the lunar surface.",
    hints: ["He flew on the Freedom 7 capsule in May 1961.", "He later walked on the Moon during Apollo 14."],
    coach: "Alan Shepard was the first American in space (May 1961) — just a 15-minute ride. He later walked on the Moon with Apollo 14 and famously hit a golf ball on the lunar surface!"
  },
  {
    id: "astro-ksc-04",
    grade: 0,
    type: "nasa-ksc",
    word: "Neil Armstrong",
    prompt: "Who was the first person to walk on the Moon?",
    choices: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "John Glenn"],
    answer: "Neil Armstrong",
    definition: "Neil Armstrong became the first human to walk on the Moon on July 20, 1969, during the Apollo 11 mission.",
    contextSentence: "As he stepped onto the lunar surface, Armstrong said: 'That's one small step for man, one giant leap for mankind.'",
    hints: ["He said 'One small step for man, one giant leap for mankind.'", "He flew on the Apollo 11 mission."],
    coach: "Neil Armstrong was the first person to walk on the Moon, on July 20, 1969. He said: 'That's one small step for man, one giant leap for mankind.' Buzz Aldrin followed him 20 minutes later."
  },
  {
    id: "astro-ksc-05",
    grade: 0,
    type: "nasa-ksc",
    word: "1969",
    prompt: "In what year did Apollo 11 first land humans on the Moon?",
    choices: ["1965", "1967", "1969", "1972"],
    answer: "1969",
    definition: "Apollo 11 landed on the Moon on July 20, 1969, fulfilling President Kennedy's goal of landing humans on the Moon before the end of the 1960s.",
    contextSentence: "More than 600 million people watched the Moon landing live on television — the largest TV audience at the time.",
    hints: ["President Kennedy set the goal of reaching the Moon 'before this decade is out'.", "The mission launched on July 16 and landed on July 20."],
    coach: "July 20, 1969 — one of the most historic days ever! Apollo 11 landed on the Moon, watched by over 600 million people on TV. It happened just 8 years after the US sent its first astronaut to space."
  },
  {
    id: "astro-ksc-06",
    grade: 0,
    type: "nasa-ksc",
    word: "Eagle",
    prompt: "What was the name of the Apollo 11 lunar module that landed on the Moon?",
    choices: ["Columbia", "Challenger", "Eagle", "Discovery"],
    answer: "Eagle",
    definition: "The Eagle was the Apollo 11 lunar module that carried Neil Armstrong and Buzz Aldrin to the lunar surface.",
    contextSentence: "Mission Control heard: 'Houston, Tranquility Base here. The Eagle has landed.'",
    hints: ["Mission Control heard: 'The Eagle has landed.'", "The command module that orbited the Moon was named Columbia."],
    coach: "The lunar module Eagle landed at Tranquility Base. Neil Armstrong radioed: 'Houston, Tranquility Base here — the Eagle has landed.' Those words are famous worldwide!"
  },
  {
    id: "astro-ksc-07",
    grade: 0,
    type: "nasa-ksc",
    word: "Mercury → Gemini → Apollo",
    prompt: "In what order did NASA's first three human spaceflight programs occur?",
    choices: [
      "Apollo → Gemini → Mercury",
      "Mercury → Apollo → Gemini",
      "Mercury → Gemini → Apollo",
      "Gemini → Mercury → Apollo"
    ],
    answer: "Mercury → Gemini → Apollo",
    definition: "Mercury (1958–1963) sent the first Americans to space; Gemini (1961–1966) developed orbital techniques; Apollo (1961–1972) landed humans on the Moon.",
    contextSentence: "Each program built on the lessons of the last, leading from a 15-minute flight to a Moon landing in just 8 years.",
    hints: ["Mercury was the first — single-astronaut capsules.", "Gemini practiced rendezvous and spacewalks before Apollo."],
    coach: "Mercury sent the first Americans to space, Gemini practiced the skills needed for Moon travel, and Apollo landed on the Moon. Three programs in just 11 years!"
  },
  {
    id: "astro-ksc-08",
    grade: 0,
    type: "nasa-ksc",
    word: "Apollo 13",
    prompt: "What was Apollo 13 famous for?",
    choices: [
      "The first Moon landing",
      "The first spacewalk",
      "A near-disaster where an oxygen tank exploded but all three crew members survived",
      "The first landing on the lunar far side"
    ],
    answer: "A near-disaster where an oxygen tank exploded but all three crew members survived",
    definition: "Apollo 13 (1970) suffered an oxygen tank explosion that crippled the spacecraft. The crew used the lunar module as a lifeboat and returned safely to Earth.",
    contextSentence: "Apollo 13 commander Jim Lovell radioed: 'Houston, we've had a problem.'",
    hints: ["It launched in April 1970.", "The crew used the lunar module as a lifeboat to survive."],
    coach: "Apollo 13 is called 'NASA's finest hour.' An oxygen tank blew up on the way to the Moon, but through teamwork and quick thinking, the crew made it home safely. 'Houston, we've had a problem.'"
  },
  {
    id: "astro-ksc-09",
    grade: 0,
    type: "nasa-ksc",
    word: "Vehicle Assembly Building",
    prompt: "What is the Vehicle Assembly Building (VAB) at Kennedy Space Center?",
    choices: [
      "A museum displaying historic spacecraft",
      "One of the world's largest buildings, where rockets are assembled before being rolled to the launch pad",
      "Mission Control for all NASA launches",
      "A runway where the Space Shuttle landed"
    ],
    answer: "One of the world's largest buildings, where rockets are assembled before being rolled to the launch pad",
    definition: "The VAB is a massive 160-metre-tall building at KSC where rockets including Saturn V, Space Shuttle, and SLS have been assembled.",
    contextSentence: "The VAB is so large it has its own weather — clouds have formed inside on humid days.",
    hints: ["It is 160 metres tall — as tall as a 52-story building.", "It is so huge that clouds can form inside on humid days."],
    coach: "The VAB is so enormous — 160 m tall — that clouds have formed INSIDE it! It's where rockets are fully assembled before crawling to the launch pad on a giant crawler-transporter."
  },
  {
    id: "astro-ksc-10",
    grade: 0,
    type: "nasa-ksc",
    word: "T-minus",
    prompt: "What does 'T-minus' mean in a launch countdown?",
    choices: [
      "The temperature of the rocket fuel",
      "The number of engines on the rocket",
      "The time remaining before launch, counting down to zero",
      "The target altitude of the mission"
    ],
    answer: "The time remaining before launch, counting down to zero",
    definition: "T-minus refers to the time before launch. 'T' stands for 'time', and the number decreases until T-0, which is the moment of liftoff.",
    contextSentence: "At T-minus 10 seconds, the launch director begins the final countdown.",
    hints: ["'T' stands for 'time' in a countdown.", "When the countdown reaches T-0, the rocket launches."],
    coach: "T-minus is counting down to launch! T-minus 60 means 60 seconds to go. T-0 is the moment the rocket fires. Launch controllers hold the count when there are issues and resume when fixed."
  },
  {
    id: "astro-ksc-11",
    grade: 0,
    type: "nasa-ksc",
    word: "Launch Complex 39A",
    prompt: "What is Launch Complex 39A (LC-39A) at Kennedy Space Center known for?",
    choices: [
      "Where astronauts train for spacewalks",
      "The historic launch pad used by Apollo and the Space Shuttle, now leased by SpaceX",
      "NASA's headquarters and Mission Control",
      "The landing strip for returning Space Shuttles"
    ],
    answer: "The historic launch pad used by Apollo and the Space Shuttle, now leased by SpaceX",
    definition: "LC-39A launched Apollo 11 to the Moon and the first Space Shuttle, and is now leased by SpaceX for Falcon 9 and Starship launches.",
    contextSentence: "LC-39A is one of the most historically significant launch pads in history, having launched missions to the Moon.",
    hints: ["Apollo 11 launched from this pad on its way to the Moon.", "SpaceX now uses this pad for Falcon 9 and Starship launches."],
    coach: "Launch Complex 39A is legendary! Apollo 11 lifted off from here in 1969. The Space Shuttle also launched from here. Today SpaceX leases it for Falcon 9 and Starship — history keeps being made on the same pad!"
  },
  {
    id: "astro-ksc-12",
    grade: 0,
    type: "nasa-ksc",
    word: "Artemis",
    prompt: "What is NASA's Artemis program?",
    choices: [
      "A program to study asteroids",
      "NASA's program to return humans to the Moon and build toward eventual missions to Mars",
      "A series of Mars rovers",
      "A space telescope mission"
    ],
    answer: "NASA's program to return humans to the Moon and build toward eventual missions to Mars",
    definition: "Artemis is NASA's current human exploration program, aiming to land the first woman and the next man on the Moon, and to establish a long-term lunar presence.",
    contextSentence: "Artemis I, the first test flight, circled the Moon in late 2022 without a crew.",
    hints: ["Artemis is the twin sister of Apollo in Greek mythology.", "It aims to land the first woman on the Moon."],
    coach: "Artemis is named after Apollo's twin sister in mythology. The program will land the first woman and first person of colour on the Moon, and eventually use the Moon as a stepping stone to Mars!"
  },
  {
    id: "astro-ksc-13",
    grade: 0,
    type: "nasa-ksc",
    word: "Orion",
    prompt: "What is NASA's Orion spacecraft designed to do?",
    choices: [
      "Serve as a permanent space station",
      "Carry astronauts to the Moon and deep-space destinations",
      "Land on Mars",
      "Launch and retrieve satellites"
    ],
    answer: "Carry astronauts to the Moon and deep-space destinations",
    definition: "Orion is NASA's crew capsule for deep-space exploration, designed to carry astronauts beyond low Earth orbit on top of the SLS rocket.",
    contextSentence: "Orion completed its first uncrewed flight around the Moon during Artemis I in November–December 2022.",
    hints: ["It rides on top of the SLS rocket.", "It flew its first uncrewed test around the Moon in 2022."],
    coach: "Orion is NASA's new crew capsule. In 2022 it flew around the Moon and back without a crew as a test. Future Artemis missions will carry astronauts inside Orion all the way to lunar orbit!"
  },
  {
    id: "astro-ksc-14",
    grade: 0,
    type: "nasa-ksc",
    word: "3 days",
    prompt: "Roughly how long does it take to travel from Earth to the Moon?",
    choices: ["A few hours", "About 3 days", "About 2 weeks", "About a month"],
    answer: "About 3 days",
    definition: "Apollo missions took about 3 days to travel the 384,400 km from Earth to the Moon.",
    contextSentence: "Apollo 11 launched on July 16, 1969 and reached the Moon on July 19 — a journey of about 3 days.",
    hints: ["Apollo 11 launched July 16 and arrived at the Moon July 19.", "The Moon is about 384,400 km from Earth."],
    coach: "The Moon is about 384,400 km away. Travelling at Apollo speeds, the journey takes about 3 days. By comparison, light from the Moon reaches Earth in just 1.3 seconds!"
  },
  {
    id: "astro-ksc-15",
    grade: 0,
    type: "nasa-ksc",
    word: "Launch Control Center",
    prompt: "What happens inside the Launch Control Center (LCC) at Kennedy Space Center?",
    choices: [
      "Rockets are built and tested",
      "Astronauts practice emergency procedures",
      "Launch teams monitor all systems and control rocket launches",
      "Rocket engines are manufactured"
    ],
    answer: "Launch teams monitor all systems and control rocket launches",
    definition: "The Launch Control Center at KSC is where engineers and controllers monitor every system before and during launch, calling 'Go for launch' when all is ready.",
    contextSentence: "During the famous Apollo 11 launch, over 450 engineers monitored systems from the LCC.",
    hints: ["It is where engineers call 'Go for launch'.", "It looks like a large room full of computer screens."],
    coach: "The Launch Control Center is the nerve centre of every launch. Hundreds of engineers watch every rocket system simultaneously. When everything is 'Go', the launch director gives the order to light the engines!"
  },
  {
    id: "astro-ksc-16",
    grade: 0,
    type: "nasa-ksc",
    word: "crawler-transporter",
    prompt: "How are fully assembled rockets moved from the Vehicle Assembly Building to the launch pad at KSC?",
    choices: [
      "They are flown by helicopter",
      "They are driven on regular roads",
      "They are rolled on a giant crawler-transporter at about 1.6 km/h",
      "They are assembled at the launch pad"
    ],
    answer: "They are rolled on a giant crawler-transporter at about 1.6 km/h",
    definition: "The crawler-transporter is a massive vehicle that slowly carries assembled rockets the 6 km from the VAB to the launch pad.",
    contextSentence: "The crawlerway path from the VAB to the pad is 6 km long and the journey takes about 8 hours.",
    hints: ["It travels at about 1.6 km/h — walking pace.", "The journey from the VAB to the pad takes about 8 hours."],
    coach: "The crawler-transporter is one of the largest vehicles ever built. It carries rockets weighing millions of kg at a walking pace (1.6 km/h). The 6 km trip to the launch pad takes about 8 hours!"
  },
  {
    id: "astro-ksc-17",
    grade: 0,
    type: "nasa-ksc",
    word: "spacesuit",
    prompt: "Why must astronauts wear spacesuits outside their spacecraft?",
    choices: [
      "To look official",
      "Spacesuits provide air to breathe, maintain pressure, and protect from extreme temperatures and radiation",
      "To communicate with Mission Control",
      "To help them float in zero gravity"
    ],
    answer: "Spacesuits provide air to breathe, maintain pressure, and protect from extreme temperatures and radiation",
    definition: "Spacesuits are self-contained life-support systems that provide oxygen, maintain pressure, regulate temperature, and shield against radiation and micrometeorites.",
    contextSentence: "Without a spacesuit in space, a person would lose consciousness in about 15 seconds.",
    hints: ["Space is a vacuum with no air and extreme temperature swings.", "The suit acts like a personal spacecraft."],
    coach: "A spacesuit is basically a personal spacecraft! It provides oxygen, keeps pressure around the body, protects from temperatures ranging from -120°C to +120°C, and shields from radiation. Without one, you'd black out in seconds!"
  },
  {
    id: "astro-ksc-18",
    grade: 0,
    type: "nasa-ksc",
    word: "Saturn V",
    prompt: "What was the Saturn V, used during the Apollo program?",
    choices: [
      "A space station module",
      "The most powerful rocket ever flown, used to launch Apollo astronauts to the Moon",
      "A type of rover deployed on the Moon",
      "A navigation computer on board the Apollo capsule"
    ],
    answer: "The most powerful rocket ever flown, used to launch Apollo astronauts to the Moon",
    definition: "Saturn V was a 111-metre-tall rocket that generated 34.5 million newtons of thrust — still the most powerful rocket ever successfully flown.",
    contextSentence: "Saturn V launched 13 times without losing a single crew member, sending 24 humans to the Moon.",
    hints: ["It was 111 metres tall — taller than the Statue of Liberty.", "It launched 13 times and sent 24 humans toward the Moon."],
    coach: "Saturn V is still the most powerful rocket ever successfully flown. It was 111 m tall and generated 3.5 million kg of thrust. All 13 missions succeeded, and it sent 24 humans to the Moon!"
  },

  // ── Earth & Space ─────────────────────────────────────────────────
  {
    id: "astro-es-01",
    grade: 0,
    type: "earth-space",
    word: "Kármán line",
    prompt: "What is the Kármán line?",
    choices: [
      "A line on a star map connecting two constellations",
      "The internationally recognised boundary of space at 100 km altitude",
      "A weather pattern in Earth's upper atmosphere",
      "The equator of Earth"
    ],
    answer: "The internationally recognised boundary of space at 100 km altitude",
    definition: "The Kármán line, at 100 km above sea level, is the internationally recognised boundary where Earth's atmosphere ends and outer space begins.",
    contextSentence: "Astronauts and rockets must pass the Kármán line to officially reach space.",
    hints: ["It is 100 km above sea level.", "Cross this line and you are officially an astronaut."],
    coach: "The Kármán line is at 100 km altitude — cross it and you're officially in space! At that height, the atmosphere is too thin for aircraft to fly, so only rockets can travel there."
  },
  {
    id: "astro-es-02",
    grade: 0,
    type: "earth-space",
    word: "axial tilt",
    prompt: "What causes seasons on Earth?",
    choices: [
      "Earth's distance from the Sun changes during the year",
      "Earth's axis is tilted at 23.5°, so different parts receive more direct sunlight at different times of year",
      "The Sun changes temperature throughout the year",
      "The Moon blocks sunlight during winter"
    ],
    answer: "Earth's axis is tilted at 23.5°, so different parts receive more direct sunlight at different times of year",
    definition: "Earth's axis is tilted 23.5° relative to its orbit, causing seasons as different hemispheres tilt toward or away from the Sun.",
    contextSentence: "When the Northern Hemisphere tilts toward the Sun, it is summer there — and winter in the Southern Hemisphere.",
    hints: ["Earth's axis is tilted at 23.5°.", "When your hemisphere tilts toward the Sun, you get summer; away means winter."],
    coach: "Seasons are caused by Earth's tilt — not its distance from the Sun! The Northern Hemisphere tilts toward the Sun in June (summer), and away in December (winter). The Southern Hemisphere has the opposite!"
  },
  {
    id: "astro-es-03",
    grade: 0,
    type: "earth-space",
    word: "ozone layer",
    prompt: "What protects life on Earth from the Sun's harmful ultraviolet (UV) radiation?",
    choices: ["The clouds", "The oceans", "The ozone layer in the stratosphere", "The Moon"],
    answer: "The ozone layer in the stratosphere",
    definition: "The ozone layer is a region of Earth's stratosphere that absorbs most of the Sun's harmful ultraviolet radiation.",
    contextSentence: "Without the ozone layer, UV radiation would damage DNA and make life on Earth very difficult.",
    hints: ["It is found in the stratosphere, about 15–35 km above Earth.", "Ozone is a molecule made of three oxygen atoms (O₃)."],
    coach: "The ozone layer acts like Earth's sunscreen! It absorbs harmful UV radiation from the Sun that would otherwise damage living cells and cause skin cancer. Scientists discovered a 'hole' in it in the 1980s, leading to global action."
  },
  {
    id: "astro-es-04",
    grade: 0,
    type: "earth-space",
    word: "microgravity",
    prompt: "Why do astronauts float inside the ISS?",
    choices: [
      "There is no gravity at all in orbit",
      "The ISS has a gravity generator that is turned off",
      "They are in constant free-fall around Earth, which creates the feeling of weightlessness",
      "Magnetic fields in the ISS push them away from the floor"
    ],
    answer: "They are in constant free-fall around Earth, which creates the feeling of weightlessness",
    definition: "Microgravity is the condition experienced in orbit: the ISS and everything in it are falling around Earth together, so there is no felt gravity.",
    contextSentence: "Astronauts on the ISS still experience Earth's gravity — they are just falling sideways so fast they orbit instead of landing.",
    hints: ["The ISS is actually falling toward Earth constantly.", "It moves sideways so fast that it keeps missing Earth as it falls."],
    coach: "Astronauts float because the ISS is in free-fall! It falls toward Earth but moves sideways so fast (27,000 km/h) that it keeps missing. Everything inside falls together, so nothing feels heavy — that's microgravity!"
  },
  {
    id: "astro-es-05",
    grade: 0,
    type: "earth-space",
    word: "mass vs weight",
    prompt: "What is the difference between mass and weight?",
    choices: [
      "They are exactly the same thing",
      "Mass is the amount of matter in an object; weight is the force of gravity pulling on that mass",
      "Mass changes on other planets; weight never changes",
      "Weight measures how big something is; mass measures how dense it is"
    ],
    answer: "Mass is the amount of matter in an object; weight is the force of gravity pulling on that mass",
    definition: "Mass measures how much matter an object contains (kg). Weight is the force gravity exerts on that mass — it changes depending on the gravitational pull of the location.",
    contextSentence: "Your mass is the same on Earth and the Moon, but your weight on the Moon is only 1/6 of your Earth weight.",
    hints: ["Your mass stays the same everywhere in the universe.", "On the Moon you would weigh 6 times less than on Earth."],
    coach: "Mass is how much stuff you're made of — it never changes. Weight is how hard gravity pulls on you. On the Moon (1/6 of Earth's gravity) you'd weigh 6 times less, but your mass would be exactly the same!"
  },
  {
    id: "astro-es-06",
    grade: 0,
    type: "earth-space",
    word: "troposphere",
    prompt: "Which layer of Earth's atmosphere do we live in and where weather occurs?",
    choices: ["Stratosphere", "Mesosphere", "Troposphere", "Thermosphere"],
    answer: "Troposphere",
    definition: "The troposphere is the lowest layer of Earth's atmosphere, from the surface to about 12 km up, where all weather occurs.",
    contextSentence: "Jet aircraft fly near the top of the troposphere, around 10–12 km altitude.",
    hints: ["It is the layer right at Earth's surface, where we breathe and weather forms.", "It extends up to about 12 km altitude."],
    coach: "The troposphere is our home layer — it extends from the ground to about 12 km up. All our weather happens here. Jet airliners cruise near the top of the troposphere!"
  },
  {
    id: "astro-es-07",
    grade: 0,
    type: "earth-space",
    word: "escape velocity",
    prompt: "What is Earth's escape velocity — the minimum speed needed to break free from Earth's gravity?",
    choices: ["About 1 km/s", "About 4 km/s", "About 11.2 km/s", "About 30 km/s"],
    answer: "About 11.2 km/s",
    definition: "Escape velocity from Earth is about 11.2 km/s (40,320 km/h) — the minimum speed an object needs to escape Earth's gravitational pull without further propulsion.",
    contextSentence: "Rockets heading to the Moon or beyond must reach escape velocity to leave Earth's gravity behind.",
    hints: ["It is about 11.2 km/s — or roughly 40,000 km/h.", "Rockets heading to the Moon must reach this speed."],
    coach: "To escape Earth's gravity entirely, you need to reach 11.2 km/s — about 40,320 km/h! Missions to the Moon and beyond have to reach this speed. Satellites in orbit don't need to reach it because they are still 'captured' by Earth's gravity."
  },
  {
    id: "astro-es-08",
    grade: 0,
    type: "earth-space",
    word: "tides",
    prompt: "What primarily causes ocean tides on Earth?",
    choices: ["Wind patterns from storms", "The Sun's heat warming the oceans", "The gravitational pull of the Moon", "Earth's rotation alone"],
    answer: "The gravitational pull of the Moon",
    definition: "The Moon's gravity pulls on Earth's oceans, creating two bulges of water — one facing the Moon and one on the opposite side — that cause the tides.",
    contextSentence: "Most coastlines have two high tides and two low tides every day as Earth rotates under the Moon's pull.",
    hints: ["The Moon is the primary cause; the Sun contributes too.", "There are usually two high tides and two low tides each day."],
    coach: "The Moon's gravity pulls on Earth's oceans, creating bulges of water on the Moon-side and the opposite side. As Earth spins, coastlines pass through these bulges — giving us two high tides and two low tides every day!"
  },
  {
    id: "astro-es-09",
    grade: 0,
    type: "earth-space",
    word: "1,670 km/h",
    prompt: "About how fast does Earth's surface move at the equator due to Earth's rotation?",
    choices: ["About 10 km/h", "About 100 km/h", "About 1,670 km/h", "About 10,000 km/h"],
    answer: "About 1,670 km/h",
    definition: "Earth's equator travels at about 1,670 km/h as Earth completes one full rotation every 24 hours.",
    contextSentence: "Rockets launched eastward from Florida get a free speed boost of about 1,500 km/h from Earth's rotation.",
    hints: ["Earth completes one rotation every 24 hours.", "Rockets launched eastward from Florida get a free boost from this speed."],
    coach: "Earth's surface at the equator moves at about 1,670 km/h! That's why KSC launches rockets eastward — they get a free speed boost from Earth's spin, which saves a lot of fuel."
  },
  {
    id: "astro-es-10",
    grade: 0,
    type: "earth-space",
    word: "Northern Lights",
    prompt: "What causes the Northern Lights (Aurora Borealis)?",
    choices: [
      "Sunlight reflecting off polar ice",
      "Lightning storms in the upper atmosphere",
      "Charged particles from the Sun interacting with Earth's magnetic field and atmosphere",
      "Light pollution from cities near the poles"
    ],
    answer: "Charged particles from the Sun interacting with Earth's magnetic field and atmosphere",
    definition: "The Aurora Borealis occurs when charged particles from the Sun are funnelled by Earth's magnetic field toward the poles, where they collide with atmospheric gases, emitting coloured light.",
    contextSentence: "The Northern Lights can appear green, red, purple, or blue depending on which gases the particles hit.",
    hints: ["They are most visible near Earth's magnetic poles.", "They are also called the Aurora Borealis in the Northern Hemisphere."],
    coach: "The Northern Lights happen when solar wind (charged particles from the Sun) gets funnelled toward Earth's poles by our magnetic field. The particles collide with air molecules and glow in beautiful colours — nature's own light show!"
  },

  // ── Fun Facts ──────────────────────────────────────────────────────
  {
    id: "astro-ff-01",
    grade: 0,
    type: "fun-fact",
    word: "Venus",
    prompt: "On which planet is a single day longer than its entire year?",
    choices: ["Mars", "Jupiter", "Venus", "Saturn"],
    answer: "Venus",
    definition: "Venus rotates so slowly that one day on Venus (243 Earth days) is longer than its year (225 Earth days).",
    contextSentence: "On Venus, the Sun rises in the west and sets in the east because it spins backwards.",
    hints: ["It is the second planet from the Sun.", "It also spins backwards compared to most planets."],
    coach: "Venus spins so slowly a Venusian day is longer than its whole year. It also spins backwards — so the Sun rises in the west there!"
  },
  {
    id: "astro-ff-02",
    grade: 0,
    type: "fun-fact",
    word: "Great Red Spot",
    prompt: "The Great Red Spot on Jupiter is a storm that has been raging for at least how long?",
    choices: ["10 years", "100 years", "350+ years", "1,000 years"],
    answer: "350+ years",
    definition: "The Great Red Spot is a giant anticyclonic storm on Jupiter, wider than Earth, observed continuously since the 1600s.",
    contextSentence: "The Great Red Spot is so large that Earth could fit inside it.",
    hints: ["It was first observed in the 1600s.", "The storm is wider than our entire planet."],
    coach: "The Great Red Spot is a storm wider than Earth that has been spinning on Jupiter for over 350 years! It has been shrinking slowly over recent decades though."
  },
  {
    id: "astro-ff-03",
    grade: 0,
    type: "fun-fact",
    word: "8 minutes",
    prompt: "How long does light from the Sun take to reach Earth?",
    choices: ["8 seconds", "8 minutes", "8 hours", "8 days"],
    answer: "8 minutes",
    definition: "Light travels at about 300,000 km/s. The Sun is about 150 million km away, so its light reaches Earth in about 8 minutes.",
    contextSentence: "When you look at the Sun, you are seeing it as it was 8 minutes ago.",
    hints: ["Light travels at 300,000 km per second.", "The Sun is about 150 million km from Earth."],
    coach: "Light from the Sun takes about 8 minutes to reach us. So when you look at the Sun, you're seeing it as it was 8 minutes ago. Starlight you see at night may be thousands of years old!"
  },
  {
    id: "astro-ff-04",
    grade: 0,
    type: "fun-fact",
    word: "no wind or water",
    prompt: "Why do footprints left on the Moon last for millions of years?",
    choices: ["The Moon is covered in ice", "There is no wind or water on the Moon to erase them", "Moon dust is sticky", "The Moon spins very slowly"],
    answer: "There is no wind or water on the Moon to erase them",
    definition: "The Moon has no atmosphere, so there is no wind, rain, or erosion to wear away footprints or marks.",
    contextSentence: "The footprints of Apollo astronauts from 1969 are still perfectly preserved on the Moon today.",
    hints: ["The Moon has no atmosphere.", "Think about what wears away footprints on Earth."],
    coach: "On Earth, wind and rain erase footprints quickly. The Moon has no atmosphere — no weather at all — so the Apollo astronauts' footprints from 1969 are still perfectly preserved. They'll last millions of years!"
  },
  {
    id: "astro-ff-05",
    grade: 0,
    type: "fun-fact",
    word: "vacuum",
    prompt: "Why is outer space completely silent?",
    choices: [
      "Space is too cold for sound",
      "Sound needs matter (like air) to travel through, and space is nearly empty",
      "Sounds travel too slowly in space",
      "Space absorbs all sound waves instantly"
    ],
    answer: "Sound needs matter (like air) to travel through, and space is nearly empty",
    definition: "Sound is a wave that needs particles to travel through. Deep space is a near-perfect vacuum with almost no particles.",
    contextSentence: "The Alien movie tagline 'In space, no one can hear you scream' is scientifically correct.",
    hints: ["Sound is a wave that needs particles to vibrate through.", "Space is a near-perfect vacuum."],
    coach: "Sound needs particles to pass vibrations from one to the next. Space is a near-perfect vacuum — almost no particles — so sound cannot travel at all. Space is completely, utterly silent!"
  },
  {
    id: "astro-ff-06",
    grade: 0,
    type: "fun-fact",
    word: "1,000,000",
    prompt: "Roughly how many Earths could fit inside the Sun?",
    choices: ["About 100", "About 1,000", "About 1,000,000", "About 100,000,000"],
    answer: "About 1,000,000",
    definition: "The Sun's volume is so enormous that roughly one million Earths could fit inside it.",
    contextSentence: "The Sun contains about 99.8% of all mass in the solar system.",
    hints: ["The Sun is about 1.4 million km in diameter.", "The Sun contains 99.8% of all the mass in the solar system."],
    coach: "The Sun is 1.4 million km across — about 109 times Earth's diameter. Its volume is so huge that about 1 million Earths could fit inside. It holds 99.8% of all mass in the solar system!"
  },
  {
    id: "astro-ff-07",
    grade: 0,
    type: "fun-fact",
    word: "Olympus Mons",
    prompt: "What is the name of the largest volcano in our solar system?",
    choices: ["Kilauea (Earth)", "Olympus Mons (Mars)", "Maxwell Montes (Venus)", "Tharsis (Mars)"],
    answer: "Olympus Mons (Mars)",
    definition: "Olympus Mons on Mars is the largest volcano in the solar system — about 22 km tall and 600 km wide, nearly three times the height of Everest.",
    contextSentence: "Olympus Mons is so wide that if you stood at its base, the rim would be below the horizon.",
    hints: ["It is on Mars.", "It is nearly three times the height of Mount Everest."],
    coach: "Olympus Mons on Mars is almost 3× the height of Mount Everest and as wide as the state of Arizona! It is so flat and wide that standing at its base you wouldn't even be able to see its rim — it's over the horizon!"
  },
  {
    id: "astro-ff-08",
    grade: 0,
    type: "fun-fact",
    word: "Jupiter",
    prompt: "Which planet spins the fastest, completing one full rotation in just under 10 hours?",
    choices: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    answer: "Jupiter",
    definition: "Jupiter rotates once every 9 hours and 56 minutes — faster than any other planet, despite being the largest.",
    contextSentence: "Jupiter's rapid spin is why it has a distinctly flattened shape at the poles.",
    hints: ["It is the largest planet but has the shortest day.", "Its rapid rotation causes it to bulge at the equator."],
    coach: "Jupiter is the biggest planet but has the shortest day — under 10 hours! It spins so fast that it bulges noticeably at the equator. The rapid spin also drives its spectacular storm bands."
  },
  {
    id: "astro-ff-09",
    grade: 0,
    type: "fun-fact",
    word: "4.6 billion years",
    prompt: "How old is our solar system?",
    choices: ["About 1 million years", "About 65 million years", "About 4.6 billion years", "About 13.8 billion years"],
    answer: "About 4.6 billion years",
    definition: "Our solar system formed from a collapsing cloud of gas and dust about 4.6 billion years ago.",
    contextSentence: "The universe itself is about 13.8 billion years old — roughly three times the age of our solar system.",
    hints: ["The universe is about 13.8 billion years old.", "Earth formed from the same solar nebula."],
    coach: "Our solar system is about 4.6 billion years old — it formed from a collapsing cloud of gas and dust. The universe itself is 13.8 billion years old, so our solar system formed about two-thirds of the way through the universe's life so far!"
  },
  {
    id: "astro-ff-10",
    grade: 0,
    type: "fun-fact",
    word: "neutron star",
    prompt: "A teaspoon of material from a neutron star would weigh about how much on Earth?",
    choices: ["1 kilogram", "1 tonne", "1 billion tonnes", "1 gram"],
    answer: "1 billion tonnes",
    definition: "Neutron stars are incredibly dense stellar remnants. A teaspoon of their material would weigh about a billion tonnes.",
    contextSentence: "Neutron stars pack more mass than the Sun into a sphere just 20 km across.",
    hints: ["Neutron stars are the densest objects in the universe (apart from black holes).", "They pack more mass than the Sun into a city-sized ball."],
    coach: "Neutron stars pack more mass than our entire Sun into a ball just 20 km across — city-sized! A teaspoon of that material would weigh about a billion tonnes — as heavy as a mountain!"
  },

  // ── Astronomy Vocabulary ───────────────────────────────────────────
  {
    id: "astro-voc-01",
    grade: 0,
    type: "astronomy-vocab",
    word: "light-year",
    prompt: "What does the term 'light-year' measure?",
    choices: ["How long a year lasts in space", "The distance light travels in one year", "How bright a star is", "The speed of a planet orbiting a star"],
    answer: "The distance light travels in one year",
    definition: "A light-year is the distance that light travels in one year — about 9.46 trillion kilometres.",
    contextSentence: "The nearest star beyond our Sun is about 4.24 light-years away.",
    hints: ["It is a unit of distance, not time.", "Light travels at about 300,000 km per second."],
    coach: "A light-year measures distance, not time! Light covers about 9.46 trillion km in a year. Scientists use it to describe the vast distances between stars."
  },
  {
    id: "astro-voc-02",
    grade: 0,
    type: "astronomy-vocab",
    word: "orbit",
    prompt: "What does 'orbit' mean in astronomy?",
    choices: ["The centre of a planet", "The curved path one object takes around another due to gravity", "The explosion of a star", "The surface layer of the Moon"],
    answer: "The curved path one object takes around another due to gravity",
    definition: "An orbit is the curved path that a planet, moon, or satellite follows around a larger object due to gravity.",
    contextSentence: "Earth orbits the Sun once every 365.25 days.",
    hints: ["It involves one object moving around another.", "Gravity keeps the object on this path."],
    coach: "An orbit is the path one object travels around another because of gravity. Earth orbits the Sun, the Moon orbits Earth, and the ISS orbits Earth about every 90 minutes."
  },
  {
    id: "astro-voc-03",
    grade: 0,
    type: "astronomy-vocab",
    word: "nebula",
    prompt: "What is a nebula?",
    choices: ["A type of comet", "A small moon of Jupiter", "A cloud of gas and dust in space, often where new stars are born", "A dwarf planet beyond Neptune"],
    answer: "A cloud of gas and dust in space, often where new stars are born",
    definition: "A nebula is a giant cloud of gas and dust in space. New stars often form inside nebulae, which is why they are called stellar nurseries.",
    contextSentence: "The Orion Nebula is a famous stellar nursery where new stars are being born right now.",
    hints: ["It is often called a 'stellar nursery'.", "It is a cloud of gas and dust floating in space."],
    coach: "A nebula is a cloud of gas and dust in space. Stars — including our own Sun — are born inside nebulae. That's why they're called stellar nurseries!"
  },
  {
    id: "astro-voc-04",
    grade: 0,
    type: "astronomy-vocab",
    word: "eclipse",
    prompt: "What is a solar eclipse?",
    choices: ["When a comet passes close to Earth", "When the Moon passes between the Sun and Earth, blocking sunlight", "When a star explodes", "When Earth passes through the asteroid belt"],
    answer: "When the Moon passes between the Sun and Earth, blocking sunlight",
    definition: "A solar eclipse occurs when the Moon lines up between the Sun and Earth, blocking some or all of the Sun's light from reaching Earth.",
    contextSentence: "During a total solar eclipse, the sky goes dark in the middle of the day.",
    hints: ["It involves the Moon, Sun, and Earth lining up perfectly.", "During a total one, daytime briefly becomes dark."],
    coach: "A solar eclipse happens when the Moon blocks the Sun's light from Earth. During a total solar eclipse, the sky goes dark in the middle of the day and you can see stars! They happen about once every 18 months somewhere on Earth."
  },
  {
    id: "astro-voc-05",
    grade: 0,
    type: "astronomy-vocab",
    word: "gravity",
    prompt: "What is gravity?",
    choices: ["The glow around a star", "A force that attracts any two objects with mass toward each other", "The curved path of a planet around the Sun", "The bright tail of a comet"],
    answer: "A force that attracts any two objects with mass toward each other",
    definition: "Gravity is a fundamental force of attraction between any two objects that have mass. The more massive the object, the stronger its pull.",
    contextSentence: "Gravity keeps Earth in orbit around the Sun and keeps you firmly on the ground.",
    hints: ["It is the force that keeps your feet on the ground.", "Isaac Newton described it after observing a falling apple."],
    coach: "Gravity is the force that pulls objects with mass toward each other. It keeps planets in orbit around the Sun, moons in orbit around planets, and you firmly on the ground. Without it, everything would float away!"
  },
  {
    id: "astro-voc-06",
    grade: 0,
    type: "astronomy-vocab",
    word: "comet",
    prompt: "What is a comet?",
    choices: ["A rocky planet with no moons", "A ball of ice, dust, and rock that orbits the Sun and grows a glowing tail near the Sun", "A type of black hole", "A satellite built to orbit Earth"],
    answer: "A ball of ice, dust, and rock that orbits the Sun and grows a glowing tail near the Sun",
    definition: "A comet is a small icy body that orbits the Sun. When it gets close to the Sun, ices vaporise and form a bright tail that can stretch millions of kilometres.",
    contextSentence: "Halley's Comet passes near Earth about every 75–76 years and is visible to the naked eye.",
    hints: ["It forms a bright glowing tail when near the Sun.", "Halley's Comet is the most famous one."],
    coach: "Comets are balls of ice and rock. As they approach the Sun, the ice turns to gas and dust, forming a long glowing tail. Halley's Comet has been recorded for over 2,000 years and returns every 75–76 years!"
  },
  {
    id: "astro-voc-07",
    grade: 0,
    type: "astronomy-vocab",
    word: "meteor",
    prompt: "What is a meteor (often called a 'shooting star')?",
    choices: ["A planet without moons", "A type of distant galaxy", "A space rock that burns up and glows as it enters Earth's atmosphere", "A cloud of gas surrounding a star"],
    answer: "A space rock that burns up and glows as it enters Earth's atmosphere",
    definition: "A meteor is a piece of space debris that burns up in Earth's atmosphere, producing a bright streak of light. If it lands on Earth, it is called a meteorite.",
    contextSentence: "You can often see meteors during a meteor shower when Earth passes through a comet's debris trail.",
    hints: ["People call it a 'shooting star'.", "It glows because of friction as it enters the atmosphere."],
    coach: "A meteor is space rock burning up in Earth's atmosphere — what we call a shooting star. If a piece survives and hits the ground, it becomes a meteorite. The original chunk in space (before it enters) is called a meteoroid."
  },
  {
    id: "astro-voc-08",
    grade: 0,
    type: "astronomy-vocab",
    word: "telescope",
    prompt: "What is a telescope?",
    choices: ["A device for measuring temperature in space", "An instrument that collects and focuses light to make distant objects appear larger and clearer", "A type of rocket engine", "A navigation tool for spacecraft"],
    answer: "An instrument that collects and focuses light to make distant objects appear larger and clearer",
    definition: "A telescope is an instrument that collects light from distant objects, making them appear larger and brighter so astronomers can study them.",
    contextSentence: "Galileo was one of the first people to use a telescope to study the Moon and planets in 1609.",
    hints: ["Galileo used one to study space in 1609.", "Larger telescopes can collect more light and see fainter objects."],
    coach: "Telescopes collect light — the more light collected, the fainter and more distant the objects you can see. Galileo first pointed one at the sky in 1609 and saw mountains on the Moon and four moons of Jupiter!"
  },
  {
    id: "astro-voc-09",
    grade: 0,
    type: "astronomy-vocab",
    word: "atmosphere",
    prompt: "What is a planet's atmosphere?",
    choices: ["A ring of asteroids around a planet", "The layer of gases held around a planet by its gravity", "The tail of a comet", "The molten core of a planet"],
    answer: "The layer of gases held around a planet by its gravity",
    definition: "An atmosphere is the layer of gases surrounding a planet, held in place by the planet's gravity. It can protect the surface and make the planet habitable.",
    contextSentence: "Earth's atmosphere is about 78% nitrogen and 21% oxygen — perfect for supporting life.",
    hints: ["It is the air surrounding a planet.", "Earth's is 78% nitrogen and 21% oxygen."],
    coach: "An atmosphere is the blanket of gases surrounding a planet. Earth's atmosphere gives us air to breathe, shields us from meteors (which burn up in it), and protects us from UV radiation. Mars has a very thin atmosphere, and the Moon has almost none."
  },
  {
    id: "astro-voc-10",
    grade: 0,
    type: "astronomy-vocab",
    word: "rotation vs revolution",
    prompt: "What is the difference between rotation and revolution in astronomy?",
    choices: [
      "They mean the same thing",
      "Rotation is a planet spinning on its axis; revolution is a planet orbiting around another object",
      "Rotation is orbiting another object; revolution is spinning",
      "Both describe how fast a planet moves through space"
    ],
    answer: "Rotation is a planet spinning on its axis; revolution is a planet orbiting around another object",
    definition: "Rotation is when a body spins on its own axis (Earth rotates once every 24 hours). Revolution is when it travels around another body (Earth revolves around the Sun every 365.25 days).",
    contextSentence: "Earth's rotation causes day and night; Earth's revolution around the Sun creates the year.",
    hints: ["Rotation causes day and night.", "Revolution creates the year."],
    coach: "Rotation = spinning (Earth rotates once a day → day and night). Revolution = orbiting (Earth revolves around the Sun once a year → the year). Easy way to remember: a spinning top rotates; a ball on a string revolves!"
  },
  {
    id: "astro-voc-11",
    grade: 0,
    type: "astronomy-vocab",
    word: "galaxy",
    prompt: "What is a galaxy?",
    choices: ["A single large supergiant star", "A vast system of billions of stars, gas, dust, and dark matter bound together by gravity", "A very large comet", "A ring of asteroids around a star"],
    answer: "A vast system of billions of stars, gas, dust, and dark matter bound together by gravity",
    definition: "A galaxy is a gravitationally bound system of billions of stars, along with interstellar gas, dust, and dark matter.",
    contextSentence: "There are estimated to be over 2 trillion galaxies in the observable universe.",
    hints: ["Our Milky Way is one.", "There are an estimated 2 trillion of them in the observable universe."],
    coach: "A galaxy is a city of billions of stars held together by gravity. Our Milky Way has over 200 billion stars. Scientists estimate there are 2 trillion galaxies in the observable universe — that's more galaxies than grains of sand on all of Earth's beaches!"
  },
  {
    id: "astro-voc-12",
    grade: 0,
    type: "astronomy-vocab",
    word: "astronaut",
    prompt: "What is the term for a person trained to travel and work in space?",
    choices: ["Astronomer", "Cosmologist", "Astronaut", "Aerospace engineer"],
    answer: "Astronaut",
    definition: "An astronaut is a person trained by a space agency to travel and work in space. The word comes from Greek: 'astro' (star) + 'nautes' (sailor).",
    contextSentence: "NASA astronauts go through two years of basic training before being assigned to a mission.",
    hints: ["The word comes from Greek for 'star sailor'.", "NASA astronauts train for at least two years before their first mission."],
    coach: "Astronaut comes from Greek words meaning 'star sailor.' NASA astronauts train for two years learning everything from spacewalks to spacecraft systems to Russian. About 1 in 12,000 applicants is selected — one of the most competitive jobs on Earth!"
  },

  // ── Solar System (extra 10) ────────────────────────────────────────
  {
    id: "astro-ss-16",
    grade: 0,
    type: "solar-system",
    word: "hydrogen and helium",
    prompt: "What two gases make up most of the Sun?",
    choices: ["Oxygen and nitrogen", "Hydrogen and helium", "Carbon dioxide and methane", "Hydrogen and oxygen"],
    answer: "Hydrogen and helium",
    definition: "The Sun is made of about 73% hydrogen and 25% helium, with tiny amounts of other elements.",
    contextSentence: "The Sun converts hydrogen into helium through nuclear fusion, releasing enormous energy.",
    hints: ["These are the two lightest elements in the universe.", "Nuclear fusion in the Sun converts one into the other."],
    coach: "The Sun is about 73% hydrogen and 25% helium. In its core, hydrogen atoms fuse together to make helium — and that fusion releases the light and heat that warms Earth!"
  },
  {
    id: "astro-ss-17",
    grade: 0,
    type: "solar-system",
    word: "sol",
    prompt: "What is a 'sol' on Mars?",
    choices: ["A Martian year", "One Martian day (about 24 hours and 37 minutes)", "A Martian moon", "A dust storm on Mars"],
    answer: "One Martian day (about 24 hours and 37 minutes)",
    definition: "A sol is the term for a Martian day, which is about 24 hours and 37 minutes — very similar to an Earth day.",
    contextSentence: "NASA engineers track Mars rover missions in 'sols' rather than Earth days.",
    hints: ["It is the length of one day on Mars.", "It is only about 37 minutes longer than an Earth day."],
    coach: "Mars rovers count their mission days in 'sols' — Martian days. Each sol is 24 hours and 37 minutes long. A Martian year (one orbit of the Sun) lasts 687 Earth days!"
  },
  {
    id: "astro-ss-18",
    grade: 0,
    type: "solar-system",
    word: "Valles Marineris",
    prompt: "What is the largest canyon in our solar system?",
    choices: ["Grand Canyon (Earth)", "Valles Marineris (Mars)", "Eos Chasma (Mars)", "Mariner Valley (Venus)"],
    answer: "Valles Marineris (Mars)",
    definition: "Valles Marineris is a vast canyon system on Mars, stretching about 4,000 km long and up to 7 km deep — ten times longer than the Grand Canyon.",
    contextSentence: "Valles Marineris is so long it could stretch across the entire United States.",
    hints: ["It is on Mars.", "It is about 4,000 km long — roughly the width of the United States."],
    coach: "Valles Marineris on Mars is the biggest canyon in the solar system — 4,000 km long and 7 km deep. The Grand Canyon is only 446 km long by comparison. Scientists believe it formed as Mars's crust cracked and pulled apart billions of years ago."
  },
  {
    id: "astro-ss-19",
    grade: 0,
    type: "solar-system",
    word: "iron oxide",
    prompt: "Why does Mars appear red?",
    choices: ["It is covered in lava", "Its surface is rich in iron oxide (rust)", "It reflects red light from the Sun", "Its atmosphere is full of red dust from space"],
    answer: "Its surface is rich in iron oxide (rust)",
    definition: "Mars gets its red colour from iron oxide (rust) that covers much of its rocky surface and dust.",
    contextSentence: "Mars is nicknamed 'The Red Planet' because of the rust-coloured dust and rocks covering its surface.",
    hints: ["Think about what happens to iron when it gets wet on Earth.", "The same chemical that makes rust orange also colours Mars."],
    coach: "Mars is called the Red Planet because its surface is covered in iron oxide — rust! Just like a rusty nail, the iron in Mars's rocks reacted with oxygen billions of years ago and turned red."
  },
  {
    id: "astro-ss-20",
    grade: 0,
    type: "solar-system",
    word: "Europa",
    prompt: "Why are scientists excited about Jupiter's moon Europa?",
    choices: [
      "It has a breathable atmosphere like Earth",
      "It has a vast liquid water ocean under its icy surface",
      "It is the largest moon in the solar system",
      "It has active volcanoes that produce oxygen"
    ],
    answer: "It has a vast liquid water ocean under its icy surface",
    definition: "Europa has a thick icy shell covering a global liquid water ocean, warmed by tidal forces from Jupiter's gravity. It is considered one of the best candidates for extraterrestrial life.",
    contextSentence: "NASA's Europa Clipper mission, launched in 2024, will investigate whether Europa's ocean could support life.",
    hints: ["Its surface is covered in cracked ice.", "It may have more liquid water than all of Earth's oceans combined."],
    coach: "Europa is one of Jupiter's moons with a liquid ocean hidden under miles of ice! Jupiter's gravity squeezes Europa, creating heat that keeps water liquid. Scientists think it could potentially harbour life. NASA launched the Europa Clipper in 2024 to investigate!"
  },
  {
    id: "astro-ss-21",
    grade: 0,
    type: "solar-system",
    word: "terrestrial planets",
    prompt: "What are the four inner rocky planets called?",
    choices: ["Gas giants", "Ice giants", "Terrestrial planets", "Dwarf planets"],
    answer: "Terrestrial planets",
    definition: "The four inner planets — Mercury, Venus, Earth, and Mars — are called terrestrial planets. They have solid, rocky surfaces.",
    contextSentence: "All four terrestrial planets have solid surfaces that spacecraft or rovers could land on.",
    hints: ["'Terrestrial' comes from the Latin word for Earth.", "They all have solid rocky surfaces."],
    coach: "Mercury, Venus, Earth, and Mars are called terrestrial (Earth-like) planets because they all have solid, rocky surfaces. The outer four planets (Jupiter, Saturn, Uranus, Neptune) are giant planets made mostly of gas or ice."
  },
  {
    id: "astro-ss-22",
    grade: 0,
    type: "solar-system",
    word: "gas giants and ice giants",
    prompt: "How are Jupiter and Saturn different from Uranus and Neptune?",
    choices: [
      "Jupiter and Saturn are smaller",
      "Jupiter and Saturn are gas giants made mostly of hydrogen and helium; Uranus and Neptune are ice giants with more water and methane",
      "Jupiter and Saturn are solid; Uranus and Neptune are liquid",
      "They orbit in opposite directions"
    ],
    answer: "Jupiter and Saturn are gas giants made mostly of hydrogen and helium; Uranus and Neptune are ice giants with more water and methane",
    definition: "Gas giants (Jupiter, Saturn) are composed mainly of hydrogen and helium. Ice giants (Uranus, Neptune) have more water, methane, and ammonia ices.",
    contextSentence: "The blue-green colour of Uranus and Neptune comes from methane gas absorbing red light.",
    hints: ["Jupiter and Saturn are the two largest planets.", "The blue-green colour of Uranus and Neptune is a clue to their different composition."],
    coach: "All four outer planets are giant planets, but they split into two types: gas giants (Jupiter and Saturn — mostly hydrogen and helium) and ice giants (Uranus and Neptune — more icy compounds). Their blue-green colour comes from methane!"
  },
  {
    id: "astro-ss-23",
    grade: 0,
    type: "solar-system",
    word: "star",
    prompt: "What actually is the Sun?",
    choices: ["A very large planet", "A giant ball of fire floating in space", "A star — a massive ball of gas powered by nuclear fusion", "A very hot moon"],
    answer: "A star — a massive ball of gas powered by nuclear fusion",
    definition: "The Sun is a star — a massive, luminous sphere of plasma held together by gravity, powered by nuclear fusion in its core.",
    contextSentence: "The Sun is an ordinary star; it looks so much bigger and brighter than other stars only because it is much closer to us.",
    hints: ["The twinkling points of light in the night sky are the same type of object as the Sun.", "Nuclear fusion in its core generates its energy."],
    coach: "The Sun is a star — the same kind of object as the points of light you see twinkling at night! It looks so much bigger and brighter only because it's 4.24 light-years closer to us than the next nearest star."
  },
  {
    id: "astro-ss-24",
    grade: 0,
    type: "solar-system",
    word: "greenhouse effect",
    prompt: "What makes Venus so much hotter than Mercury, even though Mercury is closer to the Sun?",
    choices: [
      "Venus has more volcanoes",
      "Venus's thick CO₂ atmosphere creates an extreme greenhouse effect that traps heat",
      "Venus rotates faster, generating more heat",
      "Venus is bigger, so it holds more heat"
    ],
    answer: "Venus's thick CO₂ atmosphere creates an extreme greenhouse effect that traps heat",
    definition: "Venus has a thick atmosphere of mostly carbon dioxide that traps heat like a giant greenhouse, raising its surface temperature to 465°C.",
    contextSentence: "The greenhouse effect on Venus is so extreme that the surface would melt lead.",
    hints: ["Carbon dioxide acts like a blanket, trapping heat.", "Venus's atmosphere is about 90 times thicker than Earth's."],
    coach: "Venus teaches us about runaway greenhouse effects. Its thick CO₂ atmosphere traps so much heat that the surface is 465°C — hotter than Mercury, even though Mercury is closer to the Sun. It's a warning about what can happen when greenhouse gases build up!"
  },
  {
    id: "astro-ss-25",
    grade: 0,
    type: "solar-system",
    word: "giant impact hypothesis",
    prompt: "How do scientists think Earth's Moon formed?",
    choices: [
      "The Moon was always there when Earth formed",
      "Earth captured the Moon from the asteroid belt",
      "A Mars-sized object collided with early Earth, and the debris formed the Moon",
      "The Moon broke off from Earth as it cooled"
    ],
    answer: "A Mars-sized object collided with early Earth, and the debris formed the Moon",
    definition: "The giant impact hypothesis proposes that a Mars-sized body called Theia struck early Earth about 4.5 billion years ago, ejecting material that coalesced into the Moon.",
    contextSentence: "Rock samples brought back by Apollo astronauts support the idea that the Moon formed from Earth's own material.",
    hints: ["It is called the 'giant impact' hypothesis.", "Apollo Moon rocks have a similar composition to Earth's crust."],
    coach: "Scientists think the Moon formed from a giant collision! About 4.5 billion years ago, a Mars-sized rock called Theia smashed into early Earth. The debris ejected into orbit gradually clumped together to form the Moon — and Apollo rock samples back this up!"
  },

  // ── Stars & Galaxies (extra 10) ───────────────────────────────────
  {
    id: "astro-sg-13",
    grade: 0,
    type: "stars-galaxies",
    word: "nuclear fusion",
    prompt: "What process powers a star like our Sun?",
    choices: ["Nuclear fission (splitting atoms)", "Chemical burning", "Nuclear fusion (combining hydrogen atoms)", "Electrical energy"],
    answer: "Nuclear fusion (combining hydrogen atoms)",
    definition: "Nuclear fusion occurs in a star's core when hydrogen atoms are forced together under extreme heat and pressure to form helium, releasing enormous energy.",
    contextSentence: "The Sun converts about 600 million tonnes of hydrogen into helium every second through nuclear fusion.",
    hints: ["It is the joining of atoms, not the splitting of them.", "The Sun converts 600 million tonnes of hydrogen per second."],
    coach: "Stars shine through nuclear fusion — smashing hydrogen atoms together to make helium. The tiny bit of mass lost in this process converts to huge amounts of energy (E=mc²). The Sun has enough hydrogen fuel to last another 5 billion years!"
  },
  {
    id: "astro-sg-14",
    grade: 0,
    type: "stars-galaxies",
    word: "neutron star",
    prompt: "What is a neutron star?",
    choices: [
      "A very young star just starting to shine",
      "The incredibly dense, city-sized remnant left after a massive star explodes as a supernova",
      "A star with no light of its own",
      "A star orbiting a black hole"
    ],
    answer: "The incredibly dense, city-sized remnant left after a massive star explodes as a supernova",
    definition: "A neutron star is what remains after a massive star explodes as a supernova. It packs more mass than the Sun into a sphere only about 20 km across.",
    contextSentence: "A teaspoon of neutron star material would weigh about a billion tonnes.",
    hints: ["It is the aftermath of a supernova explosion.", "It is city-sized but incredibly dense."],
    coach: "When a massive star explodes as a supernova, its core collapses into a neutron star — a ball of neutrons only 20 km across but containing more mass than our Sun. It's the densest thing we can see in the universe (besides black holes)."
  },
  {
    id: "astro-sg-15",
    grade: 0,
    type: "stars-galaxies",
    word: "Polaris",
    prompt: "Why is Polaris (the North Star) special to navigators?",
    choices: [
      "It is the brightest star in the sky",
      "It sits almost directly above Earth's North Pole and always points north",
      "It is the closest star to Earth",
      "It changes colour every night"
    ],
    answer: "It sits almost directly above Earth's North Pole and always points north",
    definition: "Polaris appears almost motionless in the sky because it is aligned nearly directly above Earth's North Pole. Sailors have used it for navigation for thousands of years.",
    contextSentence: "No matter where you are in the Northern Hemisphere, Polaris always appears in the same direction — north.",
    hints: ["It sits above Earth's North Pole.", "Sailors used it to navigate for thousands of years."],
    coach: "Polaris is the North Star — it appears almost exactly above Earth's North Pole, so it always points north. Sailors without GPS used it to navigate for centuries. It isn't the brightest star, but it's one of the most useful!"
  },
  {
    id: "astro-sg-16",
    grade: 0,
    type: "stars-galaxies",
    word: "galaxy types",
    prompt: "Which of the following is NOT a recognised type of galaxy?",
    choices: ["Spiral", "Elliptical", "Irregular", "Triangular"],
    answer: "Triangular",
    definition: "Galaxies are classified as spiral (like the Milky Way), elliptical (oval-shaped), or irregular (no defined shape). There is no 'triangular' galaxy type.",
    contextSentence: "The Milky Way and Andromeda are both spiral galaxies, while some smaller satellite galaxies are irregular.",
    hints: ["The three main types are spiral, elliptical, and irregular.", "Our Milky Way is one of the main types — a spiral."],
    coach: "Galaxies come in three main shapes: spiral (like the Milky Way, with graceful arms), elliptical (smooth oval blobs, often the largest galaxies), and irregular (no set shape). There's no such thing as a triangular galaxy!"
  },
  {
    id: "astro-sg-17",
    grade: 0,
    type: "stars-galaxies",
    word: "200–400 billion",
    prompt: "Roughly how many stars are in the Milky Way galaxy?",
    choices: ["About 1 million", "About 1 billion", "Between 200 and 400 billion", "About 1 trillion"],
    answer: "Between 200 and 400 billion",
    definition: "Scientists estimate the Milky Way contains between 200 and 400 billion stars, though counting them all precisely is impossible.",
    contextSentence: "If you counted one star per second, it would take thousands of years to count all the stars in the Milky Way.",
    hints: ["It is far more than a billion.", "Our Sun is just one of hundreds of billions of stars in it."],
    coach: "The Milky Way has between 200 and 400 billion stars. If you counted one per second non-stop, it would take over 6,000 years just to reach 200 billion. And the Milky Way is just one of an estimated 2 trillion galaxies in the observable universe!"
  },
  {
    id: "astro-sg-18",
    grade: 0,
    type: "stars-galaxies",
    word: "own light",
    prompt: "What is the key difference between a star and a planet?",
    choices: [
      "Stars are bigger than planets",
      "Stars produce their own light through nuclear fusion; planets only reflect light from a star",
      "Stars are made of gas; planets are solid",
      "Stars orbit planets; planets orbit moons"
    ],
    answer: "Stars produce their own light through nuclear fusion; planets only reflect light from a star",
    definition: "Stars generate their own energy through nuclear fusion and emit light. Planets have no nuclear fusion — they shine by reflecting light from their star.",
    contextSentence: "When you see a planet like Venus shining brightly in the sky, you are seeing reflected sunlight, not Venus's own light.",
    hints: ["The Sun is a star — it makes its own light.", "Planets like Venus shine by bouncing the Sun's light toward us."],
    coach: "A star makes its own light through nuclear fusion in its core. A planet just reflects the light from its nearby star. Venus looks bright in the sky not because it glows — it's reflecting sunlight off its thick clouds!"
  },
  {
    id: "astro-sg-19",
    grade: 0,
    type: "stars-galaxies",
    word: "binary star",
    prompt: "What is a binary star system?",
    choices: [
      "A star with two planets",
      "Two stars that orbit each other",
      "A star that appears double because of a lens effect",
      "A star that explodes twice"
    ],
    answer: "Two stars that orbit each other",
    definition: "A binary star system consists of two stars gravitationally bound to each other, orbiting their common centre of mass.",
    contextSentence: "More than half of all stars in the Milky Way are in binary or multiple star systems.",
    hints: ["'Binary' means two.", "More than half of all stars have a companion star."],
    coach: "A binary star is two stars locked in a gravitational dance, orbiting each other. More than half of all stars in the Milky Way have a companion! If Earth were in a binary system, we'd see two suns in the sky — just like the planet Tatooine in Star Wars!"
  },
  {
    id: "astro-sg-20",
    grade: 0,
    type: "stars-galaxies",
    word: "planetary nebula",
    prompt: "What is a planetary nebula?",
    choices: [
      "A cloud of gas around a newly forming planet",
      "The glowing shell of gas puffed off by a dying Sun-like star",
      "A nebula near all the planets in our solar system",
      "Rings of gas around a gas giant"
    ],
    answer: "The glowing shell of gas puffed off by a dying Sun-like star",
    definition: "A planetary nebula forms when a Sun-like star nears the end of its life, gently expelling its outer layers as a glowing shell, leaving a white dwarf at the centre.",
    contextSentence: "Despite the name, planetary nebulae have nothing to do with planets — early astronomers thought they looked like planets through small telescopes.",
    hints: ["Despite the name, it has nothing to do with planets.", "It is what a Sun-like star leaves behind as it dies."],
    coach: "Planetary nebulae are stunning glowing shells of gas left by dying Sun-like stars. Despite the name (early astronomers thought they looked like planet discs), they are the beautiful death glow of stars. Our Sun will make one in about 5 billion years!"
  },
  {
    id: "astro-sg-21",
    grade: 0,
    type: "stars-galaxies",
    word: "galactic year",
    prompt: "How long does it take our solar system to orbit once around the centre of the Milky Way?",
    choices: ["About 1,000 years", "About 1 million years", "About 225–250 million years", "About 1 billion years"],
    answer: "About 225–250 million years",
    definition: "Our solar system travels around the Milky Way's centre at about 828,000 km/h, completing one orbit roughly every 225–250 million years — called a galactic year.",
    contextSentence: "The last time our solar system was in this position in the Milky Way, dinosaurs were just beginning to walk on Earth.",
    hints: ["It is called a 'galactic year' or 'cosmic year'.", "The last time we were in this spot, dinosaurs were just appearing on Earth."],
    coach: "Our solar system orbits the Milky Way's centre at 828,000 km/h — but the galaxy is so huge it takes 225–250 million years for one lap. That's called a galactic year. The last galactic year ago, dinosaurs were just appearing on Earth!"
  },
  {
    id: "astro-sg-22",
    grade: 0,
    type: "stars-galaxies",
    word: "Orion Nebula",
    prompt: "What is special about the Orion Nebula (M42)?",
    choices: [
      "It is the remains of a star that exploded near Earth",
      "It is a stellar nursery where new stars are actively forming, visible to the naked eye",
      "It is a type of black hole",
      "It is the farthest object visible to the naked eye"
    ],
    answer: "It is a stellar nursery where new stars are actively forming, visible to the naked eye",
    definition: "The Orion Nebula is a giant star-forming region about 1,344 light-years away. It is one of the few nebulae visible without a telescope.",
    contextSentence: "You can see the Orion Nebula as a fuzzy patch in the 'sword' hanging from Orion's belt on a clear night.",
    hints: ["Look for a fuzzy patch in the constellation Orion.", "New stars are being born inside it right now."],
    coach: "The Orion Nebula is a giant cloud of gas and dust 1,344 light-years away where hundreds of new stars are being born right now. Look just below Orion's Belt for the fuzzy middle 'star' in Orion's sword — that fuzzy glow is the nebula, visible to the naked eye!"
  },

  // ── Space Exploration (extra 10) ──────────────────────────────────
  {
    id: "astro-se-16",
    grade: 0,
    type: "space-exploration",
    word: "6 months",
    prompt: "How long do astronauts typically stay on the International Space Station for one mission?",
    choices: ["About 2 weeks", "About 1 month", "About 6 months", "About 2 years"],
    answer: "About 6 months",
    definition: "ISS crew members typically stay for about six months, giving scientists time to study the long-term effects of microgravity on the human body.",
    contextSentence: "During a 6-month stay, an astronaut's body can lose bone density and muscle mass, which is why they exercise for 2 hours every day.",
    hints: ["Astronauts exercise 2 hours a day to counter bone and muscle loss.", "Some missions have lasted over a year as experiments."],
    coach: "ISS astronauts usually stay about 6 months. Living in microgravity weakens bones and muscles because the body doesn't need to work against gravity. That's why astronauts exercise for 2 hours every single day — to stay healthy for their return to Earth!"
  },
  {
    id: "astro-se-17",
    grade: 0,
    type: "space-exploration",
    word: "Laika",
    prompt: "What was the name of the first living creature sent to orbit Earth?",
    choices: ["Laika", "Belka", "Ham", "Enos"],
    answer: "Laika",
    definition: "Laika was a Soviet space dog launched aboard Sputnik 2 on November 3, 1957, becoming the first animal to orbit Earth.",
    contextSentence: "Laika proved that living creatures could survive being launched into space and orbit Earth.",
    hints: ["She was a dog launched by the Soviet Union in 1957.", "Her mission proved living creatures could reach orbit."],
    coach: "Laika was a stray dog from Moscow chosen by Soviet scientists to be the first living creature to orbit Earth in 1957. Her mission showed that animals could survive launch into space, paving the way for human spaceflight."
  },
  {
    id: "astro-se-18",
    grade: 0,
    type: "space-exploration",
    word: "launch window",
    prompt: "What is a 'launch window' in rocketry?",
    choices: [
      "The window astronauts look out of during launch",
      "A specific time period when launching achieves the best path to the mission destination",
      "The hatch through which astronauts enter the rocket",
      "The time between ignition and liftoff"
    ],
    answer: "A specific time period when launching achieves the best path to the mission destination",
    definition: "A launch window is the period of time during which a rocket must launch to reach its destination (such as the ISS or Moon) using the least fuel.",
    contextSentence: "If a rocket misses its launch window, it must wait for the next opportunity, which could be hours, days, or even months away.",
    hints: ["Planets and space stations are always moving.", "Miss it and you have to wait for the next opportunity."],
    coach: "A launch window is the narrow time slot when a rocket must launch to reach its target efficiently. The ISS is moving at 27,000 km/h — you have to launch at just the right moment so the rocket and station meet up in orbit. Miss the window and you wait for the next one!"
  },
  {
    id: "astro-se-19",
    grade: 0,
    type: "space-exploration",
    word: "Crew Dragon",
    prompt: "What was SpaceX's Crew Dragon the first to do, in 2020?",
    choices: [
      "Land on Mars",
      "Be the first US commercial spacecraft to carry NASA astronauts to the ISS",
      "Orbit the Moon",
      "Launch the Hubble Space Telescope"
    ],
    answer: "Be the first US commercial spacecraft to carry NASA astronauts to the ISS",
    definition: "SpaceX Crew Dragon became the first commercially built and operated spacecraft to carry NASA astronauts to the ISS, launching on May 30, 2020.",
    contextSentence: "After the Space Shuttle retired in 2011, the US relied on Russian Soyuz rockets to reach the ISS until Crew Dragon flew in 2020.",
    hints: ["It launched on a Falcon 9 rocket.", "NASA had been paying Russia for rides to the ISS since the Shuttle retired."],
    coach: "SpaceX Crew Dragon launched NASA astronauts Bob Behnken and Doug Hurley to the ISS in 2020 — the first time Americans flew to space from American soil since the Space Shuttle retired in 2011. It was the first commercial crewed spacecraft!"
  },
  {
    id: "astro-se-20",
    grade: 0,
    type: "space-exploration",
    word: "gimbaled engines",
    prompt: "How do rockets steer themselves in space where there is no air to push against?",
    choices: [
      "They use large fins like aircraft",
      "They tilt (gimbal) their rocket engines to direct the thrust and change direction",
      "They use a steering wheel connected to the engines",
      "They cannot steer — they only go straight"
    ],
    answer: "They tilt (gimbal) their rocket engines to direct the thrust and change direction",
    definition: "Rockets steer by gimbaling (tilting) their engines to redirect the thrust vector, which turns the rocket. Small thrusters called RCS jets are used for fine adjustments in space.",
    contextSentence: "Rocket engine gimbaling is like tilting an outboard motor on a boat to steer — just pointing the engine changes direction.",
    hints: ["Think of tilting an outboard motor on a boat to steer it.", "There is no air in space, so fins don't work."],
    coach: "In space there's no air for fins or wings to work. Rockets steer by tilting (gimbaling) their engines so the thrust pushes at an angle. Small thrusters called reaction control system (RCS) jets provide fine adjustments for docking and maneuvering."
  },
  {
    id: "astro-se-21",
    grade: 0,
    type: "space-exploration",
    word: "solid rocket booster",
    prompt: "What is a solid rocket booster (SRB)?",
    choices: [
      "A liquid-fuel engine that powers the main stage",
      "A packed cylinder of solid propellant that provides extra thrust at launch and then falls away",
      "An engine used only in deep space",
      "A booster that can be steered independently"
    ],
    answer: "A packed cylinder of solid propellant that provides extra thrust at launch and then falls away",
    definition: "Solid rocket boosters contain solid propellant and provide extra thrust during the early phase of launch. Once their fuel burns out, they separate from the rocket.",
    contextSentence: "The Space Shuttle used two solid rocket boosters that were recovered from the ocean and reused.",
    hints: ["The Space Shuttle used two of these strapped to its sides.", "They burn solid fuel, like a giant firework."],
    coach: "Solid rocket boosters are like giant fireworks strapped to a rocket — they provide a huge extra push at launch. The Space Shuttle had two SRBs that burned for about 2 minutes, then fell away and were recovered from the ocean to be refurbished and reused!"
  },
  {
    id: "astro-se-22",
    grade: 0,
    type: "space-exploration",
    word: "sleeping bag",
    prompt: "How do astronauts sleep on the International Space Station?",
    choices: [
      "In normal beds with blankets",
      "In sleeping bags attached to the wall, because there is no up or down in microgravity",
      "Sitting in chairs with seatbelts",
      "They cannot sleep in space"
    ],
    answer: "In sleeping bags attached to the wall, because there is no up or down in microgravity",
    definition: "On the ISS, astronauts sleep in small crew quarters and use sleeping bags anchored to the wall. In microgravity, 'up' and 'down' have no meaning.",
    contextSentence: "Astronauts must also wear earplugs because the ISS is quite noisy from the ventilation fans.",
    hints: ["In microgravity there is no up or down, so sleeping on the floor, wall, or ceiling is all the same.", "They attach their sleeping bags to the wall to stay in place."],
    coach: "In microgravity there is no 'floor' — sleeping bags are attached to the wall, floor, or ceiling and it doesn't matter! Astronauts sleep in small private crew quarters and wear ear plugs because the ISS's ventilation fans are surprisingly noisy."
  },
  {
    id: "astro-se-23",
    grade: 0,
    type: "space-exploration",
    word: "heat shield",
    prompt: "Why do spacecraft need heat shields to return to Earth?",
    choices: [
      "To protect from the cold of space",
      "To protect from intense heat caused by friction as they slam through the atmosphere at high speed",
      "To protect from radiation in the Van Allen Belt",
      "To protect from micrometeorites"
    ],
    answer: "To protect from intense heat caused by friction as they slam through the atmosphere at high speed",
    definition: "Heat shields are made of special ablative materials that absorb and carry away the extreme heat generated when a spacecraft re-enters the atmosphere at thousands of km/h.",
    contextSentence: "Orion's heat shield is the largest ever built, designed to withstand temperatures of around 2,760°C.",
    hints: ["Re-entry creates enormous friction with the atmosphere.", "The spacecraft can heat to over 1,600°C — as hot as lava."],
    coach: "Returning spacecraft hit the atmosphere at up to 40,000 km/h, creating temperatures hotter than the Sun's surface. Heat shields are made of special materials (often carbon-based) that char and ablate (burn away) to absorb that heat before it reaches the crew."
  },
  {
    id: "astro-se-24",
    grade: 0,
    type: "space-exploration",
    word: "GPS",
    prompt: "How does GPS (Global Positioning System) know where you are on Earth?",
    choices: [
      "It uses radio towers on the ground",
      "It uses signals from a network of satellites orbiting Earth to calculate your exact position",
      "It uses the Sun's position in the sky",
      "It uses the Earth's magnetic field"
    ],
    answer: "It uses signals from a network of satellites orbiting Earth to calculate your exact position",
    definition: "GPS works by receiving signals from at least 4 of the 31 satellites in the GPS constellation. Your device calculates its position from the tiny differences in the arrival times of those signals.",
    contextSentence: "GPS satellites orbit at about 20,200 km altitude and transmit precise timing signals.",
    hints: ["You need to receive signals from at least 4 satellites.", "GPS satellites orbit at about 20,200 km altitude."],
    coach: "GPS is space technology used every day! A network of 31 satellites orbits Earth at 20,200 km. Your phone receives signals from 4 or more satellites and calculates its location from the tiny differences in signal arrival times — accurate to a few metres!"
  },
  {
    id: "astro-se-25",
    grade: 0,
    type: "space-exploration",
    word: "launch abort system",
    prompt: "What is the launch abort system (LAS) on a crewed spacecraft?",
    choices: [
      "A system that cancels the launch if the weather is bad",
      "Rockets that can pull the crew capsule away from a failing rocket to safety in milliseconds",
      "A parachute system for landing",
      "The fuel that is not used if the mission is cancelled"
    ],
    answer: "Rockets that can pull the crew capsule away from a failing rocket to safety in milliseconds",
    definition: "The launch abort system is a tower of small rockets on top of the crew capsule that can fire to pull the capsule away from a failing rocket in under one second.",
    contextSentence: "The LAS on the Orion capsule can pull the crew to safety in less than a second if the rocket fails during launch.",
    hints: ["It sits on top of the crew capsule like a spike.", "It must react faster than a human can blink."],
    coach: "The launch abort system is a crew escape system — if the rocket starts to fail during launch, small but extremely powerful rockets pull the crew capsule away to safety in under one second. It's never been needed in an actual emergency, but knowing it's there lets astronauts launch with confidence!"
  },

  // ── NASA & KSC (extra 10) ─────────────────────────────────────────
  {
    id: "astro-ksc-19",
    grade: 0,
    type: "nasa-ksc",
    word: "John Glenn",
    prompt: "Who was the first American to orbit Earth, completing three orbits in 1962?",
    choices: ["Alan Shepard", "John Glenn", "Gus Grissom", "Scott Carpenter"],
    answer: "John Glenn",
    definition: "John Glenn orbited Earth three times on February 20, 1962, aboard Friendship 7, becoming a national hero. He later returned to space at age 77.",
    contextSentence: "John Glenn's orbit of Earth proved that American astronauts could match what the Soviets had achieved.",
    hints: ["He flew on the Mercury spacecraft named Friendship 7.", "He also became the oldest person to fly in space at age 77 in 1998."],
    coach: "John Glenn was the first American to orbit Earth in 1962, completing 3 orbits in about 5 hours. He became a national hero! He returned to space in 1998 at age 77 aboard the Space Shuttle — making him the oldest person to fly in space."
  },
  {
    id: "astro-ksc-20",
    grade: 0,
    type: "nasa-ksc",
    word: "Valentina Tereshkova",
    prompt: "Who was the first woman to travel to space?",
    choices: ["Sally Ride", "Valentina Tereshkova", "Christa McAuliffe", "Mae Jemison"],
    answer: "Valentina Tereshkova",
    definition: "Soviet cosmonaut Valentina Tereshkova became the first woman in space on June 16, 1963, orbiting Earth 48 times over nearly three days.",
    contextSentence: "Tereshkova orbited Earth 48 times — more orbits than all US Mercury astronauts combined.",
    hints: ["She was a Soviet cosmonaut, not a NASA astronaut.", "She flew 20 years before the first American woman in space."],
    coach: "Valentina Tereshkova of the Soviet Union was the first woman in space in 1963 — she completed 48 orbits in under 3 days. Sally Ride became the first American woman in space 20 years later in 1983. Today about 15% of NASA's active astronauts are women."
  },
  {
    id: "astro-ksc-21",
    grade: 0,
    type: "nasa-ksc",
    word: "Houston",
    prompt: "Where is NASA's Mission Control that directs human spaceflight missions after launch?",
    choices: ["Cape Canaveral, Florida", "Houston, Texas (Johnson Space Center)", "Huntsville, Alabama", "Washington, D.C."],
    answer: "Houston, Texas (Johnson Space Center)",
    definition: "NASA's Johnson Space Center in Houston hosts Mission Control, where teams direct human spaceflight missions from launch through landing.",
    contextSentence: "The phrase 'Houston, we've had a problem' comes from Apollo 13, calling Mission Control in Houston.",
    hints: ["Apollo 13 called 'Houston, we've had a problem.'", "It is home to NASA's astronaut training facilities."],
    coach: "'Houston, we've had a problem' — the famous Apollo 13 line! The astronauts were calling NASA's Johnson Space Center in Houston, Texas, where Mission Control directs every human spaceflight mission. Johnson Space Center is also where astronauts train for missions."
  },
  {
    id: "astro-ksc-22",
    grade: 0,
    type: "nasa-ksc",
    word: "12",
    prompt: "How many people have walked on the Moon in total?",
    choices: ["3", "6", "12", "24"],
    answer: "12",
    definition: "Twelve astronauts walked on the Moon during six successful Apollo landings (Apollo 11, 12, 14, 15, 16, and 17) between 1969 and 1972.",
    contextSentence: "The last humans to walk on the Moon were Gene Cernan and Harrison Schmitt during Apollo 17 in December 1972.",
    hints: ["Six Apollo missions landed on the Moon.", "Each landing carried two astronauts to the surface."],
    coach: "Twelve astronauts walked on the Moon — two per landing across Apollo 11, 12, 14, 15, 16, and 17. The last person to walk on the Moon was Gene Cernan in December 1972. The Artemis program aims to send the next humans — including the first woman — to the Moon."
  },
  {
    id: "astro-ksc-23",
    grade: 0,
    type: "nasa-ksc",
    word: "Challenger",
    prompt: "What happened to the Space Shuttle Challenger on January 28, 1986?",
    choices: [
      "It successfully completed its first mission",
      "It disintegrated 73 seconds after launch due to a failed O-ring seal",
      "It was damaged on landing and retired",
      "It was struck by a meteorite in orbit"
    ],
    answer: "It disintegrated 73 seconds after launch due to a failed O-ring seal",
    definition: "Space Shuttle Challenger broke apart 73 seconds after launch on January 28, 1986, due to a failed O-ring seal in its right solid rocket booster. All seven crew members were lost.",
    contextSentence: "Teacher Christa McAuliffe was among the seven crew members lost in the Challenger disaster.",
    hints: ["It happened 73 seconds after liftoff.", "A teacher named Christa McAuliffe was on board."],
    coach: "The Space Shuttle Challenger tragedy on January 28, 1986 was one of NASA's darkest days. The shuttle broke apart 73 seconds after launch because a rubber O-ring seal failed in cold weather. All 7 crew members were lost, including teacher Christa McAuliffe. NASA learned vital safety lessons from this tragedy."
  },
  {
    id: "astro-ksc-24",
    grade: 0,
    type: "nasa-ksc",
    word: "Starship",
    prompt: "What is SpaceX's Starship rocket designed to do?",
    choices: [
      "Launch small satellites into low Earth orbit",
      "Carry up to 100 people to the Moon and Mars as a fully reusable spacecraft",
      "Replace the GPS satellite network",
      "Serve as a space station in orbit"
    ],
    answer: "Carry up to 100 people to the Moon and Mars as a fully reusable spacecraft",
    definition: "SpaceX Starship is a massive, fully reusable launch system designed to carry large crews and cargo to the Moon, Mars, and beyond.",
    contextSentence: "Starship is the tallest rocket ever built at about 121 metres — taller than the famous Saturn V.",
    hints: ["At 121 metres, it is even taller than the Saturn V rocket.", "SpaceX intends to use it for NASA's Artemis lunar lander."],
    coach: "Starship is SpaceX's mega-rocket — taller than Saturn V at 121 metres! It's designed to be fully reusable (both stages land and fly again), carry up to 100 people, and eventually take humans to Mars. NASA selected a version of Starship as the Artemis lunar lander!"
  },
  {
    id: "astro-ksc-25",
    grade: 0,
    type: "nasa-ksc",
    word: "6 orbiters",
    prompt: "How many Space Shuttle orbiter vehicles were built by NASA?",
    choices: ["3", "4", "5", "6"],
    answer: "6",
    definition: "NASA built six Space Shuttle orbiters: Enterprise (test only), Columbia, Challenger, Discovery, Atlantis, and Endeavour.",
    contextSentence: "Enterprise was used only for flight tests; Columbia was the first to fly in space in 1981.",
    hints: ["One was used only for landing tests and never went to space.", "Challenger and Columbia were lost in accidents."],
    coach: "Six orbiters were built: Enterprise (atmospheric test only), Columbia (first to fly), Challenger (lost 1986), Discovery, Atlantis, and Endeavour. Discovery, Atlantis, and Endeavour are now on display at museums. You can see Discovery at the Smithsonian near Washington D.C.!"
  },
  {
    id: "astro-ksc-26",
    grade: 0,
    type: "nasa-ksc",
    word: "Buzz Aldrin",
    prompt: "What role did Buzz Aldrin play in the Apollo 11 mission?",
    choices: [
      "He piloted the command module orbiting the Moon",
      "He was the second person to walk on the Moon alongside Neil Armstrong",
      "He was the Mission Control flight director",
      "He designed the Saturn V rocket"
    ],
    answer: "He was the second person to walk on the Moon alongside Neil Armstrong",
    definition: "Buzz Aldrin was the lunar module pilot on Apollo 11. He stepped onto the Moon about 20 minutes after Neil Armstrong, becoming the second human to walk on the Moon.",
    contextSentence: "Buzz Aldrin famously described the lunar landscape as 'magnificent desolation.'",
    hints: ["He stepped onto the Moon about 20 minutes after Neil Armstrong.", "He described the Moon's surface as 'magnificent desolation.'"],
    coach: "Buzz Aldrin was the Lunar Module Pilot on Apollo 11, the second person to walk on the Moon. He stepped out about 20 minutes after Armstrong and described the view as 'magnificent desolation.' The third crew member, Michael Collins, orbited above in the command module the whole time."
  },
  {
    id: "astro-ksc-27",
    grade: 0,
    type: "nasa-ksc",
    word: "Lunar Gateway",
    prompt: "What is the Lunar Gateway?",
    choices: [
      "The hatch astronauts use to exit the Orion capsule on the Moon",
      "A small space station planned to orbit the Moon as a base for lunar and deep-space exploration",
      "A name for the launch pad used for Artemis missions",
      "The Lunar Roving Vehicle used in the Apollo program"
    ],
    answer: "A small space station planned to orbit the Moon as a base for lunar and deep-space exploration",
    definition: "The Lunar Gateway is an international space station planned to orbit the Moon, serving as a staging post for lunar surface missions and future deep-space exploration.",
    contextSentence: "The Lunar Gateway will be built by NASA and international partners, and will support Artemis missions to the lunar surface.",
    hints: ["It is like an ISS, but in lunar orbit instead of Earth orbit.", "It will support Artemis missions to the Moon's surface."],
    coach: "The Lunar Gateway will be a small space station orbiting the Moon — like a pit stop in lunar orbit! Astronauts will travel from Earth to the Gateway, then take a lander down to the surface. It will also serve as a stepping stone for eventual missions to Mars."
  },
  {
    id: "astro-ksc-28",
    grade: 0,
    type: "nasa-ksc",
    word: "Go / No-Go",
    prompt: "What does a 'Go/No-Go poll' mean during a rocket launch countdown?",
    choices: [
      "A public vote on whether to launch",
      "Each team controller reporting whether their system is ready to launch or not",
      "A test of the rocket's steering system",
      "The final countdown from 10 to 0"
    ],
    answer: "Each team controller reporting whether their system is ready to launch or not",
    definition: "A Go/No-Go poll is when the launch director asks each controller team to report their system status. Every team must report 'Go' for the launch to proceed.",
    contextSentence: "If even one critical system is 'No-Go', the launch will be held or scrubbed.",
    hints: ["Every controller team must say 'Go' before launch.", "If any critical team says 'No-Go', the launch is stopped."],
    coach: "Before every launch, the launch director polls every controller team: 'Are you Go or No-Go for launch?' Every single team must say 'Go.' If anyone has a problem — weather, systems, safety — they say 'No-Go' and the launch stops. Safety always comes first!"
  },

  // ── Earth & Space (extra 10) ──────────────────────────────────────
  {
    id: "astro-es-11",
    grade: 0,
    type: "earth-space",
    word: "1 AU",
    prompt: "What is 1 Astronomical Unit (AU)?",
    choices: [
      "The distance from Earth to the Moon",
      "The average distance from Earth to the Sun — about 150 million km",
      "The distance light travels in one year",
      "The diameter of the Milky Way"
    ],
    answer: "The average distance from Earth to the Sun — about 150 million km",
    definition: "One Astronomical Unit (AU) is defined as the average distance between Earth and the Sun — approximately 150 million km — used to measure distances within our solar system.",
    contextSentence: "Jupiter is about 5.2 AU from the Sun; Neptune is about 30 AU away.",
    hints: ["It is used to measure distances within our solar system.", "Jupiter is about 5 of these from the Sun."],
    coach: "1 AU = the average Earth-Sun distance = about 150 million km. It's a convenient unit for describing solar system distances. Jupiter is 5.2 AU from the Sun; Neptune is 30 AU away. Beyond the solar system, astronomers switch to light-years!"
  },
  {
    id: "astro-es-12",
    grade: 0,
    type: "earth-space",
    word: "magnetosphere",
    prompt: "How does Earth's magnetic field protect life on our planet?",
    choices: [
      "It holds the atmosphere in place",
      "It deflects harmful charged particles from the Sun (solar wind) away from Earth",
      "It powers the rotation of Earth",
      "It keeps the Moon in orbit"
    ],
    answer: "It deflects harmful charged particles from the Sun (solar wind) away from Earth",
    definition: "Earth's magnetosphere acts as a shield, deflecting most of the solar wind (a stream of charged particles from the Sun) that would otherwise strip away the atmosphere.",
    contextSentence: "Without Earth's magnetic field, the solar wind would gradually erode the atmosphere, as likely happened on Mars billions of years ago.",
    hints: ["Mars lost much of its atmosphere when its magnetic field weakened.", "The Northern and Southern Lights are caused by particles that do get through near the poles."],
    coach: "Earth's magnetic field is an invisible shield that deflects the solar wind away from our planet. Without it, the solar wind would slowly erode our atmosphere — probably what happened to Mars. The Northern Lights are caused by solar particles that slip through near Earth's magnetic poles!"
  },
  {
    id: "astro-es-13",
    grade: 0,
    type: "earth-space",
    word: "satellite",
    prompt: "What is a satellite?",
    choices: [
      "Only human-made objects launched by rockets",
      "Any object that orbits a larger body — including natural ones like moons and artificial ones like the ISS",
      "A type of telescope",
      "A rocket stage that separates after launch"
    ],
    answer: "Any object that orbits a larger body — including natural ones like moons and artificial ones like the ISS",
    definition: "A satellite is any object that orbits a larger body due to gravity. Natural satellites are moons; artificial satellites are human-made and include communications satellites, weather satellites, and the ISS.",
    contextSentence: "There are over 8,000 active and inactive satellites in orbit around Earth.",
    hints: ["The Moon is a natural satellite of Earth.", "There are over 8,000 objects orbiting Earth made by humans."],
    coach: "A satellite is anything that orbits a larger body. The Moon is Earth's natural satellite. Human-made satellites include GPS satellites, weather satellites, TV satellites, and the ISS. There are now over 8,000 artificial objects orbiting Earth!"
  },
  {
    id: "astro-es-14",
    grade: 0,
    type: "earth-space",
    word: "meteor shower",
    prompt: "What causes a meteor shower?",
    choices: [
      "A comet hitting the Moon, scattering fragments toward Earth",
      "Earth passing through the trail of dust and debris left behind by a comet",
      "A cluster of asteroids breaking apart in the asteroid belt",
      "Solar flares sending particles toward Earth"
    ],
    answer: "Earth passing through the trail of dust and debris left behind by a comet",
    definition: "Meteor showers occur when Earth's orbit crosses a stream of debris (mostly tiny particles) left behind by a comet. These particles burn up as meteors in the atmosphere.",
    contextSentence: "The Perseid meteor shower every August happens when Earth crosses the debris trail of Comet Swift-Tuttle.",
    hints: ["It happens at the same time each year because Earth's orbit is predictable.", "The Perseids in August come from Comet Swift-Tuttle's debris."],
    coach: "Meteor showers happen when Earth plows through a stream of comet debris. The particles burn up in the atmosphere, creating dozens or even hundreds of shooting stars per hour. The Perseid shower in August is one of the best — up to 100 meteors per hour!"
  },
  {
    id: "astro-es-15",
    grade: 0,
    type: "earth-space",
    word: "greenhouse gases",
    prompt: "What is the greenhouse effect on Earth?",
    choices: [
      "The glass walls of plant greenhouses reflecting sunlight",
      "Gases like CO₂ and water vapour trapping heat in Earth's atmosphere, warming the planet",
      "A ring of clouds around Earth reflecting sunlight back to space",
      "The process by which plants produce oxygen"
    ],
    answer: "Gases like CO₂ and water vapour trapping heat in Earth's atmosphere, warming the planet",
    definition: "The greenhouse effect is when atmospheric gases (CO₂, water vapour, methane) absorb outgoing heat from Earth's surface and re-radiate it back, keeping Earth warm enough for life.",
    contextSentence: "Without any greenhouse effect Earth would be about 33°C colder — too cold for most life. Too much causes runaway warming, as seen on Venus.",
    hints: ["It is similar to how glass in a greenhouse traps warmth.", "Without it Earth would be a frozen planet."],
    coach: "The greenhouse effect keeps Earth at a liveable temperature — without any greenhouse gases, Earth would average -18°C! Gases like CO₂ and water vapour act like a blanket, trapping heat. The problem is that too much CO₂ (like on Venus) creates runaway warming."
  },
  {
    id: "astro-es-16",
    grade: 0,
    type: "earth-space",
    word: "400 km",
    prompt: "At roughly what altitude does the International Space Station orbit Earth?",
    choices: ["40 km", "400 km", "4,000 km", "40,000 km"],
    answer: "400 km",
    definition: "The ISS orbits at about 400 km altitude, within a region called low Earth orbit (LEO), completing each orbit in about 90 minutes.",
    contextSentence: "At 400 km altitude, the ISS travels at 7.7 km/s and orbits Earth 16 times per day.",
    hints: ["It is in low Earth orbit (LEO).", "At this height it completes an orbit every 90 minutes."],
    coach: "The ISS orbits at about 400 km up — low enough that Earth still looks big and curved below. At 7.7 km/s it completes an orbit every 90 minutes and sees 16 sunrises and sunsets every day! You can see the ISS from Earth with your naked eye as a bright moving star."
  },
  {
    id: "astro-es-17",
    grade: 0,
    type: "earth-space",
    word: "23 hours 56 minutes",
    prompt: "How long does Earth actually take to complete one full rotation relative to distant stars?",
    choices: ["Exactly 24 hours", "23 hours 56 minutes", "24 hours 6 minutes", "25 hours"],
    answer: "23 hours 56 minutes",
    definition: "Earth's true rotation period (sidereal day) is 23 hours and 56 minutes. The 24-hour solar day is slightly longer because Earth also moves along its orbit, requiring a bit of extra rotation for the Sun to return to the same position.",
    contextSentence: "The extra 4 minutes per day means Earth rotates about 361° per solar day rather than exactly 360°.",
    hints: ["Earth has to rotate slightly more than 360° each solar day because it also moves along its orbit.", "The difference adds up to one full extra rotation per year."],
    coach: "Earth takes 23 hours 56 minutes to rotate 360° (a sidereal day). But we experience a 24-hour solar day because Earth also moves along its orbit, so it needs to rotate a tiny bit extra for the Sun to return to the same spot. Over a year, those extra 4 minutes add up to one whole extra rotation!"
  },
  {
    id: "astro-es-18",
    grade: 0,
    type: "earth-space",
    word: "71%",
    prompt: "What percentage of Earth's surface is covered by water?",
    choices: ["30%", "50%", "71%", "90%"],
    answer: "71%",
    definition: "About 71% of Earth's surface is covered by water — mostly oceans. This is why Earth is often called the 'Blue Planet' and why it looks blue from space.",
    contextSentence: "From space, astronauts can immediately see why Earth is called the Blue Planet — most of it is ocean.",
    hints: ["Astronauts call Earth the 'Blue Planet' for this reason.", "Less than 30% of Earth's surface is land."],
    coach: "About 71% of Earth's surface is water, mostly oceans — that's why Earth looks like a blue marble from space! This abundance of liquid water is one of the things that makes Earth unique in the solar system and perfect for life."
  },
  {
    id: "astro-es-19",
    grade: 0,
    type: "earth-space",
    word: "stratosphere",
    prompt: "What is special about the stratosphere, the layer of atmosphere above the troposphere?",
    choices: [
      "It is where all weather and clouds occur",
      "It contains the ozone layer and is where supersonic aircraft and some weather balloons fly",
      "It is where the ISS orbits",
      "It is mostly water vapour"
    ],
    answer: "It contains the ozone layer and is where supersonic aircraft and some weather balloons fly",
    definition: "The stratosphere extends from about 12 to 50 km altitude. It contains the protective ozone layer and has very little weather disturbance, making it ideal for some aircraft.",
    contextSentence: "The Concorde supersonic airliner flew in the lower stratosphere to avoid turbulence.",
    hints: ["The ozone layer is found here.", "Commercial aircraft fly near the bottom of it."],
    coach: "The stratosphere sits above the weather layer (troposphere) from about 12 to 50 km up. It's very stable with no turbulence — the ozone layer is here, absorbing harmful UV rays. The Concorde supersonic jet flew here to avoid weather. Weather balloons float up into the stratosphere too!"
  },
  {
    id: "astro-es-20",
    grade: 0,
    type: "earth-space",
    word: "Van Allen belts",
    prompt: "What are the Van Allen belts?",
    choices: [
      "Asteroid belts between Earth and the Moon",
      "Zones of energetic charged particles trapped by Earth's magnetic field",
      "Rings of debris around Earth from old satellites",
      "Cloud layers in Earth's upper atmosphere"
    ],
    answer: "Zones of energetic charged particles trapped by Earth's magnetic field",
    definition: "The Van Allen belts are two doughnut-shaped zones of high-energy charged particles trapped by Earth's magnetic field, discovered in 1958 by the Explorer 1 satellite.",
    contextSentence: "Apollo missions had to pass through the Van Allen belts quickly to limit astronauts' radiation exposure.",
    hints: ["They are zones of radiation trapped by Earth's magnetic field.", "Apollo missions had to pass through them on the way to the Moon."],
    coach: "The Van Allen belts are two doughnut-shaped regions of high-energy radiation particles trapped around Earth by our magnetic field. They're mostly harmless at normal altitudes, but Apollo astronauts had to travel through them quickly on the way to the Moon to limit radiation exposure."
  },

  // ── Fun Facts (extra 10) ──────────────────────────────────────────
  {
    id: "astro-ff-11",
    grade: 0,
    type: "fun-fact",
    word: "3.8 cm per year",
    prompt: "The Moon is slowly moving away from Earth — but how fast?",
    choices: ["It is getting closer, not farther", "About 1 mm per year", "About 3.8 cm per year", "About 10 m per year"],
    answer: "About 3.8 cm per year",
    definition: "The Moon moves about 3.8 cm farther from Earth every year due to tidal interactions transferring momentum from Earth's rotation to the Moon's orbit.",
    contextSentence: "Scientists measured the Moon's recession rate precisely using laser reflectors left by Apollo astronauts.",
    hints: ["Laser beams fired at Apollo reflectors on the Moon measure the distance precisely.", "It is roughly the speed at which your fingernails grow."],
    coach: "The Moon moves about 3.8 cm farther from Earth every year — roughly the rate your fingernails grow. Apollo astronauts left mirrors on the Moon, and scientists bounce lasers off them to measure this precisely. Four billion years ago the Moon was much closer — it would have looked enormous in the sky!"
  },
  {
    id: "astro-ff-12",
    grade: 0,
    type: "fun-fact",
    word: "all planets fit between Earth and Moon",
    prompt: "Which surprising fact is true about the distance between Earth and the Moon?",
    choices: [
      "The Sun would fit between Earth and the Moon",
      "All eight planets of our solar system would fit in the gap between Earth and the Moon",
      "Only Earth and Mars would fit in that gap",
      "The distance equals one light-year"
    ],
    answer: "All eight planets of our solar system would fit in the gap between Earth and the Moon",
    definition: "The average distance from Earth to the Moon is about 384,400 km. The combined diameter of all 8 planets is about 380,000 km — just slightly less than that gap.",
    contextSentence: "If you lined up all eight planets side by side, they would almost exactly fill the space between Earth and the Moon.",
    hints: ["The gap is about 384,400 km.", "Add up the diameters of all 8 planets and you get about 380,000 km."],
    coach: "Here's a mind-blowing fact: if you lined up all 8 planets of the solar system side by side, they would fit in the gap between Earth and the Moon — with about 4,000 km to spare! The universe is incredibly vast and most of space is… empty space."
  },
  {
    id: "astro-ff-13",
    grade: 0,
    type: "fun-fact",
    word: "4 million tonnes per second",
    prompt: "How much mass does the Sun lose every second through nuclear fusion and solar wind?",
    choices: ["About 1 kg per second", "About 1,000 tonnes per second", "About 4 million tonnes per second", "About 1 billion tonnes per second"],
    answer: "About 4 million tonnes per second",
    definition: "The Sun converts about 4 million tonnes of mass into energy every second through nuclear fusion (E=mc²), yet it is so massive it will shine for another 5 billion years.",
    contextSentence: "Despite losing 4 million tonnes per second, the Sun has enough mass to keep shining for about 5 more billion years.",
    hints: ["This mass becomes pure energy via E=mc².", "Despite this loss rate, the Sun will shine for 5 more billion years."],
    coach: "The Sun burns 4 million tonnes of mass every second, converting it to energy via Einstein's E=mc². That sounds like a lot — but the Sun is so enormously massive that it can sustain this for 10 billion years total. It's already halfway through its life!"
  },
  {
    id: "astro-ff-14",
    grade: 0,
    type: "fun-fact",
    word: "metallic smell",
    prompt: "What do astronauts report that outer space smells like after a spacewalk?",
    choices: [
      "Fresh air and flowers",
      "Nothing — space has no smell",
      "A burned metal or seared steak smell on their spacesuits",
      "A sweet candy smell"
    ],
    answer: "A burned metal or seared steak smell on their spacesuits",
    definition: "Astronauts returning from spacewalks report that their suits and equipment smell like burned metal, seared steak, or welding fumes — likely from atomic oxygen reacting with materials.",
    contextSentence: "Astronaut Don Pettit described the smell as 'distinct' — like metal and a hot barbecue.",
    hints: ["Astronauts notice it when they bring equipment back inside after a spacewalk.", "Scientists think it is caused by atomic oxygen reacting with the suit materials."],
    coach: "You can't smell space directly (you'd need air!), but astronauts report that equipment brought in from spacewalks smells like burned metal or seared steak. Scientists think atomic oxygen in low Earth orbit reacts with the suit materials, creating the strange smell. Space has a signature scent!"
  },
  {
    id: "astro-ff-15",
    grade: 0,
    type: "fun-fact",
    word: "naked eye",
    prompt: "Can you see the International Space Station with just your eyes (no telescope)?",
    choices: [
      "No, it is too small and far away",
      "Only with binoculars",
      "Yes — it appears as a bright, fast-moving star crossing the sky in a few minutes",
      "Only from the equator"
    ],
    answer: "Yes — it appears as a bright, fast-moving star crossing the sky in a few minutes",
    definition: "The ISS is large enough and reflective enough to appear as a bright moving star visible to the naked eye, traveling across the sky in about 5–6 minutes.",
    contextSentence: "The ISS is one of the brightest objects in the night sky — sometimes brighter than Venus.",
    hints: ["The ISS is the size of a football field, making it reflective enough to see.", "NASA has a free tool called 'Spot the Station' to tell you when to look."],
    coach: "Yes! The ISS moves at 27,000 km/h and crosses the sky in about 5 minutes, visible as a bright, steady (non-blinking) moving star. It can be brighter than Venus! NASA's free 'Spot the Station' website tells you exactly when to look out your window — try it!"
  },
  {
    id: "astro-ff-16",
    grade: 0,
    type: "fun-fact",
    word: "176 Earth days",
    prompt: "On Mercury, a solar day (sunrise to next sunrise) is actually longer than its year. How long is a solar day on Mercury?",
    choices: ["29 Earth days", "88 Earth days", "176 Earth days", "365 Earth days"],
    answer: "176 Earth days",
    definition: "Mercury rotates very slowly — once every 59 Earth days — but it also orbits the Sun in just 88 days. The combination means a solar day on Mercury lasts 176 Earth days, twice its year.",
    contextSentence: "On Mercury, the Sun would appear to sometimes stop and reverse direction in the sky due to its unusual rotation–orbit ratio.",
    hints: ["Mercury's year is 88 Earth days.", "Its solar day is exactly twice as long as its year."],
    coach: "Mercury has a 3:2 spin-orbit resonance — it rotates 3 times for every 2 orbits. This makes its solar day (sunrise to sunrise) 176 Earth days long — twice its year of 88 days! From Mercury's surface the Sun would appear to sometimes briefly reverse direction across the sky!"
  },
  {
    id: "astro-ff-17",
    grade: 0,
    type: "fun-fact",
    word: "taller in space",
    prompt: "What happens to an astronaut's height during a long stay in space?",
    choices: [
      "They shrink because of the pressure in spacesuits",
      "They grow up to 5 cm taller because the spine decompresses without gravity",
      "Their height stays exactly the same",
      "They grow shorter because microgravity compresses the spine"
    ],
    answer: "They grow up to 5 cm taller because the spine decompresses without gravity",
    definition: "Without gravity compressing the spine, the discs between vertebrae expand. Astronauts can grow up to 5 cm taller during long-duration spaceflight, though they return to normal height after returning to Earth.",
    contextSentence: "NASA accounts for this when designing spacesuits — they need to fit both on the ground and in orbit.",
    hints: ["On Earth, gravity compresses the fluid-filled discs in your spine all day.", "NASA has to design spacesuits that fit astronauts who are taller in orbit than on the ground."],
    coach: "In space, with no gravity squishing your spine down, the discs between vertebrae expand — astronauts can grow up to 5 cm taller! NASA designs spacesuits to fit astronauts in their 'space height.' They shrink back to normal soon after returning to Earth's gravity."
  },
  {
    id: "astro-ff-18",
    grade: 0,
    type: "fun-fact",
    word: "more stars than sand",
    prompt: "Which comparison is scientifically accurate?",
    choices: [
      "There are more grains of sand on Earth's beaches than stars in the observable universe",
      "There are more stars in the observable universe than grains of sand on all of Earth's beaches",
      "The number of stars and grains of sand are about equal",
      "Scientists have no way to estimate either number"
    ],
    answer: "There are more stars in the observable universe than grains of sand on all of Earth's beaches",
    definition: "Astronomers estimate there are around 10²⁴ (1 septillion) stars in the observable universe — significantly more than the estimated 7.5×10¹⁸ grains of sand on Earth's beaches.",
    contextSentence: "There are roughly 100 times more stars in the observable universe than grains of sand on all of Earth's beaches combined.",
    hints: ["Astronomers estimate about 1 septillion stars exist.", "That is a '1' followed by 24 zeros."],
    coach: "There are an estimated 1 septillion (10²⁴) stars in the observable universe — that's about 100 times more stars than grains of sand on ALL of Earth's beaches combined. The universe is incomprehensibly huge, and our Sun is just one ordinary star among all of them!"
  },
  {
    id: "astro-ff-19",
    grade: 0,
    type: "fun-fact",
    word: "Pluto's incomplete orbit",
    prompt: "Has Pluto completed even one orbit around the Sun since it was discovered?",
    choices: [
      "Yes — it completed its first orbit in 1980",
      "Yes — it completed its orbit in 2006 when it was reclassified",
      "No — Pluto was discovered in 1930 and won't complete its first orbit until around 2178",
      "Yes — Pluto orbits the Sun once every 50 years"
    ],
    answer: "No — Pluto was discovered in 1930 and won't complete its first orbit until around 2178",
    definition: "Pluto takes 248 Earth years to orbit the Sun. It was discovered in 1930 and won't complete even one orbit since its discovery until approximately 2178.",
    contextSentence: "Pluto's orbit is also elliptical — it sometimes gets closer to the Sun than Neptune.",
    hints: ["Pluto takes 248 Earth years to orbit the Sun once.", "It was discovered in 1930."],
    coach: "Pluto was discovered in 1930 — and it won't finish even one orbit since then until about 2178! Pluto takes 248 Earth years per orbit. It was also technically closer to the Sun than Neptune from 1979 to 1999, because its orbit is tilted and very elliptical."
  },
  {
    id: "astro-ff-20",
    grade: 0,
    type: "fun-fact",
    word: "Titan's methane rain",
    prompt: "What falls as rain on Saturn's moon Titan?",
    choices: ["Water", "Lava", "Liquid methane", "Liquid nitrogen"],
    answer: "Liquid methane",
    definition: "Titan has a thick atmosphere and a weather cycle similar to Earth, but instead of water, liquid methane rains from clouds, fills rivers, and forms lakes on its frigid surface (−179°C).",
    contextSentence: "Titan's methane lakes and rivers make it the only place in the solar system besides Earth with stable liquid on its surface.",
    hints: ["Titan is the only moon with a thick atmosphere.", "The temperature is far too cold for water to be liquid — about −179°C."],
    coach: "Titan is a bizarre moon with actual rivers, lakes, and rain — but made of liquid methane, not water! It's −179°C there, far too cold for water. Titan is the only place besides Earth with stable liquid on its surface. NASA's Dragonfly mission will send a drone to Titan in the 2030s!"
  },

  // ── Astronomy Vocabulary (extra 10) ──────────────────────────────
  {
    id: "astro-voc-13",
    grade: 0,
    type: "astronomy-vocab",
    word: "artificial satellite",
    prompt: "What is an artificial satellite?",
    choices: [
      "A moon that formed naturally around a planet",
      "A human-made object launched into orbit around Earth or another body",
      "A piece of space debris",
      "A telescope floating in space"
    ],
    answer: "A human-made object launched into orbit around Earth or another body",
    definition: "An artificial satellite is any human-made object intentionally placed in orbit. They are used for communications, navigation, weather monitoring, and Earth observation.",
    contextSentence: "There are thousands of active artificial satellites orbiting Earth right now.",
    hints: ["Sputnik 1 was the first one ever launched, in 1957.", "Your GPS and TV broadcasts likely rely on one."],
    coach: "Artificial satellites are human-made objects in orbit — as opposed to natural satellites like moons. The first was Sputnik 1 in 1957. Today there are thousands in orbit used for GPS, internet, weather forecasting, TV, and spying on Earth for scientific purposes!"
  },
  {
    id: "astro-voc-14",
    grade: 0,
    type: "astronomy-vocab",
    word: "thrust",
    prompt: "What is thrust in rocketry?",
    choices: [
      "The weight of the rocket",
      "The forward push force produced by a rocket engine",
      "The drag force on the rocket from air",
      "The fuel load in the rocket"
    ],
    answer: "The forward push force produced by a rocket engine",
    definition: "Thrust is the force produced by a rocket engine that pushes the rocket forward. It works by expelling exhaust gases backwards at high speed (Newton's third law).",
    contextSentence: "The Saturn V rocket produced about 34.5 million newtons of thrust at liftoff — equivalent to 160 million horsepower.",
    hints: ["It is produced by expelling hot gases backwards very fast.", "Newton's third law: every action has an equal and opposite reaction."],
    coach: "Thrust is the push from a rocket engine. It works by Newton's Third Law — expel gas backwards fast, and the rocket gets pushed forward. The Saturn V had 34.5 million newtons of thrust — equivalent to 160 million horsepower!"
  },
  {
    id: "astro-voc-15",
    grade: 0,
    type: "astronomy-vocab",
    word: "payload",
    prompt: "What is the 'payload' of a rocket?",
    choices: [
      "The rocket engines",
      "The fuel tank",
      "The cargo the rocket is delivering to space — astronauts, satellites, or science experiments",
      "The launch pad equipment"
    ],
    answer: "The cargo the rocket is delivering to space — astronauts, satellites, or science experiments",
    definition: "The payload is whatever a rocket is designed to carry to space — it could be a crew capsule, satellite, space telescope, or science cargo.",
    contextSentence: "The payload fairing is the nose cone that protects the payload during launch through the atmosphere.",
    hints: ["It is the reason the rocket is flying in the first place.", "A nose cone called a 'fairing' protects it during launch."],
    coach: "The payload is the 'point' of the mission — whatever you're sending to space. It could be astronauts in a crew capsule, a weather satellite, a space telescope, or cargo for the ISS. The rest of the rocket (engines, tanks, structure) exists purely to deliver the payload!"
  },
  {
    id: "astro-voc-16",
    grade: 0,
    type: "astronomy-vocab",
    word: "solar wind",
    prompt: "What is the solar wind?",
    choices: [
      "Wind from storms on the Sun's surface",
      "Light from the Sun pushing on spacecraft",
      "A continuous stream of charged particles (electrons and protons) flowing outward from the Sun",
      "Heat radiation from the Sun"
    ],
    answer: "A continuous stream of charged particles (electrons and protons) flowing outward from the Sun",
    definition: "The solar wind is a continuous flow of charged particles (mostly electrons and protons) emitted from the Sun's outer atmosphere at speeds of 400–800 km/s.",
    contextSentence: "Solar wind pushes on comet tails, always pointing them away from the Sun regardless of the comet's direction of travel.",
    hints: ["It pushes comet tails away from the Sun.", "Earth's magnetic field deflects most of it."],
    coach: "The solar wind is a constant stream of charged particles blowing outward from the Sun at hundreds of km/s. It pushes comet tails away from the Sun (that's why tails always point away from the Sun, even when the comet is moving away). Earth's magnetic field deflects most solar wind — protecting us!"
  },
  {
    id: "astro-voc-17",
    grade: 0,
    type: "astronomy-vocab",
    word: "lunar phases",
    prompt: "What causes the Moon to appear to change shape (phases) over the course of a month?",
    choices: [
      "The Moon grows and shrinks",
      "Earth's shadow falls on different parts of the Moon",
      "We see different portions of the Moon's sunlit side as it orbits Earth",
      "The Moon rotates to show us different faces"
    ],
    answer: "We see different portions of the Moon's sunlit side as it orbits Earth",
    definition: "Lunar phases occur because as the Moon orbits Earth, we see varying amounts of its sunlit half. The cycle from new moon to full moon and back takes about 29.5 days.",
    contextSentence: "A new moon occurs when the Moon is between Earth and the Sun; a full moon occurs when Earth is between the Moon and Sun.",
    hints: ["Half the Moon is always lit by the Sun; we just see different portions of that half.", "A full lunar cycle takes about 29.5 days."],
    coach: "The Moon doesn't actually change shape — half of it is always lit by the Sun. As the Moon orbits Earth, we see more or less of that lit half. New moon = we see the dark side; full moon = we see the fully lit side. A complete cycle takes 29.5 days — a lunar month!"
  },
  {
    id: "astro-voc-18",
    grade: 0,
    type: "astronomy-vocab",
    word: "apogee and perigee",
    prompt: "What do 'apogee' and 'perigee' mean for an orbit around Earth?",
    choices: [
      "The speed at the start and end of a mission",
      "The farthest and closest points of an orbit around Earth",
      "The launch and landing sites of a spacecraft",
      "Two types of rocket engines"
    ],
    answer: "The farthest and closest points of an orbit around Earth",
    definition: "Perigee is the closest point in an orbit around Earth; apogee is the farthest point. Most orbits are slightly elliptical, not perfectly circular.",
    contextSentence: "The Moon's perigee is about 356,000 km from Earth; its apogee is about 406,000 km — that's why the Moon sometimes looks bigger (supermoon).",
    hints: ["'Peri-' means near; 'ap-' means away from in Greek.", "A 'supermoon' occurs when a full moon coincides with perigee."],
    coach: "Perigee = closest point; apogee = farthest point in an orbit around Earth. (For orbits around the Sun, it's perihelion and aphelion.) A 'supermoon' happens when a full moon coincides with perigee — the Moon is at its closest so it looks bigger and brighter than usual!"
  },
  {
    id: "astro-voc-19",
    grade: 0,
    type: "astronomy-vocab",
    word: "liftoff",
    prompt: "What is 'liftoff' in a rocket launch?",
    choices: [
      "When the launch is cancelled",
      "The moment a rocket's engines produce enough thrust to overcome its weight and it leaves the launch pad",
      "When the rocket reaches orbit",
      "When the rocket separates into stages"
    ],
    answer: "The moment a rocket's engines produce enough thrust to overcome its weight and it leaves the launch pad",
    definition: "Liftoff is the moment a rocket's thrust exceeds its weight (gravity pulling it down) and it begins to rise from the launch pad.",
    contextSentence: "For liftoff, a rocket must produce more thrust than its own weight, which can be millions of kilograms.",
    hints: ["The thrust must exceed the rocket's weight for this to happen.", "It is T-0 in the countdown."],
    coach: "Liftoff happens at the exact moment the rocket's engines produce more thrust than the rocket weighs. For a Saturn V weighing 2.8 million kg, the engines had to push harder than 2.8 million kg-worth of force just to lift off the pad! Once off the pad, the rocket accelerates as it burns fuel and gets lighter."
  },
  {
    id: "astro-voc-20",
    grade: 0,
    type: "astronomy-vocab",
    word: "propulsion",
    prompt: "What does 'propulsion' mean in the context of spaceflight?",
    choices: [
      "The weight of a spacecraft",
      "The system that generates thrust to move a spacecraft through space",
      "The heat shield on a spacecraft",
      "The navigation computers of a rocket"
    ],
    answer: "The system that generates thrust to move a spacecraft through space",
    definition: "Propulsion refers to the means by which a spacecraft produces thrust — chemical rockets, ion engines, solar sails, and nuclear systems are all forms of spacecraft propulsion.",
    contextSentence: "Most rockets today use chemical propulsion, burning liquid or solid fuel to generate thrust.",
    hints: ["It refers to the way the spacecraft generates thrust.", "Chemical rocket engines are the most common type used today."],
    coach: "Propulsion is how a spacecraft moves. Most use chemical propulsion — burning fuel and oxidizer creates hot gas that shoots out the back, pushing the rocket forward. Future propulsion systems may include ion engines (slow but very efficient), nuclear engines, or even solar sails pushed by sunlight!"
  },
  {
    id: "astro-voc-21",
    grade: 0,
    type: "astronomy-vocab",
    word: "launch vehicle",
    prompt: "What is a launch vehicle?",
    choices: [
      "The crawler-transporter that moves rockets to the launch pad",
      "A rocket designed to carry a spacecraft or payload from Earth's surface to space",
      "The capsule that carries astronauts",
      "A vehicle used to recover astronauts after splashdown"
    ],
    answer: "A rocket designed to carry a spacecraft or payload from Earth's surface to space",
    definition: "A launch vehicle is a rocket system used to lift a spacecraft, satellite, or other payload from Earth's surface into space or orbit.",
    contextSentence: "The SLS is NASA's launch vehicle for Artemis missions; Falcon 9 is SpaceX's primary launch vehicle.",
    hints: ["It is the rocket, not the spacecraft that sits on top of it.", "SLS and Falcon 9 are examples."],
    coach: "A launch vehicle is the rocket that gets things to space — it's the engine and fuel system, not the spacecraft itself. The Saturn V was Apollo's launch vehicle; the SLS is Artemis's launch vehicle; Falcon 9 is SpaceX's most-used launch vehicle. Without launch vehicles, nothing gets to space!"
  },
  {
    id: "astro-voc-22",
    grade: 0,
    type: "astronomy-vocab",
    word: "astronomer",
    prompt: "What does an astronomer do?",
    choices: [
      "Designs and builds rockets",
      "Trains astronauts for space missions",
      "Studies stars, planets, galaxies, and other objects and events in the universe",
      "Forecasts space weather for GPS systems"
    ],
    answer: "Studies stars, planets, galaxies, and other objects and events in the universe",
    definition: "An astronomer is a scientist who uses telescopes and other instruments to observe, study, and explain objects and phenomena in the universe.",
    contextSentence: "Modern astronomers often analyse telescope data on computers rather than looking through eyepieces directly.",
    hints: ["The word comes from Greek: 'astron' (star) + 'nomos' (law or arrangement).", "They use telescopes, both on Earth and in space."],
    coach: "Astronomers study everything in the universe — planets, stars, galaxies, black holes, dark matter, and more. Today most astronomers spend their time analysing data from telescopes on computers, not looking through eyepieces. It's one of the oldest sciences, going back thousands of years!"
  }
];
