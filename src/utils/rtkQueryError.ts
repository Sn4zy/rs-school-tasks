import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

type ErrorMessages = {
  network?: string
  invalidResponse?: string
  timeout?: string
  httpStatus?: (message: string, status: number) => string
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

function pickMessageFromData(data: unknown): string | null {
  if (typeof data === 'string') return data
  if (!data || typeof data !== 'object') return null
  if ('message' in data && typeof (data as { message?: unknown }).message === 'string') {
    return (data as { message: string }).message
  }
  if ('error' in data && typeof (data as { error?: unknown }).error === 'string') {
    return (data as { error: string }).error
  }
  return null
}

export function getReadableQueryError(
  error: unknown,
  fallbackMessage: string,
  messages?: ErrorMessages,
): string | null {
  if (!error) return null

  if (typeof error === 'object' && error !== null) {
    if ('data' in error) {
      const dataMessage = pickMessageFromData((error as { data?: unknown }).data)
      if (dataMessage) return dataMessage
    }
    if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return (error as { message: string }).message
    }
    if ('error' in error && typeof (error as { error?: unknown }).error === 'string') {
      const msg = (error as { error: string }).error
      if (msg.trim() !== '') return msg
    }
  }

  if (isFetchBaseQueryError(error)) {
    if ('error' in error && typeof error.error === 'string' && error.error.trim() !== '') {
      return error.error
    }

    const dataMessage = pickMessageFromData(error.data)
    if (dataMessage) return dataMessage

    if (typeof error.status === 'number') {
      return messages?.httpStatus
        ? messages.httpStatus(fallbackMessage, error.status)
        : `${fallbackMessage} (HTTP ${error.status}).`
    }

    if (typeof error.status === 'string') {
      if (error.status === 'FETCH_ERROR') {
        return messages?.network ?? 'Network error. Please try again.'
      }
      if (error.status === 'PARSING_ERROR') {
        return messages?.invalidResponse ?? 'Received an invalid server response.'
      }
      if (error.status === 'TIMEOUT_ERROR') {
        return messages?.timeout ?? 'Request timed out. Please try again.'
      }
      if (error.status === 'CUSTOM_ERROR') return fallbackMessage
    }

    return fallbackMessage
  }

  const serialized = error as SerializedError
  if (serialized?.message) return serialized.message

  return fallbackMessage
}
