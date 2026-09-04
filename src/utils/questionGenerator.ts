import { DifficultyLevel, GradeNumber, Question, QuestionType } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateNumericDistractors(correct: number, count: number = 3, delta: number = 10): string[] {
  const set = new Set<number>();
  set.add(correct);
  let attempts = 0;

  while (set.size < count + 1 && attempts < 50) {
    attempts++;
    const offset = (Math.random() > 0.5 ? 1 : -1) * getRandomInt(1, Math.max(delta, 3));
    const val = correct + offset;
    if (val >= 0 && val !== correct) {
      set.add(val);
    }
  }

  // Fallbacks if set is not large enough
  let fallback = 1;
  while (set.size < count + 1) {
    if (!set.has(correct + fallback)) set.add(correct + fallback);
    else if (!set.has(Math.max(0, correct - fallback))) set.add(Math.max(0, correct - fallback));
    fallback++;
  }

  const list = Array.from(set).map(n => n.toString());
  return shuffleArray(list);
}

const PAKISTANI_NAMES = ['Ali', 'Ahmed', 'Fatima', 'Ayesha', 'Bilal', 'Zainab', 'Hamza', 'Maryam', 'Usman', 'Sana'];

export function generateQuestion(
  grade: GradeNumber,
  topicId: string,
  difficulty: DifficultyLevel = 'medium'
): Question {
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Default handlers based on topic
  switch (topicId) {
    case 'counting':
    case 'number_blast':
      return generateNumberBlastQuestion(id, grade, difficulty);

    case 'addition':
      return generateAdditionQuestion(id, grade, difficulty);

    case 'subtraction':
      return generateSubtractionQuestion(id, grade, difficulty);

    case 'multiplication':
      return generateMultiplicationQuestion(id, grade, difficulty);

    case 'division':
      return generateDivisionQuestion(id, grade, difficulty);

    case 'fractions':
      return generateFractionQuestion(id, grade, difficulty);

    case 'geometry':
    case 'shapes':
      return generateGeometryQuestion(id, grade, difficulty);

    case 'money':
      return generateMoneyQuestion(id, grade, difficulty);

    case 'time':
      return generateTimeQuestion(id, grade, difficulty);

    case 'patterns':
    case 'puzzles':
      return generatePatternQuestion(id, grade, difficulty);

    case 'word_problems':
      return generateWordProblemQuestion(id, grade, difficulty);

    case 'measurement':
      return generateMeasurementQuestion(id, grade, difficulty);

    default:
      // Fallback to Grade appropriate arithmetic
      return generateAdditionQuestion(id, grade, difficulty);
  }
}

// 1. Number Blast / Number Comparison
export function generateNumberBlastQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  let min = 1;
  let max = 20;

  if (grade === 1) {
    max = difficulty === 'easy' ? 20 : 50;
  } else if (grade === 2) {
    min = 20;
    max = difficulty === 'hard' || difficulty === 'expert' ? 500 : 150;
  } else if (grade === 3) {
    min = 100;
    max = 1000;
  } else {
    min = 500;
    max = 10000;
  }

  const num1 = getRandomInt(min, max);
  let num2 = getRandomInt(min, max);
  while (num2 === num1) {
    num2 = getRandomInt(min, max);
  }

  const isGreater = Math.random() > 0.5;
  const prompt = isGreater ? `Which number is GREATER?` : `Which number is SMALLER?`;
  const correct = isGreater ? Math.max(num1, num2) : Math.min(num1, num2);
  const other = isGreater ? Math.min(num1, num2) : Math.max(num1, num2);

  // For 4 options or 2 options
  let options = [correct.toString(), other.toString()];
  if (difficulty === 'hard' || difficulty === 'expert' || grade >= 3) {
    const num3 = correct + getRandomInt(5, 15);
    const num4 = Math.max(0, correct - getRandomInt(5, 15));
    options = shuffleArray([correct.toString(), other.toString(), num3.toString(), num4.toString()]);
  } else {
    options = shuffleArray(options);
  }

  return {
    id,
    grade,
    topicId: 'counting',
    difficulty,
    type: 'multiple_choice',
    prompt,
    subPrompt: `Compare: ${num1} and ${num2}`,
    options,
    correctAnswer: correct.toString(),
    hint: `Look at the tens and hundreds digits. ${Math.max(num1, num2)} is bigger than ${Math.min(num1, num2)}.`,
    explanation: `${correct} is ${isGreater ? 'greater' : 'smaller'} than ${other}.`,
    visualData: { numbersList: [num1, num2] },
  };
}

