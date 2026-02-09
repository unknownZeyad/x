'use client'

import backgroundImg from '@public/assets/images/background_Img.png'
import speedQuestionImg from '@public/assets/images/speed_question.jpg'
import logo from '@public/assets/images/Sobi-Fantasy-Game-Logo.webp'
// import person from '@public/assets/images/vini.jpg'
import Image from 'next/image'
import EnterExit from './enter-exit'

export default function SpeedCard() {
    return (
        <EnterExit>
            <div
                className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${backgroundImg.src})` }}
            >
                <Image
                    src={logo || ""}
                    width={150}
                    height={150}
                    alt='logo image'
                    className='absolute top-4 right-8 z-10'
                />

                <div className='w-full h-full flex items-center justify-between'>
                    <div className='w-1/4'>
                        <img
                            src={""}
                            width={400}
                            height={600}
                            alt='person image'
                            className='object-contain'
                        />
                    </div>

                    <div
                        className="relative bg-contain bg-center bg-no-repeat flex items-center justify-center w-3/4"

                    >
                        <div className='flex flex-col items-center justify-center h-full'>
                            {/* Title */}
                            <h1 className='text-white text-4xl font-bold tracking-wider mb-6 drop-shadow-lg'>
                                SPEED QUESTION
                            </h1>

                        </div>
                        <img
                            src={speedQuestionImg || ""}
                            width={400}
                            height={600}
                            alt='speed question image'
                            className='object-contain absolute right-0 bottom-0 w-full h-full'
                        />
                    </div>
                </div>
            </div>
        </EnterExit>
    )
}
