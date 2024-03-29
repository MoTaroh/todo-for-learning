import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { signOut } from 'next-auth/react';
import Loader from './Loader';
import useRequireAuth from '../../lib/useRequireAuth';

import type { WithChildren } from '@/types';

interface LayoutProps extends WithChildren {
  siteId?: string;
}

export default function Layout({ children }: LayoutProps) {
  const title = 'Platforms on Vercel';
  const description =
    'Create a fullstack application with multi-tenancy and custom domains support using Next.js, Prisma, and PostgreSQL';
  const logo = '/favicon.ico';

  const session = useRequireAuth();
  if (!session) return <Loader />;

  return (
    <>
      <div className="h-full">
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Vercel" />
          <meta name="twitter:creator" content="@StevenTey" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>
        <div className="absolute left-0 right-0 h-16 bg-white border-b border-gray-200">
          <div className="flex items-center justify-end h-full max-w-screen-xl px-10 mx-auto sm:px-20">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="flex items-center justify-center">
                  {session.user && session.user.image && (
                    <div className="inline-block w-8 h-8 overflow-hidden align-middle rounded-full">
                      <Image
                        src={session.user.image}
                        width={40}
                        height={40}
                        alt={session.user.name ?? 'User avatar'}
                      />
                    </div>
                  )}
                  <span className="inline-block ml-3 font-medium truncate sm:block">
                    {session.user?.name}
                  </span>
                </a>
              </Link>
              <div className="h-8 border border-gray-300" />
              <button
                className="text-gray-500 transition-all duration-150 ease-in-out hover:text-gray-700"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="h-full pt-16">{children}</div>
      </div>
    </>
  );
}