// 2. Addition Attack
export function generateAdditionQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  let a = 5;
  let b = 4;

  if (grade === 1) {
    a = difficulty === 'easy' ? getRandomInt(1, 9) : getRandomInt(5, 15);
    b = difficulty === 'easy' ? getRandomInt(1, 9) : getRandomInt(3, 10);
  } else if (grade === 2) {
    a = difficulty === 'easy' ? getRandomInt(10, 40) : getRandomInt(25, 65);
    b = difficulty === 'easy' ? getRandomInt(5, 30) : getRandomInt(15, 35);
  } else if (grade === 3) {
    a = getRandomInt(40, 350);
    b = getRandomInt(20, 250);
  } else if (grade === 4) {
    a = getRandomInt(120, 850);
    b = getRandomInt(150, 950);
  } else {
    // Grade 5: larger or decimals
    if (difficulty === 'hard' || difficulty === 'expert') {
      const decA = (getRandomInt(10, 99) / 10);
      const decB = (getRandomInt(10, 99) / 10);
      const sum = Number((decA + decB).toFixed(1));
      const opts = shuffleArray([
        sum.toFixed(1),
        (sum + 0.2).toFixed(1),
        (sum - 0.3 > 0 ? sum - 0.3 : sum + 1.1).toFixed(1),
        (sum + 1.0).toFixed(1),
      ]);
      return {
        id,
        grade,
        topicId: 'addition',
        difficulty,
        type: 'multiple_choice',
        prompt: `${decA} + ${decB} = ?`,
        options: opts,
        correctAnswer: sum.toFixed(1),
        hint: `Line up the decimal points! Add the tenths first, then the whole numbers.`,
        explanation: `Let's add tenths: ${(decA * 10 % 10)} + ${(decB * 10 % 10)}. Total sum is ${sum.toFixed(1)}.`,
      };
    }
    a = getRandomInt(1200, 8500);
    b = getRandomInt(1100, 6400);
  }

  const sum = a + b;
  const options = generateNumericDistractors(sum, 3, grade <= 2 ? 5 : 20);

  // Friendly step hint
  const tensPart = Math.floor(b / 10) * 10;
  const onesPart = b % 10;
  const hint = tensPart > 0 
    ? `Break ${b} into ${tensPart} + ${onesPart}. First do ${a} + ${tensPart} = ${a + tensPart}, then add ${onesPart}!`
    : `Count forward from ${a} by ${b} steps.`;

  return {
    id,
    grade,
    topicId: 'addition',
    difficulty,
    type: 'multiple_choice',
    prompt: `${a} + ${b} = ?`,
    options,
    correctAnswer: sum.toString(),
    hint,
    explanation: `Let's solve it together: ${a} + ${b} = ${sum}. Well done!`,
  };
}

