import demo from '@talks/demo'
import underHoodCodingAgent from '@talks/under-hood-coding-agent'

export const talks = [demo, underHoodCodingAgent].sort((a, b) => a.title.localeCompare(b.title))
