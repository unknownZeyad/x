import EnterExit from '@/core/components/derived/enter-exit'
import SpeedCard from '@/core/components/derived/speed-card'
import { useTeamSocket } from '../../providers/socket-provider'

function SpeedQuestion({
  deliveryDate,
  answers,
  question,
  interactive,
  winner
}: {
  deliveryDate: number,
  answers: {
    is_correct: boolean,
    answer: string,
    id: number
  }[],
  question: string,
  interactive?: boolean,
  winner?: string | null
}) {
  const { socket } = useTeamSocket()

  function onAnswer(ansId: number) {
    socket?.send(JSON.stringify({
      event: 'answer_speed_question',
      data: {
        answer_id: ansId
      }
    }))
  }

  return (
    <EnterExit key='speed_question'>
      <SpeedCard
        deliveryDate={deliveryDate}
        answers={answers}
        question={question}
        onAnswer={onAnswer}
        interactive={interactive}
        winner={winner}
      />
    </EnterExit>
  )
}

export default SpeedQuestion