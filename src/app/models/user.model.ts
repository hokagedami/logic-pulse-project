

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