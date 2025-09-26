import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking the state of a media query.
 * @param query - The media query string to watch.
 * @returns `true` if the media query matches, otherwise `false`.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener
    mediaQueryList.addEventListener('change', listener);

    // Clean up the listener on component unmount
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