// 3. Subtraction Shooter
export function generateSubtractionQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  let a = 12;
  let b = 5;

  if (grade === 1) {
    b = getRandomInt(1, 8);
    a = b + (difficulty === 'easy' ? getRandomInt(1, 9) : getRandomInt(5, 12));
  } else if (grade === 2) {
    b = getRandomInt(5, 35);
    a = b + getRandomInt(10, 45);
  } else if (grade === 3) {
    b = getRandomInt(25, 200);
    a = b + getRandomInt(30, 300);
  } else {
    b = getRandomInt(120, 800);
    a = b + getRandomInt(100, 1500);
  }

  const diff = a - b;
  const options = generateNumericDistractors(diff, 3, grade <= 2 ? 4 : 15);

  return {
    id,
    grade,
    topicId: 'subtraction',
    difficulty,
    type: 'multiple_choice',
    prompt: `${a} − ${b} = ?`,
    options,
    correctAnswer: diff.toString(),
    hint: `Think: What number added to ${b} gives ${a}? Or subtract in steps!`,
    explanation: `Let's solve it: ${a} take away ${b} equals ${diff}. (Check: ${diff} + ${b} = ${a}).`,
  };
}

// 4. Multiplication Race
export function generateMultiplicationQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  let a = 3;
  let b = 4;

  if (grade <= 2) {
    // Intro to multiplication (2, 3, 5, 10)
    const tables = [2, 3, 5, 10];
    a = tables[getRandomInt(0, tables.length - 1)];
    b = getRandomInt(1, 10);
  } else if (grade === 3) {
    a = getRandomInt(2, 9);
    b = getRandomInt(2, 10);
  } else if (grade === 4) {
    a = getRandomInt(4, 12);
    b = getRandomInt(6, 12);
  } else {
    // Grade 5
    if (difficulty === 'expert') {
      a = getRandomInt(12, 25);
      b = getRandomInt(11, 20);
    } else {
      a = getRandomInt(7, 15);
      b = getRandomInt(7, 12);
    }
  }

  const product = a * b;
  const options = generateNumericDistractors(product, 3, a);

  return {
    id,
    grade,
    topicId: 'multiplication',
    difficulty,
    type: 'multiple_choice',
    prompt: `${a} × ${b} = ?`,
    options,
    correctAnswer: product.toString(),
    hint: `Multiplication is repeated addition: think of ${b} groups of ${a}!`,
    explanation: `${a} times ${b} equals ${product}. ${a} + ${a} (${b} times) = ${product}.`,
  };
}

// 5. Division Master
export function generateDivisionQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  let divisor = 2;
  let quotient = 4;

  if (grade <= 2) {
    divisor = [2, 3, 4, 5][getRandomInt(0, 3)];
    quotient = getRandomInt(1, 6);
  } else if (grade === 3) {
    divisor = getRandomInt(2, 8);
    quotient = getRandomInt(2, 10);
  } else if (grade === 4) {
    divisor = getRandomInt(3, 12);
    quotient = getRandomInt(4, 12);
  } else {
    divisor = getRandomInt(6, 15);
    quotient = getRandomInt(8, 20);
  }

  const dividend = divisor * quotient;
  const options = generateNumericDistractors(quotient, 3, 3);

  return {
    id,
    grade,
    topicId: 'division',
    difficulty,
    type: 'multiple_choice',
    prompt: `${dividend} ÷ ${divisor} = ?`,
    options,
    correctAnswer: quotient.toString(),
    hint: `Ask yourself: What number times ${divisor} gives ${dividend}? (${divisor} × ? = ${dividend})`,
    explanation: `Because ${divisor} × ${quotient} = ${dividend}, therefore ${dividend} ÷ ${divisor} = ${quotient}.`,
  };
}

