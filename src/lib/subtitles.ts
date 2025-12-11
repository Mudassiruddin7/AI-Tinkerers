/**
 * Subtitle/Caption utilities for video player
 */

export interface SubtitleCue {
  id: string
  startTime: number // in seconds
  endTime: number
  text: string
}

/**
 * Parse VTT (WebVTT) format subtitles
 */
export function parseVTT(vttContent: string): SubtitleCue[] {
  const cues: SubtitleCue[] = []
  const lines = vttContent.trim().split('\n')
  let i = 0

  // Skip WEBVTT header
  if (lines[0]?.includes('WEBVTT')) {
    i = 1
  }

  while (i < lines.length) {
    // Skip empty lines
    if (!lines[i]?.trim()) {
      i++
      continue
    }

    // Check for cue identifier (optional)
    let cueId = ''
    if (!lines[i].includes('-->')) {
      cueId = lines[i].trim()
      i++
    }

    // Parse timing line
    const timingLine = lines[i]
    if (!timingLine?.includes('-->')) {
      i++
      continue
    }

    const [startStr, endStr] = timingLine.split('-->').map(s => s.trim())
    const startTime = parseVTTTimestamp(startStr)
    const endTime = parseVTTTimestamp(endStr)

    i++

    // Collect text lines until empty line
    const textLines: string[] = []
    while (i < lines.length && lines[i]?.trim()) {
      textLines.push(lines[i].trim())
      i++
    }

    if (textLines.length > 0) {
      cues.push({
        id: cueId || `cue-${cues.length}`,
        startTime,
        endTime,
        text: textLines.join('\n'),
      })
    }

    i++
  }

  return cues
}

/**
 * Parse VTT timestamp (00:00:00.000 or 00:00.000) to seconds
 */
function parseVTTTimestamp(timestamp: string): number {
  const parts = timestamp.split(':')
  let seconds = 0

  if (parts.length === 3) {
    // HH:MM:SS.mmm
    seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2])
  } else if (parts.length === 2) {
    // MM:SS.mmm
    seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1])
  }

  return seconds
}

/**
 * Parse SRT format subtitles
 */
export function parseSRT(srtContent: string): SubtitleCue[] {
  const cues: SubtitleCue[] = []
  const blocks = srtContent.trim().split(/\n\n+/)

  for (const block of blocks) {
    const lines = block.split('\n')
    if (lines.length < 3) continue

    const cueId = lines[0].trim()
    const timingLine = lines[1]
    const textLines = lines.slice(2)

    if (!timingLine?.includes('-->')) continue

    const [startStr, endStr] = timingLine.split('-->').map(s => s.trim())
    const startTime = parseSRTTimestamp(startStr)
    const endTime = parseSRTTimestamp(endStr)

    cues.push({
      id: cueId,
      startTime,
      endTime,
      text: textLines.join('\n'),
    })
  }

  return cues
}

/**
 * Parse SRT timestamp (00:00:00,000) to seconds
 */
function parseSRTTimestamp(timestamp: string): number {
  const [time, ms] = timestamp.split(',')
  const [hours, minutes, seconds] = time.split(':').map(Number)
  return hours * 3600 + minutes * 60 + seconds + parseInt(ms) / 1000
}

/**
 * Generate subtitles from transcript text
 */
export function generateSubtitlesFromTranscript(
  transcript: string,
  duration: number,
  wordsPerCue: number = 10
): SubtitleCue[] {
  const words = transcript.split(/\s+/).filter(w => w.trim())
  const cues: SubtitleCue[] = []
  const totalWords = words.length
  const timePerWord = duration / totalWords

  let wordIndex = 0
  let cueIndex = 0

  while (wordIndex < totalWords) {
    const startTime = wordIndex * timePerWord
    const cueWords = words.slice(wordIndex, wordIndex + wordsPerCue)
    const endWordIndex = Math.min(wordIndex + wordsPerCue, totalWords)
    const endTime = Math.min(endWordIndex * timePerWord, duration)

    cues.push({
      id: `cue-${cueIndex}`,
      startTime,
      endTime,
      text: cueWords.join(' '),
    })

    wordIndex += wordsPerCue
    cueIndex++
  }

  return cues
}

/**
 * Get current subtitle cue based on video time
 */
export function getCurrentCue(cues: SubtitleCue[], currentTime: number): SubtitleCue | null {
  return cues.find(cue => currentTime >= cue.startTime && currentTime <= cue.endTime) || null
}

/**
 * Convert SubtitleCue array to VTT format string
 */
export function cuesToVTT(cues: SubtitleCue[]): string {
  let vtt = 'WEBVTT\n\n'

  for (const cue of cues) {
    const startStr = formatVTTTimestamp(cue.startTime)
    const endStr = formatVTTTimestamp(cue.endTime)
    vtt += `${cue.id}\n${startStr} --> ${endStr}\n${cue.text}\n\n`
  }

  return vtt
}

function formatVTTTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
}
