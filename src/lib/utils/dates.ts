import { differenceInDays } from 'date-fns'

export function getDaysToExpiry(expiryDate: string): number {
  return differenceInDays(new Date(expiryDate), new Date())
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}