// 6. Fraction Match (visual pizza/bars)
export function generateFractionQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  const denominators = grade <= 3 ? [2, 3, 4, 6] : [3, 4, 5, 6, 8, 10];
  const total = denominators[getRandomInt(0, denominators.length - 1)];
  const shaded = getRandomInt(1, total - 1);

  const correct = `${shaded}/${total}`;
  const optionsSet = new Set<string>();
  optionsSet.add(correct);

  // generate reasonable fraction distractors
  if (shaded + 1 < total) optionsSet.add(`${shaded + 1}/${total}`);
  if (shaded - 1 > 0) optionsSet.add(`${shaded - 1}/${total}`);
  optionsSet.add(`${total - shaded}/${total}`);
  optionsSet.add(`${1}/${total}`);

  let options = Array.from(optionsSet).slice(0, 4);
  if (options.length < 4) {
    options.push(`${Math.min(shaded + 2, total)}/${total}`);
  }
  options = shuffleArray(options);

  return {
    id,
    grade,
    topicId: 'fractions',
    difficulty,
    type: 'visual_fraction',
    prompt: `What fraction of the shape is shaded?`,
    subPrompt: `Count shaded parts out of total parts`,
    options,
    correctAnswer: correct,
    hint: `The top number (numerator) is the colored slices (${shaded}). The bottom number (denominator) is total slices (${total}).`,
    explanation: `${shaded} out of ${total} equal parts are shaded, so the fraction is ${correct}.`,
    visualData: {
      fractionTotal: total,
      fractionShaded: shaded,
    },
  };
}

// 7. Shape Hunter & Geometry
export function generateGeometryQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  if (grade >= 4 && (difficulty === 'hard' || difficulty === 'expert')) {
    // Perimeter or Area question
    const isArea = Math.random() > 0.5;
    const length = getRandomInt(3, 9);
    const width = getRandomInt(2, 6);
    if (isArea) {
      const area = length * width;
      const options = generateNumericDistractors(area, 3, 6);
      return {
        id,
        grade,
        topicId: 'geometry',
        difficulty,
        type: 'multiple_choice',
        prompt: `Find the AREA of a rectangle with length ${length} cm and width ${width} cm.`,
        options: options.map(o => `${o} sq cm`),
        correctAnswer: `${area} sq cm`,
        hint: `Area = Length × Width. Multiply ${length} by ${width}.`,
        explanation: `Area = ${length} × ${width} = ${area} sq cm.`,
      };
    } else {
      const perim = 2 * (length + width);
      const options = generateNumericDistractors(perim, 3, 5);
      return {
        id,
        grade,
        topicId: 'geometry',
        difficulty,
        type: 'multiple_choice',
        prompt: `Find the PERIMETER of a rectangle with length ${length} cm and width ${width} cm.`,
        options: options.map(o => `${o} cm`),
        correctAnswer: `${perim} cm`,
        hint: `Perimeter is the total boundary: 2 × (Length + Width). Add all 4 sides!`,
        explanation: `Perimeter = ${length} + ${width} + ${length} + ${width} = ${perim} cm.`,
      };
    }
  }

  // Visual Shape identification
  const shapes: Array<{ name: string; type: 'circle' | 'square' | 'rectangle' | 'triangle' | 'pentagon' | 'hexagon' | 'octagon'; sides: number }> = [
    { name: 'Circle', type: 'circle', sides: 0 },
    { name: 'Square', type: 'square', sides: 4 },
    { name: 'Rectangle', type: 'rectangle', sides: 4 },
    { name: 'Triangle', type: 'triangle', sides: 3 },
    { name: 'Pentagon', type: 'pentagon', sides: 5 },
    { name: 'Hexagon', type: 'hexagon', sides: 6 },
    { name: 'Octagon', type: 'octagon', sides: 8 },
  ];

  const pool = grade <= 2 ? shapes.slice(0, 4) : shapes;
  const picked = pool[getRandomInt(0, pool.length - 1)];

  const isSidesQuestion = Math.random() > 0.5 && picked.sides > 0;
  if (isSidesQuestion) {
    const options = generateNumericDistractors(picked.sides, 3, 2);
    return {
      id,
      grade,
      topicId: 'geometry',
      difficulty,
      type: 'shape_detect',
      prompt: `How many sides does a ${picked.name} have?`,
      options,
      correctAnswer: picked.sides.toString(),
      hint: `Count the straight edges of a ${picked.name}.`,
      explanation: `A ${picked.name} has exactly ${picked.sides} sides!`,
      visualData: { shape: picked.type },
    };
  }

  const distractors = pool.filter(s => s.name !== picked.name).map(s => s.name);
  const options = shuffleArray([picked.name, ...shuffleArray(distractors).slice(0, 3)]);

  return {
    id,
    grade,
    topicId: 'geometry',
    difficulty,
    type: 'shape_detect',
    prompt: `Which shape is shown on the screen?`,
    options,
    correctAnswer: picked.name,
    hint: picked.sides === 0 ? `It is completely round with no corners.` : `Count its ${picked.sides} sides and corners!`,
    explanation: `This shape has ${picked.sides === 0 ? 'no straight sides' : `${picked.sides} sides`}, so it is a ${picked.name}.`,
    visualData: { shape: picked.type },
  };
}

