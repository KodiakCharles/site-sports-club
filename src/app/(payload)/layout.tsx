import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import React from 'react'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const serverFunction: Parameters<typeof RootLayout>[0]['serverFunction'] = async (args) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap, serverFunctions: {} })
}

export default async function PayloadLayout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
