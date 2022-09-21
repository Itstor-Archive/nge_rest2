/* eslint-disable @next/next/no-img-element */
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Confetti from 'react-confetti';
import { useWindowSize } from 'usehooks-ts';

import Seo from '@/components/Seo';

function SecretPage({
  isValid,
  trapUrl,
}: {
  isValid: boolean;
  trapUrl: string;
}) {
  const { width, height } = useWindowSize();

  if (!isValid) {
    return (
      <>
        <Seo title='Sadge 😢' />
        <div className='flex h-screen w-screen items-center justify-center'>
          <img src={trapUrl} className='h-auto w-[400px]' alt='LOL' />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title='Congratss 🎉🎉' />
      <Confetti width={width} height={height} recycle={false} />
      <div className='flex h-screen w-screen flex-col items-center justify-center'>
        <h1>
          Congratz, you found my contact{' '}
          <span className='text-4xl'>🎉🎉🎉</span>
        </h1>
        <h6>hint: find in this page</h6>
        <h6 className='text-white'>line: ahmdthoriq__</h6>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { secret } = context.query;
  const prisma = new PrismaClient();

  await prisma.$connect();

  const linkData = await prisma.link.findUnique({
    where: {
      secret: secret as string,
    },
  });

  if (!linkData || !linkData?.isValid) {
    const trapCount = await prisma.trap.count();
    const skip = Math.floor(Math.random() * trapCount);
    const trap = await prisma.trap.findFirst({
      take: 1,
      skip: skip,
      orderBy: {
        id: 'asc',
      },
    });

    await prisma.$disconnect();

    if (trap?.type === 'REDIRECT') {
      return {
        redirect: {
          destination: trap?.url,
          permanent: false,
        },
      };
    } else if (trap?.type === 'IMAGE') {
      return {
        props: {
          isValid: false,
          trapUrl: trap?.url,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } else {
    // When valid
    const linkCount = await prisma.link.count();
    const skip = Math.floor(Math.random() * linkCount);
    const link = await prisma.link.findFirst({
      take: 1,
      skip: skip,
      orderBy: {
        id: 'asc',
      },
    });

    if (link) {
      await prisma.link.update({
        where: {
          id: linkData.id,
        },
        data: {
          isValid: false,
        },
      });

      await prisma.link.update({
        where: {
          id: link.id,
        },
        data: {
          isValid: true,
        },
      });
    }
  }

  await prisma.$disconnect();

  return { props: { isValid: true } };
};

export default SecretPage;