// 8. Money Master (Pakistani Currency: Rs.)
export function generateMoneyQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  const name = PAKISTANI_NAMES[getRandomInt(0, PAKISTANI_NAMES.length - 1)];
  const notes = [10, 20, 50, 100, 500, 1000];

  if (grade <= 2) {
    // Simple adding notes or price
    const note1 = notes[getRandomInt(0, 2)];
    const note2 = notes[getRandomInt(0, 2)];
    const total = note1 + note2;
    const options = generateNumericDistractors(total, 3, 10).map(v => `Rs. ${v}`);
    return {
      id,
      grade,
      topicId: 'money',
      difficulty,
      type: 'money_calc',
      prompt: `${name} has a Rs. ${note1} note and a Rs. ${note2} note. How much total money does ${name} have?`,
      options,
      correctAnswer: `Rs. ${total}`,
      hint: `Add Rs. ${note1} and Rs. ${note2} together.`,
      explanation: `Rs. ${note1} + Rs. ${note2} = Rs. ${total}.`,
      visualData: { rupeeNotes: [note1, note2] },
    };
  }

  // Shopping & Change (Grade 3 - 5)
  let wallet = 100;
  if (grade === 3) wallet = [50, 100, 200][getRandomInt(0, 2)];
  else if (grade === 4) wallet = [100, 200, 500][getRandomInt(0, 2)];
  else wallet = [500, 1000][getRandomInt(0, 1)];

  const spend = getRandomInt(1, Math.floor(wallet / 10) - 1) * 10 + (grade <= 3 ? 0 : getRandomInt(1, 9));
  const change = wallet - spend;
  const options = generateNumericDistractors(change, 3, 15).map(v => `Rs. ${v}`);

  const items = ['a notebook', 'a geometry box', 'a story book', 'a cricket ball', 'a lunch box'];
  const item = items[getRandomInt(0, items.length - 1)];

  return {
    id,
    grade,
    topicId: 'money',
    difficulty,
    type: 'money_calc',
    prompt: `If ${name} has Rs. ${wallet} and spends Rs. ${spend} to buy ${item}, how much money is left?`,
    options,
    correctAnswer: `Rs. ${change}`,
    hint: `Subtract the cost from total money: Rs. ${wallet} − Rs. ${spend}.`,
    explanation: `Rs. ${wallet} − Rs. ${spend} = Rs. ${change}. ${name} has Rs. ${change} remaining!`,
    visualData: { itemPrice: spend, paidAmount: wallet },
  };
}

