import fs from 'fs';
import { faker } from '@faker-js/faker';

/**
 * @typedef {('multiple' | 'boolean')} QuestionType
 */

/**
 * @typedef {('easy' | 'medium' | 'hard')} QuestionDifficulty
 */

const OPEN_TRIVIA_DB_API = 'https://opentdb.com/api.php';
const AMOUNT = 50;
/** @type QuestionDifficulty[] */
const DIFFICULTY = ['easy', 'medium', 'hard'];
/** @type QuestionType[] */
const TYPE = ['multiple', 'boolean'];
const CATEGORY = {
  GENERAL_KNOWLEDGE: 9,
  'ENTERTAINMENT.BOOKS': 10,
  'ENTERTAINMENT.FILM': 11,
  'ENTERTAINMENT.MUSIC': 12,
  'ENTERTAINMENT.MUSICALS_THEATRES': 13,
  'ENTERTAINMENT.TELEVISION': 14,
  'ENTERTAINMENT.VIDEO_GAMES': 15,
  'ENTERTAINMENT.BOARD_GAMES': 16,
  'SCIENCE.NATURE': 17,
  'SCIENCE.COMPUTERS': 18,
  'SCIENCE.MATHEMATICS': 19,
  MYTHOLOGY: 20,
  SPORTS: 21,
  GEOGRAPHY: 22,
  HISTORY: 23,
  POLITICS: 24,
  ART: 25,
  CELEBRITIES: 26,
  ANIMALS: 27,
  VEHICLES: 28,
  'ENTERTAINMENT.COMICS': 29,
  'SCIENCE.GADGETS': 30,
  'ENTERTAINMENT.JAPANESE_ANIME_&_MANGA': 31,
  'ENTERTAINMENT.CARTOON_ANIMATIONS': 32,
};

const ENTITY_REPLACERS = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': "'", // double quote to single quote
  '&#039;': "'", // single quote
  '&ouml;': 'ö',
  '&Ouml;': 'Ö',
  '&auml;': 'ä',
  '&Auml;': 'Ä',
  '&uuml;': 'ü',
  '&Uuml;': 'Ü',
  '&szlig;': 'ß',
  '&eacute;': 'é',
  '&Eacute;': 'É',
  '&iacute;': 'í',
  '&Iacute;': 'Í',
  '&ntilde;': 'ñ',
  '&Ntilde;': 'Ñ',
  '&aacute;': 'á',
  '&Aacute;': 'Á',
  '&euml;': 'ë',
  '&Euml;': 'Ë',
};

/**
 * @typedef {Object} OpenTDbQuestion
 * @property {string} category
 * @property {QuestionType} type
 * @property {QuestionDifficulty} difficulty
 * @property {string} question
 * @property {string} correct_answer
 * @property {string[]} incorrect_answers
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} category
 * @property {QuestionType} type
 * @property {QuestionDifficulty} difficulty
 * @property {string} question
 * @property {string} correct_answer
 * @property {string[]} incorrect_answers
 *
 */

/**
 * @description Fetch questions from opentdb.com and save to seed.json
 * @returns {Promise<void>}
 */
async function seed() {
  const categoryValues = Object.values(CATEGORY);
  const params = categoryValues.map(category => {
    const url = new URL(OPEN_TRIVIA_DB_API);
    const params = [];
    for (const difficulty of DIFFICULTY) {
      for (const type of TYPE) {
        url.searchParams.set('amount', AMOUNT);
        url.searchParams.set('category', category);
        url.searchParams.set('difficulty', difficulty);
        url.searchParams.set('type', type);
        params.push(fetch(url));
      }
    }
    return params.flat(Infinity);
  });

  const flattenParams = params.flat(Infinity);

  const responses = await Promise.allSettled(flattenParams);
  const fullfilled = responses.filter(
    response => response.status === 'fulfilled'
  );

  /**
   * @type {OpenTDbQuestion[][]}
   */
  const data = [];
  const urlWithoutExpectedDataLength = [];
  for (const response of fullfilled) {
    const json = await response.value.json();
    if (json.results.length < AMOUNT) {
      urlWithoutExpectedDataLength.push({
        url: response.value.url,
        size: json.results.length,
      });
    }
    data.push(json.results);
  }

  const errors = responses
    .filter(response => response.status === 'rejected')
    .map(response => response.reason);

  if (errors.length) console.log(errors);

  /**
   * @type {Question[]}
   */
  const flattenData = data.flat(Infinity).map(questionObj => {
    const { category, question, correct_answer, incorrect_answers } =
      questionObj;

    const splittedCategory = category
      .split(':')
      .map(str => str.trim().replaceAll(' ', '_').toLowerCase());

    const replacedQuestion = Object.entries(ENTITY_REPLACERS).reduce(
      (acc, [key, value]) => acc.replaceAll(key, value),
      question
    );

    const replacedCorrectAnswer = Object.entries(ENTITY_REPLACERS).reduce(
      (acc, [key, value]) => acc.replaceAll(key, value),
      correct_answer
    );

    const replacedIncorrectAnswers = incorrect_answers.map(incorrect_answer =>
      Object.entries(ENTITY_REPLACERS).reduce(
        (acc, [key, value]) => acc.replaceAll(key, value),
        incorrect_answer
      )
    );

    return {
      ...questionObj,
      id: faker.string.uuid(),
      category: splittedCategory.join('.'),
      question: replacedQuestion,
      correct_answer: replacedCorrectAnswer,
      incorrect_answers: replacedIncorrectAnswers,
    };
  });

  // data with less than {AMOUNT} questions
  const notCompleteData = urlWithoutExpectedDataLength.map(url => {
    const newUrl = new URL(url.url);
    const searchParams = new URLSearchParams(newUrl.search);

    const categoryName = Object.entries(CATEGORY)
      .find(([_, value]) => {
        return value === Number(searchParams.get('category'));
      })[0]
      .toLowerCase();

    return {
      ...url,
      categoryName,
      searchParams: Object.fromEntries(searchParams),
    };
  });

  const results = {
    questions: flattenData,
  };

  if (!fs.existsSync('./db')) {
    fs.mkdirSync('./db');
    console.log('created db directory');
  }

  fs.writeFileSync('./db/db.json', JSON.stringify(results));
  console.log('created db.json');

  fs.writeFileSync(
    './seed/not-complete-data.json',
    JSON.stringify(notCompleteData)
  );
  console.log('created not-complete-data.json');
}

await seed();
