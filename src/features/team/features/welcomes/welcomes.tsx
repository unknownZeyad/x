import WelcomingVideos from '@/core/components/derived/welcoming-videos'
import { useState } from 'react'
import TeamWelcome from './team-welcome'
import { AnimatePresence } from 'motion/react'

function Welcomes() {
  const [finsihedWelcomingVids, setFinishedWelcomingVids] = useState<boolean>(false)

  return (
    <AnimatePresence mode='wait'>
      {!finsihedWelcomingVids && <WelcomingVideos onEnd={() => setFinishedWelcomingVids(true)} />}
      {finsihedWelcomingVids && <TeamWelcome />}
    </AnimatePresence>
  )
}

export default Welcomes