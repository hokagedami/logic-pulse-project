import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../../models/question.model';
import questions from '../../../../public/questions.json';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] = [];

  constructor() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questions = questions as Question[];
  }

  getQuestions(level: 'easy' | 'medium' | 'hard', answered: number []): Question[] {
    this.loadQuestions();
    return this.questions
      .filter(q => q.level === level && !answered.includes(q.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 20 - answered.length);
  }
}
