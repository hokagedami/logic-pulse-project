

export interface User {
  username: string;
  level: 'easy' | 'medium' | 'hard';
  progress: { easy: number, medium: number, hard: number };
  questionsAnswered: AnsweredQuestion[];
  challengeCompleted: boolean;
}

export interface AnsweredQuestion {
  questionId: number;
  selectedOption: string;
  answerIsCorrect: boolean;
}

// Update 9317
// Update 4926
// Update 8447
// Update 8749
// Update 6665
// Update 6050
// Update 7026
// Update 2137
// Update 2458
// Update 3174
// Update 9766
// Update 9369
// Update 4637
// Update 9403
// Update 5347
// Update 4898
// Update 4846
// Update 5705
// Update 3246
// Update 2579
// Update 9923
// Update 6464
// Update 2428