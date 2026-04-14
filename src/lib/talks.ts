import demo from '@talks/demo'

export const talks = [demo].sort((a, b) => a.title.localeCompare(b.title))
