'use server'

import { revalidatePath } from 'next/cache'
import { getLocale } from 'next-intl/server'

import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

function homeHref(page: number, query?: string) {
  const searchQuery: Record<string, string> = {
    page: String(page),
  }
  const normalizedQuery = (query ?? '').trim()
  if (normalizedQuery) {
    searchQuery.q = normalizedQuery
  }

  return {
    pathname: '/' as const,
    query: searchQuery,
  }
}

function detailsHref(page: number, detailsId: string, query?: string) {
  const searchQuery: Record<string, string> = {
    page: String(page),
    details: detailsId,
  }
  const normalizedQuery = (query ?? '').trim()
  if (normalizedQuery) {
    searchQuery.q = normalizedQuery
  }

  return {
    pathname: '/details' as const,
    query: searchQuery,
  }
}

export async function submitSearchAction(_prevState: unknown, formData: FormData) {
  const query = String(formData.get('q') ?? '').trim()
  const locale = await getLocale()
  redirect({ href: homeHref(1, query), locale })
}

export async function openPokemonDetailsAction(formData: FormData) {
  const detailsId = String(formData.get('detailsId') ?? '')
  const page = Number.parseInt(String(formData.get('page') ?? '1'), 10)
  const query = String(formData.get('q') ?? '').trim()

  if (!detailsId) {
    return
  }

  const locale = await getLocale()
  redirect({
    href: detailsHref(Number.isFinite(page) && page >= 1 ? page : 1, detailsId, query),
    locale,
  })
}

export async function closePokemonDetailsAction(formData: FormData) {
  const page = Number.parseInt(String(formData.get('page') ?? '1'), 10)
  const query = String(formData.get('q') ?? '').trim()
  const locale = await getLocale()

  redirect({
    href: homeHref(Number.isFinite(page) && page >= 1 ? page : 1, query),
    locale,
  })
}

function revalidatePokedexPaths() {
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
    revalidatePath(prefix === '' ? '/' : prefix)
    revalidatePath(`${prefix}/details`)
  }
}

export async function refreshSearchAction() {
  revalidatePokedexPaths()
}