// 9. Time Challenge (Analog Clock)
export function generateTimeQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  const hours = getRandomInt(1, 12);
  let minutes = 0;

  if (grade === 1) {
    // exact hours (o'clock)
    minutes = 0;
  } else if (grade === 2) {
    // half past or o'clock
    minutes = Math.random() > 0.5 ? 0 : 30;
  } else if (grade === 3) {
    // quarter hours (0, 15, 30, 45)
    minutes = [0, 15, 30, 45][getRandomInt(0, 3)];
  } else {
    // 5 minute intervals or any minute
    minutes = getRandomInt(0, 11) * 5;
  }

  const formatTime = (h: number, m: number) => {
    const formattedMinutes = m < 10 ? `0${m}` : `${m}`;
    return `${h}:${formattedMinutes}`;
  };

  const correctTime = formatTime(hours, minutes);

  // Generate believable wrong clock readings
  const distractors = new Set<string>();
  distractors.add(correctTime);

  // Wrong hour
  distractors.add(formatTime(((hours % 12) + 1), minutes));
  distractors.add(formatTime((hours === 1 ? 12 : hours - 1), minutes));
  // Wrong minutes
  distractors.add(formatTime(hours, (minutes + 15) % 60));
  distractors.add(formatTime(hours, (minutes + 30) % 60));

  const options = shuffleArray(Array.from(distractors).slice(0, 4));

  let naturalHint = `Short hand points to ${hours}. `;
  if (minutes === 0) naturalHint += `Long hand points to 12, which means exact hour (:00).`;
  else if (minutes === 30) naturalHint += `Long hand points to 6, which means 30 minutes.`;
  else naturalHint += `Long hand counts by 5s for each number (at ${minutes / 5} = ${minutes} mins).`;

  return {
    id,
    grade,
    topicId: 'time',
    difficulty,
    type: 'analog_clock',
    prompt: `What time is shown on the analog clock?`,
    options,
    correctAnswer: correctTime,
    hint: naturalHint,
    explanation: `The hour hand is at ${hours} and the minute hand is at ${minutes} minutes. The time is ${correctTime}.`,
    visualData: {
      clockHours: hours,
      clockMinutes: minutes,
    },
  };
}

// 10. Number Puzzle / Patterns
export function generatePatternQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  const step = grade === 1 ? getRandomInt(1, 3) : grade <= 3 ? getRandomInt(2, 5) : getRandomInt(3, 12);
  const start = getRandomInt(1, 20);

  const seq = [start, start + step, start + step * 2, start + step * 3];
  const next = start + step * 4;

  const prompt = `${seq.join(', ')}, ?`;
  const options = generateNumericDistractors(next, 3, step * 2);

  return {
    id,
    grade,
    topicId: 'patterns',
    difficulty,
    type: 'pattern_puzzle',
    prompt: `Find the next number in the pattern:`,
    subPrompt: prompt,
    options,
    correctAnswer: next.toString(),
    hint: `Notice how much the numbers increase each time! (${seq[1]} − ${seq[0]} = ${step}).`,
    explanation: `Each number increases by adding ${step}. So ${seq[3]} + ${step} = ${next}.`,
  };
}

// 11. Word Problems (Pakistani primary context)
export function generateWordProblemQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  const name1 = PAKISTANI_NAMES[getRandomInt(0, 4)];
  const name2 = PAKISTANI_NAMES[getRandomInt(5, 9)];

  if (grade <= 3) {
    // Mangoes / cricket runs problem
    const num1 = getRandomInt(12, 45);
    const num2 = getRandomInt(8, 30);
    const sum = num1 + num2;
    const options = generateNumericDistractors(sum, 3, 5);

    return {
      id,
      grade,
      topicId: 'word_problems',
      difficulty,
      type: 'word_problem',
      prompt: `${name1} picked ${num1} sweet mangoes from the orchard, and ${name2} picked ${num2} mangoes. How many mangoes do they have in all?`,
      options,
      correctAnswer: sum.toString(),
      hint: `“In all” means addition. Combine ${num1} and ${num2}.`,
      explanation: `${num1} + ${num2} = ${sum} mangoes in total!`,
    };
  } else {
    // Sharing cricket balls or packs
    const packs = getRandomInt(4, 8);
    const perPack = getRandomInt(6, 12);
    const total = packs * perPack;
    const options = generateNumericDistractors(total, 3, packs);

    return {
      id,
      grade,
      topicId: 'word_problems',
      difficulty,
      type: 'word_problem',
      prompt: `A teacher buys ${packs} boxes of pencils for students in Class ${grade}. Each box contains ${perPack} pencils. How many pencils did the teacher buy in total?`,
      options,
      correctAnswer: total.toString(),
      hint: `Multiply number of boxes by pencils in each box: ${packs} × ${perPack}.`,
      explanation: `${packs} boxes × ${perPack} pencils = ${total} pencils.`,
    };
  }
}

