import '@testing-library/jest-dom'

// Mock Web Speech API
global.SpeechRecognition = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
  onresult: null,
  onend: null,
  onerror: null,
  continuous: false,
  interimResults: false,
  maxAlternatives: 1,
  lang: 'en-US',
}))

global.webkitSpeechRecognition = global.SpeechRecognition

// Mock speech synthesis
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  getVoices: jest.fn(() => []),
}

global.SpeechSynthesisUtterance = jest.fn(function(text) {
  this.text = text
  this.rate = 1
  this.pitch = 1
  this.volume = 1
})

// Mock fetch
global.fetch = jest.fn()

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


