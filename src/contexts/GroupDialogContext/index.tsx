import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface GroupDialogContextType {
  shouldShowGroupChange: boolean;
  applyChangesFunction: any;
  cancelFunction: any;
  setShouldShowGroupChange: (shouldShow: boolean) => void;
  setApplyChangesFunction: (executable: any) => void;
  setCancelFunction: (executable: any) => void;
  close: () => void;
}

const GroupDialogContext = createContext<GroupDialogContextType>({} as GroupDialogContextType);

export function GroupDialogProvider({ children }: { children: ReactNode }): JSX.Element {
  const [message, setDialogMessage] = useState<string>('');

  const [shouldShowGroupChange, setShouldShowGroupChange] = useState(false);
  const [applyChangesFunction, setApplyChangesFunction] = useState(() => {});
  const [cancelFunction, setCancelFunction] = useState(() => {});
  const [isAffiliationChange, setIsAffiliationChange] = useState(false);
  const [AffiliationID, setAffiliationID] = useState();

  const close = () => {
    setShouldShowGroupChange(false);
  };

  const memoedValue = useMemo(
    () => ({
      shouldShowGroupChange,
      applyChangesFunction,
      cancelFunction,
      setShouldShowGroupChange,
      setApplyChangesFunction,
      setCancelFunction,
      close,
      isAffiliationChange,
      setIsAffiliationChange,
      AffiliationID,
      setAffiliationID
    }),
    [shouldShowGroupChange, applyChangesFunction, isAffiliationChange]
  );

  return <GroupDialogContext.Provider value={memoedValue}>{children}</GroupDialogContext.Provider>;
}

export default function useGroupDialog() {
  return useContext(GroupDialogContext);
}
