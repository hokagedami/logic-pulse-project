import { Injectable } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import lessons from '../../../../public/lessons.json';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  private lessons: Lesson[] = [];

  constructor() {
    this.loadLessons();
  }

  private loadLessons() {
    this.lessons = lessons as Lesson[];
  }

  getLessons(): Lesson[] {
    this.loadLessons();
    return this.lessons;
  }

  getLesson(code: string): Lesson | undefined {
    this.loadLessons();
    return this.lessons.find(l => l.code === code);
  }

  getLessonsCodes() {
    this.loadLessons();
    return this.lessons.map(l => l.code);
  }

  getCurrentLessonIndex(code: string): number {
    this.loadLessons();
    return this.lessons.findIndex(l => l.code === code);
  }

  getNextLesson(currentCode: string): Lesson | null {
    this.loadLessons();
    const currentIndex = this.getCurrentLessonIndex(currentCode);
    if (currentIndex >= 0 && currentIndex < this.lessons.length - 1) {
      return this.lessons[currentIndex + 1];
    }
    return null;
  }

  getPreviousLesson(currentCode: string): Lesson | null {
    this.loadLessons();
    const currentIndex = this.getCurrentLessonIndex(currentCode);
    if (currentIndex > 0) {
      return this.lessons[currentIndex - 1];
    }
    return null;
  }

  hasNextLesson(currentCode: string): boolean {
    return this.getNextLesson(currentCode) !== null;
  }

  hasPreviousLesson(currentCode: string): boolean {
    return this.getPreviousLesson(currentCode) !== null;
  }
}
