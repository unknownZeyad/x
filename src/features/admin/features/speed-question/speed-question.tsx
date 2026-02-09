import { parse } from '@/core/lib/utils'
import React, { useEffect, useState } from 'react'
import { useAdminSocket } from '../../providers/admin-socket-provider'
import SpeedIntro from './speed-intro'
import EnterExit from '@/core/components/derived/enter-exit'
import SpeedCard from '@/core/components/derived/speed-card'

function SpeedQuestion() {
  const { socket } = useAdminSocket()
  const [question, setQuestion] = useState<SpeedQuestion | null>(null)
  const [deliveryDate, setDeliveryDate] = useState<number>(0)
  const [winner, setWinner] = useState<string | null>(null)

  useEffect(() => {
    socket?.addEventListener('message', (msg) => {
      const parsed = parse<ServerAdminMessage>(msg.data)
      if (parsed.event === 'view_speed_question') {
        setQuestion(parsed.data.question)
        setDeliveryDate(parsed.data.date)
      }

      if (parsed.event === 'speed_question_winner') {
        setWinner(parsed.data.team_name)
      }
    })
  }, [socket])

  return (
    <div className='relative w-full h-full'>
      {!question && <SpeedIntro key='intro' />}
      {question && (
        <EnterExit key='card'>
          <SpeedCard
            deliveryDate={deliveryDate}
            interactive={false}
            answers={question.answers}
            question={question.question}
            winner={winner}
          />
        </EnterExit>
      )}
    </div>
  )
}

export default SpeedQuestion