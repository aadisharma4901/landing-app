import { renderHook, act } from '@testing-library/react'
import { useVoiceAssistant } from './useVoiceAssistant'

// Mock all global dependencies before tests
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((init) => [init, jest.fn()]),
  useEffect: jest.fn((cb) => cb()),
  useCallback: jest.fn((cb) => cb),
  useRef: jest.fn((init) => ({ current: init })),
}))

describe('useVoiceAssistant', () => {
  // Reset all mocks and state before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should export hook correctly', () => {
    expect(useVoiceAssistant).toBeDefined()
    expect(typeof useVoiceAssistant).toBe('function')
  })

  test('should return all expected methods and state', () => {
    const { result } = renderHook(() => useVoiceAssistant())
    
    expect(result.current.isListening).toBeDefined()
    expect(result.current.isOpen).toBeDefined()
    expect(result.current.messages).toBeDefined()
    expect(result.current.sendMessage).toBeDefined()
    expect(result.current.setIsOpen).toBeDefined()
    expect(result.current.wakeWord).toBe('hey bro')
  })

  test('wake word should be correctly defined', () => {
    const { result } = renderHook(() => useVoiceAssistant())
    expect(result.current.wakeWord).toBe('hey bro')
  })

})
