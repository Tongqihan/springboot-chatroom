import { useMemo } from 'react';

export function useChat() {
  return useMemo(
    () => ({
      stage: 'skeleton',
    }),
    []
  );
}
