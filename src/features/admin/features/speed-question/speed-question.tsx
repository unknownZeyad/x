import { parse } from '@/core/lib/utils'
import React, { useEffect, useState } from 'react'
import { useAdminSocket } from '../../providers/admin-socket-provider'
import SpeedIntro from './speed-intro'
import Question from './question'

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
      <SpeedIntro />
      {question && <Question key='question' question={question} />}
    </>
  )
}

export default SpeedQuestion