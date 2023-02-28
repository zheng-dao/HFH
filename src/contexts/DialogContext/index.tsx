import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

interface DialogContextType {
    message: string
    isNoApplications: boolean
    setMessage: (message: string) => void
    clearMessage: () => void
    setNoApplications: (isNoApplications: boolean) => void
}

const DialogContext = createContext<DialogContextType>(
    {} as DialogContextType
)

export function DialogProvider({
    children,
}: {
    children: ReactNode
}): JSX.Element {
    const [message, setDialogMessage] = useState<string>("")
    const [isNoApplications, setNoGroupApplications] = useState<boolean>(false);

    function setMessage(message: string) {
        setDialogMessage(message)
    }

    function clearMessage() {
        setMessage("")
    }

    function setNoApplications(isNoApplications: boolean) {
        setNoGroupApplications(isNoApplications)
    }

    const memoedValue = useMemo(
        () => ({
            message,
            setMessage,
            clearMessage,
            isNoApplications,
            setNoApplications
        }),
        [message, setMessage, clearMessage, isNoApplications, setNoApplications]
    )

    return (
        <DialogContext.Provider value={memoedValue}>
            {children}
        </DialogContext.Provider>
    )
}

export default function useDialog() {
    return useContext(DialogContext)
}