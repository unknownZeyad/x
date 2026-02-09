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
  } 
