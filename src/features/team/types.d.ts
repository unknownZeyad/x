declare type MainQuestion = {
  id: number;
  img_url: string;
  points: number;
  question: string;
  audio_url: string,
  answers: {
    answer: string;
    is_correct: boolean;
    id: number;
  }[];
};

declare type MagicQuestion = {
  question: string;
  answers: {
    answer: string;
    is_correct: boolean;
    id: number;
  }[];
};

declare type ServerTeamMessage =
  | {
    event: "experience_started";
    data: null;
  }
  | {
    event: "your_team";
    data: {
      name: string;
      score: number;
      won_phase1: boolean;
      used_magic_card: boolean;
      choosen_club: Club | null;
    };
  }
  | {
    event: "view_speed_question";
    data: {
      date: number;
      question: {
        audio_url: string,
        question: string;
        answers: {
          answer: string;
          is_correct: boolean;
          id: number;
        }[];
      };
    };
  }
  | {
    event: "speed_question_winner";
    data: {
      team: string;
      team_name: string;
    };
  }
  | {
    event: "list_main_questions";
    data: {
      hold: boolean;
      questions: MainQuestion[];
    };
  }
  | {
    event: "magic_card_question";
    data: {
      question: MagicQuestion;
    };
  }
  | {
    event: "winner";
    data: null;
  }
  | {
    event: "view_clubs";
    data: {
      clubs: Club[];
      hold: boolean;
    };
  }
  | {
    event: "unhold_choosing_club";
    data: {
      choosen_club_id: number;
    };
  }
  | {
    event: "unhold_choosing_main_question";
    data: {
      choosen_questions_ids: number[];
    };
  };
