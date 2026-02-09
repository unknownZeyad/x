declare type ServerAdminMessage =
  {
    event: 'can_start',
    data: null
  } |
  {
    event: 'experience_started',
    data: null
  } |
  {
    event: 'view_speed_question',
    data: {
      date: number,
      question: SpeedQuestion
    }
  } |
  {
    event: 'clubs_chosen',
    data: {
      team1: {
        choosen_club: Club,
        [key: string]: any
      },
      team2: {
        choosen_club: Club,
        [key: string]: any
      },
      [key: string]: any
    }
  } |
  {
    event: 'speed_question_winner',
    data: {
      team: string,
      team_name: string
    }
  }
