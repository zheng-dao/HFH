import React from 'react';
import { AuthProvider } from './AuthContext';
import { DialogProvider } from './DialogContext';
import { CompletionProvider } from './CompletionContext';
import { ApplicationProvider } from './ApplicationContext';
import { GroupDialogProvider } from './GroupDialogContext';
import { ButtonWaitProvider } from './ButtonWaitContext';

const AppContextProvider: React.FC = ({ children }) => {
  return (
    <ButtonWaitProvider>
      <DialogProvider>
        <AuthProvider>
          <ApplicationProvider>
            <GroupDialogProvider>
              <CompletionProvider>{children}</CompletionProvider>
            </GroupDialogProvider>
          </ApplicationProvider>
        </AuthProvider>
      </DialogProvider>
    </ButtonWaitProvider>
  );
};

export default AppContextProvider;
