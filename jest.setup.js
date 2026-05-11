// Jest setup file to configure the testing environment
// Import custom matchers from @testing-library/jest-dom for better assertions
// Import the custom matchers from @testing-library/jest-dom.
// The package now re-exports the matchers directly, so we import the main entry.
import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router components that are not needed for unit tests.
// Using plain JavaScript (no TypeScript annotations) to avoid syntax errors.
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }) => {
    // Render a simple anchor element for tests.
    return React.createElement('a', { href, ...rest }, children);
  },
}));

  jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Render a plain img element; suppress Next.js specific lint rule.
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', props);
  },
}));

// Provide a minimal ResizeObserver implementation for components that rely on it.
// This prevents errors in the test environment where ResizeObserver is not available.
  global.ResizeObserver = class {
    constructor(callback) { this.callback = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock IntersectionObserver for components that rely on it (e.g., ScrollReveal).
  // The mock immediately invokes the callback with an entry indicating the element is intersecting.
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      // Simulate an intersecting entry as soon as observe is called.
      this.callback([
        {
          isIntersecting: true,
          target: {},
          intersectionRatio: 1,
        },
      ]);
    }
    unobserve() {}
    disconnect() {}
  };

// You can add any global test configuration here, such as mocking timers or
// setting up a test server. For now, the default setup is sufficient.
