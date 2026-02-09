import { parse } from '@/core/lib/utils'
import React, { useEffect, useState } from 'react'
import { useAdminSocket } from '../../providers/admin-socket-provider'
import SpeedIntro from './speed-intro'
import Question from './question'
import EnterExit from '@/core/components/derived/enter-exit'
import SpeedCard from '@/core/components/derived/speed-card'

function SpeedQuestion() {
  const { socket } = useAdminSocket()
  const [question, setQuestion] = useState<SpeedQuestion | null>(null)

  useEffect(() => {
    socket?.addEventListener('message', (msg) => {
      const parsed = parse<ServerAdminMessage>(msg.data)
      if (parsed.event === 'view_speed_question') {
        setQuestion(parsed.data.question)
      }
    })
  }, [])

  return (
    <>
      {!question && <SpeedIntro key='intro' />}
      {question && (
        <EnterExit key='card'>
          <SpeedCard
            answers={question.answers}
            question={question.question}
            interactive
          />
        </EnterExit>
      )}
    </>
  )
}

export default SpeedQuestion