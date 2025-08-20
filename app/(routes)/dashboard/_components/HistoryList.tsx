'use client';

import Image from 'next/image';
import React, { useState } from 'react'

function HistoryList() {
    const [historyList, setHistoryList] = useState ([]);
  return (
    <div className='mt-10'>
        {historyList.length == 0?
        <div className='flex flex-col justify-center items-center p-7 border-2 border-dashed rounded-2xl'>
            <Image src={'/photo 1.png'} alt='doc'
            width={250}
            height={250}
            />
            <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
            <p>Looks like you havent start any conversations.</p>
        </div>
        : <div>List</div>

        }
    </div>
  )
}

export default HistoryList