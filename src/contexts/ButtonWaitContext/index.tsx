import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

interface ButtonWaitContextType {
  isWaiting: boolean;
  setIsWaiting: (isWaiting: boolean) => void;
}

const ButtonWaitContext = createContext<ButtonWaitContextType>({} as ButtonWaitContextType);

export function ButtonWaitProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const memoedValue = useMemo(
    () => ({
      isWaiting,
      setIsWaiting,
    }),
    [isWaiting]
  );

  const loadingClassWrapper = classNames({
    'button-progress': isWaiting,
  });

  return (
    <ButtonWaitContext.Provider value={memoedValue}>
      <div className={loadingClassWrapper}>{children}</div>
    </ButtonWaitContext.Provider>
  );
}

export default function useButtonWait() {
  return useContext(ButtonWaitContext);
}
