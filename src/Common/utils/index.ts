export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
    if (!dateString) return 'Unknown'
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString))
  }
  
  export const formatRating = (rating: number): string => {
    return rating.toFixed(1)
  }
  
  export const generateId = (): string => {
    return crypto.randomUUID()
  }