// 12. Measurement
export function generateMeasurementQuestion(id: string, grade: GradeNumber, difficulty: DifficultyLevel): Question {
  if (grade <= 2) {
    const isLonger = Math.random() > 0.5;
    const l1 = getRandomInt(4, 12);
    const l2 = l1 + getRandomInt(2, 6);
    const correct = isLonger ? `${l2} cm pencil` : `${l1} cm eraser`;
    const wrong = isLonger ? `${l1} cm eraser` : `${l2} cm pencil`;
    return {
      id,
      grade,
      topicId: 'measurement',
      difficulty,
      type: 'multiple_choice',
      prompt: `Which item is ${isLonger ? 'LONGER' : 'SHORTER'}?`,
      options: shuffleArray([correct, wrong]),
      correctAnswer: correct,
      hint: `${l2} cm is bigger than ${l1} cm.`,
      explanation: `${l2} cm is longer than ${l1} cm.`,
    };
  }

  // Conversion: meters to cm or kg to grams
  const isMeters = Math.random() > 0.5;
  if (isMeters) {
    const m = getRandomInt(2, 8);
    const cm = m * 100;
    const options = generateNumericDistractors(cm, 3, 100).map(v => `${v} cm`);
    return {
      id,
      grade,
      topicId: 'measurement',
      difficulty,
      type: 'multiple_choice',
      prompt: `How many centimeters are there in ${m} meters? (1 meter = 100 cm)`,
      options,
      correctAnswer: `${cm} cm`,
      hint: `Multiply ${m} by 100!`,
      explanation: `1 meter = 100 cm. Therefore, ${m} meters = ${m} × 100 = ${cm} cm.`,
    };
  } else {
    const kg = getRandomInt(2, 6);
    const g = kg * 1000;
    const options = generateNumericDistractors(g, 3, 500).map(v => `${v} g`);
    return {
      id,
      grade,
      topicId: 'measurement',
      difficulty,
      type: 'multiple_choice',
      prompt: `How many grams are there in ${kg} kilograms? (1 kg = 1000 g)`,
      options,
      correctAnswer: `${g} g`,
      hint: `Multiply ${kg} by 1000.`,
      explanation: `1 kg = 1000 grams. So ${kg} kg = ${kg} × 1000 = ${g} grams.`,
    };
  }
}

export function generateQuestionSet(
  grade: GradeNumber,
  topicId: string,
  count: number = 10,
  difficulty: DifficultyLevel = 'medium'
): Question[] {
  const topicsPool = topicId === 'all' || topicId === 'mixed'
    ? ['counting', 'addition', 'subtraction', 'multiplication', 'division', 'fractions', 'geometry', 'time', 'money', 'patterns']
    : [topicId];

  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const t = topicsPool[i % topicsPool.length];
    const q = generateQuestion(grade, t, difficulty);
    // Ensure aliases
    q.question = q.prompt;
    q.context = q.subPrompt;
    if (q.visualData) {
      if (q.visualData.clockHours !== undefined && q.visualData.hours === undefined) {
        q.visualData.hours = q.visualData.clockHours;
      }
      if (q.visualData.clockMinutes !== undefined && q.visualData.minutes === undefined) {
        q.visualData.minutes = q.visualData.clockMinutes;
      }
      if (q.visualData.fractionTotal !== undefined && q.visualData.total === undefined) {
        q.visualData.total = q.visualData.fractionTotal;
      }
      if (q.visualData.fractionShaded !== undefined && q.visualData.shaded === undefined) {
        q.visualData.shaded = q.visualData.fractionShaded;
      }
    }
    questions.push(q);
  }
  return questions;
}

