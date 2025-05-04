// quiz.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quiz, UserAnswer } from '../../Models/quiz';
import { QuizService } from '../../Services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  quizId!: number;
  userName!: string;
  quiz!: Quiz;
  currentQuestionIndex = 0;
  userAnswers: any = {};
  isSubmitted = false;
  score = 0;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // Match EXACTLY what you defined in your route
      this.quizId = +params['quizId']; // or ['quizId'] if you changed the route
      this.userName = params['userName']; // or ['userName']
      //this.quizId = 1 ;
      //this.userName = "hanyadib404";
      if (isNaN(this.quizId) || !this.userName) {
        console.log(this.quizId);

        console.error('Invalid parameters');
        return;
      }
      this.loadQuiz();
    });
  }

  loadQuiz(): void {
    this.quizService.getQuiz(this.quizId, this.userName).subscribe({
      next: (response) => {
        this.quiz = response.data;
        this.initializeAnswers();
        console.log( this.quiz) ;
      },
      error: (err) => console.error('Error loading quiz:', err),
    });
  }

  initializeAnswers(): void {
    this.quiz.questions.forEach((question) => {
      if (question.type === 'matching') {
        this.userAnswers[question.id] = {};

        const count = question.options?.[0]?.leftItem?.length || 0;

        for (let i = 0; i < count; i++) {
          this.userAnswers[question.id][i] = '';
        }
      } else {
        this.userAnswers[question.id] = null;
      }
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz(): void {
    const payload: UserAnswer = {
      quizId: this.quizId,
      userId: this.quiz.userId,

      answers: [],
    };

    this.quiz.questions.forEach((q) => {
      const answerEntry: any = { questionId: q.id };

      if (q.type === 'true-false' || q.type === 'fill-blank') {
        answerEntry.answerText = this.userAnswers[q.id];
        answerEntry.type = q.type;
      } else if (q.type === 'multiple-choice') {
        answerEntry.selectedOptionId = this.userAnswers[q.id];
        answerEntry.type = q.type;
      } else if (q.type === 'matching') {
        const matchingAnswerMap: { [key: string]: string } = {};
        answerEntry.type = q.type;
        const leftItems = q.options?.[0]?.leftItem || [];

        for (let i = 0; i < leftItems.length; i++) {
          const left = leftItems[i];
          const selectedRight = this.userAnswers[q.id][i];

          matchingAnswerMap[left] = selectedRight || '';
        }

        answerEntry.matchingAnswers = matchingAnswerMap;
      }

      payload.answers.push(answerEntry);
    });
    console.log(payload);
    this.quizService.submitUserAnswers(payload).subscribe({
      next: (res) => {
        this.isSubmitted = true;
        console.log('Answers submitted successfully:', res);
        this.resetQuizState();
      },
      error: (err) => {
        console.error('Error submitting answers:', err);
      },
    });
  }


  resetQuizState(): void {
    // Reset the user answers
    this.userAnswers = {};
  
    // Reset the current question index
    this.currentQuestionIndex = 0;
  
    // Optionally, you can reset other state variables as needed
    this.isSubmitted = false;
  }
}
