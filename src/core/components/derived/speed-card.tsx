'use client'

import backgroundImg from '@public/assets/images/background_Img.png'
import speedQuestionImg from '@public/assets/images/speed_question.jpg'
import logo from '@public/assets/images/Sobi-Fantasy-Game-Logo.webp'
// import person from '@public/assets/images/vini.jpg'
import Image from 'next/image'
import EnterExit from './enter-exit'
import { ReactNode, useState } from 'react'
import { cn } from '@/core/lib/utils'

export default function SpeedCard({ answers, interactive = true, question, onAnswer }: {
    question: string,
    onAnswer?: (ansId: number) => void
    interactive?: boolean,
    answers: {
        is_correct: boolean,
        answer: string,
        id: number
    }[]
}) {


    return (
        <EnterExit>
            <div
                className="relative p-16 min-h-screen flex items-center w-full bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${backgroundImg.src})` }}
            >
                <Image
                    src={logo || ""}
                    width={150}
                    height={150}
                    alt='logo image'
                    className='absolute top-4 right-8 z-10'
                />

                <div className='w-full h-full gap-12 flex items-center justify-between'>
                    <div className='w-1/4'>
                        <img
                            src={""}
                            width={400}
                            height={600}
                            alt='person image'
                            className='object-contain'
                        />
                    </div>

                    <div className="relative flex-1 h-full bg-contain bg-center bg-no-repeat flex items-center justify-center w-3/4">
                        <div className='flex-1 relative w-full h-full'>
                            <div className="absolute py-[7%] flex-col flex justify-center items-center w-full h-full top-0 left-0">
                                <p className='pt-3 text-4xl font-bold w-[80%] text-center text-white'>{question}</p>
                                <div className='grid grid-cols-2 gap-5 mt-[4%] w-[80%]'>
                                    {answers.map((curr, idx) => (
                                        <Answer />
                                    ))}
                                </div>
                            </div>
                            <img
                                src='assets/images/speed_question.jpg'
                                alt='speed question image'
                                className='object-contain w-full h-full'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </EnterExit>
    )
}


function Answer({
    handleAnswer, interactive,
    answer
}: {
    interactive: boolean,
    answer: SpeedQuestion['answers'][number]
    handleAnswer: (id: number) => void
}) {
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

    const handleAns = () => {
        if (answer.is_correct) {
            setIsCorrect(true)
        } else {
            setIsCorrect(false)
        }
        handleAnswer(answer.id)
    }

    return (
        <div
            key={answer.id}
            onClick={handleAns}
            className={
                cn(
                    'w-full border-amber-400/40 border flex h-[60px] bg-black/35',
                    interactive && 'hover:scale-105 duration-150 cursor-pointer',
                    isCorrect === false && 'border-red-500/40',
                    isCorrect === true && 'border-green-500/40',
                )}
        >
            <div className={cn(
                'text-amber-400 w-[60px] h-full bg-white font-bold flex items-center justify-center text-5xl',
                isCorrect === false && 'border-red-600',
                isCorrect === true && 'border-green-600',
            )}>
                {answer.id}
            </div>
            <div className={cn(
                'h-full from-amber-500/40 via-amber-500/15 to-amber-500/5 bg-linear-90 text-xl font-medium flex-1 text-white p-3 flex items-center',
                isCorrect === false && 'from-red-500/40 via-red-500/15 to-red-500/5',
                isCorrect === true && 'from-green-500/40 via-green-500/15 to-green-500/5',
            )}>
                {answer.answer}
            </div>
        </div>
    )
}