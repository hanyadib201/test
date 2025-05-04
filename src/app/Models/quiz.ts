// quiz.model.ts
export interface Quiz {
    id: number;
    title: string;
    description: string;
    from: string;
    to: string;
    userId: string;
    imagePath: string;
    questions: Question[];
  }
  
  export interface Question {
    id: number;
    text: string;
    type: 'multiple-choice' | 'true-false' | 'matching' | 'fill-blank';
    correctTextAnswer: string | null;
    options: Option[] | null;
    degree :number;
  }
  
  export interface Option {
    id: number;
    text: string | null;
    isCorrect: boolean | null;
    leftItem: string[] | null;
    rightItem: string[] | null;
  }
  
  export interface OptionCreate {
    text: string;
    isCorrect?: boolean;
    matchingQuestion?: string;
  }
  
  export interface QuestionPostVM {
    id: number;
    text?: string;
    quizId: number;
    type: string;
    correctTextAnswer?: string;
    options?: OptionCreate[];
  }
  export interface UserAnswer {
    quizId: number;
    userId: string;
    answers: {
      questionId: number;
      type : string ;
      answerText?: string;        // for fill-blank, true-false
      selectedOptionId?: string;  // for multiple-choice
      matchingAnswers?: { [key: number]: string }; // for matching questions
    }[];
  }
  