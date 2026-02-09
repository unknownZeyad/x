import { parse } from '@/core/lib/utils'
import React, { useEffect, useState } from 'react'
import { useAdminSocket } from '../../providers/admin-socket-provider'
import SpeedIntro from './speed-intro'
import EnterExit from '@/core/components/derived/enter-exit'
import SpeedCard from '@/core/components/derived/speed-card'
import GameButton from '@/core/components/derived/game-button'
import ContentLayout from '@/core/components/layout/content-layout'
import SpeedWinnerCard from '@/core/components/derived/speed-winner-card'
import { AnimatePresence } from 'motion/react'
import person from '@public/assets/images/person.png'
import { useAdminPhases } from '../../providers/admin-phases-provider'

function SpeedQuestion() {
  const { socket } = useAdminSocket()
  const [question, setQuestion] = useState<SpeedQuestion | null>(null)
  const [deliveryDate, setDeliveryDate] = useState<number>(0)
  const [winner, setWinner] = useState<string | null>(null)
  const { setPhase } = useAdminPhases()

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


  function handleNext() {
    socket?.send(JSON.stringify({ event: 'start_choosing_clubs' }))
    setPhase('choosing_clubs')
  }

  return (
    <AnimatePresence mode='wait'>
      {!question && <SpeedIntro key='intro' />}
      {(question && !winner) && (
        <EnterExit key='card'>
          <SpeedCard
            deliveryDate={deliveryDate}
            interactive={false}
            answers={question.answers}
            question={question.question}
          />
        </EnterExit>
      )}
      {winner && (
        <EnterExit key='winner'>
          <ContentLayout personSrc={person.src}>
            <div className='flex flex-col pt-23 items-center gap-4'>
              <SpeedWinnerCard winner={winner} />
              <GameButton
                className='ml-auto mt-3'
                onClick={handleNext}
              >Next</GameButton>
            </div>
          </ContentLayout>
        </EnterExit>
      )}
    </AnimatePresence>
  )
}

export default SpeedQuestion