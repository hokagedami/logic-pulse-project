import { Component, OnInit } from '@angular/core';
import {LessonContentComponent} from "../lesson-content/lesson-content.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {LessonsService} from "../../../services/lessons/lessons.service";
import {Lesson} from "../../../models/lesson.model";

@Component({
  selector: 'app-tutorial-home',
  standalone: true,
  imports: [
    LessonContentComponent,
    SidebarComponent
  ],
  templateUrl: './tutorial-home.component.html',
  styleUrl: './tutorial-home.component.css'
})
export class TutorialHomeComponent implements OnInit {
  selectedLessonCode: string = '';

  constructor(private lessonsService: LessonsService) {}

  ngOnInit(): void {
    // Set the first lesson as default
    const lessons = this.lessonsService.getLessons();
    if (lessons.length > 0) {
      this.selectedLessonCode = lessons[0].code;
    }
  }

  onLessonChange(lessonCode: string): void {
    this.selectedLessonCode = lessonCode;
  }

  navigateToNext(): void {
    const nextLesson = this.lessonsService.getNextLesson(this.selectedLessonCode);
    if (nextLesson) {
      this.selectedLessonCode = nextLesson.code;
    }
  }

  navigateToPrevious(): void {
    const previousLesson = this.lessonsService.getPreviousLesson(this.selectedLessonCode);
    if (previousLesson) {
      this.selectedLessonCode = previousLesson.code;
    }
  }
}
