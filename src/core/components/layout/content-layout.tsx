import React from 'react'
import EnterExit from '../derived/enter-exit'
import backgroundImg from '@public/assets/images/background_Img.png'

function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnterExit>
      <div
        className="p-16 min-h-screen flex items-center w-full bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImg.src})` }}
      >
        <img
          src='/assets/images/Sobi-Fantasy-Game-Logo.webp'
          alt='logo image'
          className='absolute w-[200px] object-cover top-4 right-8 z-10 scale-300'
        />

        <div className='w-full h-2/3 gap-12 flex items-center justify-between'>
          <div className='w-1/4'>
            <img
              src={""}
              width={400}
              height={600}
              alt='person image'
              className='object-contain'
            />
          </div>

          <div className="h-full flex items-center justify-center w-3/4">
            {children}
          </div>
        </div>
      </div>
    </EnterExit>
  )
}

export default ContentLayout