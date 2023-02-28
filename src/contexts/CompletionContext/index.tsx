import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'

interface CompletionContextType {
    tabOneStatus: boolean
    tabTwoStatus: boolean
    tabThreeStatus: boolean
    tabFourStatus: boolean
    setTabStatus: (tab: number, status: boolean) => void
}

const CompletionContext = createContext<CompletionContextType>(
    {} as CompletionContextType
)

export function CompletionProvider({
    children,
}: {
    children: ReactNode
}): JSX.Element {
    const [tabOneStatus, setTabOneStatus] = useState<boolean>(false)
    const [tabTwoStatus, setTabTwoStatus] = useState<boolean>(true)
    const [tabThreeStatus, setTabThreeStatus] = useState<boolean>(false)
    const [tabFourStatus, setTabFourStatus] = useState<boolean>(false)

    function setTabStatus(tab: number, status: boolean) {
        switch (tab) {
            case 1:
                setTabOneStatus(status)
                break

            case 2:
                setTabTwoStatus(status)
                break

            case 3:
                setTabThreeStatus(status)
                break

            case 4:
                setTabFourStatus(status)
                break
        }
    }

    const memoedValue = useMemo(
        () => ({
            tabOneStatus,
            tabTwoStatus,
            tabThreeStatus,
            tabFourStatus,
            setTabStatus
        }),
        [tabOneStatus, tabTwoStatus, tabThreeStatus, tabFourStatus, setTabStatus]
    )

    return (
        <CompletionContext.Provider value={memoedValue}>
            {children}
        </CompletionContext.Provider>
    )
}

export default function withCompletionContext() {
    return useContext(CompletionContext)
}