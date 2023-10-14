const category = [
  'general_knowledge',
  'entertainment.books',
  'entertainment.film',
  'entertainment.music',
  'entertainment.music_theatre',
  'entertainment.television',
  'entertainment.video_games',
  'entertainment.board_games',
  'entertainment.comics',
  'entertainment.cartoon_animations',
  'entertainment.japanese_anime_&_manga',
  'science.computers',
  'science.mathematics',
  'science.gadgets',
  'science.nature',
  'mythology',
  'sports',
  'geography',
  'history',
  'politics',
  'art',
  'celebreties',
  'animals',
  'vehicles',
] as const;

const booleanAnswers = ['True', 'False'] as const;
const difficulty = ['easy', 'medium', 'hard'] as const;
const questionType = ['multiple', 'boolean'] as const;

export type BooleanAnswer = (typeof booleanAnswers)[number];
export type Category = (typeof category)[number];
export type Difficulty = (typeof difficulty)[number];
export type QuestionType = (typeof questionType)[number];

export interface QuestionBase {
  category: Category;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface MultipleQuestion extends QuestionBase {
  type: 'multiple';
  correct_answer: string;
  incorrect_answers: [string, string, string];
}

export interface QuestionBooleanTrue extends QuestionBase {
  type: 'boolean';

  correct_answer: 'True';
  incorrect_answers: ['False'];
}

export interface QuestionBooleanFalse extends QuestionBase {
  type: 'boolean';

  correct_answer: 'False';
  incorrect_answers: ['True'];
}

export type Question =
  | MultipleQuestion
  | QuestionBooleanTrue
  | QuestionBooleanFalse;
