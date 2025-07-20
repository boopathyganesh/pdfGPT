"use client"
import FileUpload from '@/components/FileUpload';
import Chat from '@/components/Chat';
import { useState } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [uploaded, setUploaded] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  return (
    <main className="max-w-2xl flex flex-col items-center justify-center mx-auto p-6 h-full">
      <h1 className="text-2xl font-bold mb-2">pdfGPT</h1>
      <p className='text-lg mb-4'>Upload and ask anything from the document.</p>
      {!uploaded ? (
        <div className='h-full flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center justify-center gap-2 mb-4'>
            <Image src={'/images/bot.png'} alt={'PDF Bot'} height={500} width={500} className='w-64' />
            <h2 className='font-semibold text-2xl'>Welcome to PDFGpt!</h2>
            <p className='text-lg'>Upload your PDF below and Ask me anything from it!</p>
          </div>
          <FileUpload onUpload={(welcome) => {
            setWelcomeMessage(welcome);
            setUploaded(true)
          }} />
        </div>
      ) : (
        <Chat initialMessages={[{ role: 'assistant', content: welcomeMessage }]} />
      )}
    </main>
  );
}
