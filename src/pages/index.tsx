import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <main className='flex h-screen w-screen flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1>
          Nothing to see here. <span className='text-4xl'>👋</span>
        </h1>
      </main>
    </Layout>
  );
}
