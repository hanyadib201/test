// quiz.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, UserAnswer } from '../Models/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
 // private apiUrl = 'https://localhost:44363/api/Quizzes/QuizId';
  private apiUrl = 'https://hanyadib606.bsite.net/api/Quizzes/QuizId';

  constructor(private http: HttpClient) { }
  getQuiz(quizId: number, userName: string): Observable<any> {
    // Use the apiUrl you already defined
    const url = new URL(this.apiUrl);
    url.searchParams.append('Id', quizId.toString());
    url.searchParams.append('UserName', encodeURIComponent(userName));
    
    console.log('Final API URL:', url.toString()); // Debugging
    
    return this.http.get<{ data: Quiz }>(url.toString());
  }

  submitUserAnswers(data: UserAnswer) {
    return this.http.post('https://hanyadib606.bsite.net/api/UserAnswers', data);
  }
  getQuestionsWithAnswers(quizId: number) {
    return this.http.get(`https://hanyadib606.bsite.net/api/UserAnswers?QuizId=${quizId}`);
  }
}