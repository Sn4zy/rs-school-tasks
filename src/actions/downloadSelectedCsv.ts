'use server'

import { headers } from 'next/headers'

import type { PokemonDetails } from '../../types/index.ts'
import {
  buildSelectedItemsCsv,
  getSelectedItemsCsvFilename,
} from '@/utils/downloadSelectedCsv'
import { routing } from '@/i18n/routing'

export type SelectedItemsCsvResult = {
  csv: string
  filename: string
}

async function getRequestOrigin(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') ?? 'http'

  if (!host) {
    return 'http://localhost:3000'
  }

  return `${protocol}://${host}`
}

export async function generateSelectedItemsCsvAction(
  items: PokemonDetails[],
  locale: string = routing.defaultLocale,
): Promise<SelectedItemsCsvResult | null> {
  if (items.length === 0) {
    return null
  }

  const origin = await getRequestOrigin()

  return {
    csv: buildSelectedItemsCsv(items, origin, locale),
    filename: getSelectedItemsCsvFilename(items.length),
  }
}
