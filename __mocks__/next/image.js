// Simple mock for Next.js Image component used in Jest tests.
// It renders a regular <img> element with all received props.
// This avoids the complex behavior of the real Image component which
// depends on Next.js internals not available in the test environment.
import React from 'react';

export default function Image(props) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} />;
}

