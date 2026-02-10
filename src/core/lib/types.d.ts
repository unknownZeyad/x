declare type Club = {
  logo_img_url: string,
  name_img_url: string,
  id: number,
  name: string
}

declare type TeamID = 'team1' | 'team2'


declare type SpeedQuestion = {
  question: string;
  answers: {
    answer: string;
    is_correct: boolean;
    id: number;
  }[];
}