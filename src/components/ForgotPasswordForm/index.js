import Link from 'next/link';
import { useRouter } from 'next/router';
import Emailfield from '@components/Inputs/Emailfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import { useEffect, useState } from 'react';
import validateEmail from '@utils/validators/email';
import { Auth } from 'aws-amplify';
import useDialog from '../../contexts/DialogContext';
import Textfield from '../Inputs/Textfield';
import Passwordfield from '../Inputs/Passwordfield';
import validateNumeric from '../../utils/validators/numeric';
import validatePassword from '../../utils/validators/password';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function ForgotPasswordForm(props) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [showResetScreen, setShowResetScreen] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetCodeValid, setResetCodeValid] = useState(false);
  const [resetCodeFromUrl, setResetCodeFromUrl] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPWValid, setConfirmPWValid] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { setIsWaiting } = useButtonWait();

  const { setMessage } = useDialog();
  const router = useRouter();

  useEffect(() => {
    if (props.email.length > 0 && props.code.length > 0 && props.email != email) {
      const isValidEmail = validateEmail(props.email);
      const isResetCodeValid = validateNumeric(props.code);
      if (isValidEmail.valid && isResetCodeValid.valid) {
        setEmail(props.email);
        setEmailValid(isValidEmail);
        setShowResetScreen(true);
        setResetCode(props.code);
        setResetCodeValid(isResetCodeValid);
        setResetCodeFromUrl(true);
        // setMessage('Please enter your new password.');
      }
    }
  }, [props.email, props.code, setMessage, email]);

  const validateConfirmPassword = () => {
    if (newPassword == confirmPassword) {
      return {
        valid: true,
        message: '',
      };
    } else {
      return {
        valid: false,
        message: 'The passwords entered do not match.',
      };
    }
  };

  async function attemptPasswordReset(event) {
    event.preventDefault();
    if (emailValid) {
      setButtonDisabled(true);
      setIsWaiting(true);
      Auth.forgotPassword(email)
        .then((data) => {
          // setShowResetScreen(true);
          setMessage('We have sent further instructions to your email.');
        })
        .catch((err) =>
          setMessage('There was an error resetting your password. Please try again later.')
        )
        .finally(() => {
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  }

  async function attemptPasswordChange(event) {
    event.preventDefault();
    if (resetCodeValid && newPasswordValid) {
      // Collect confirmation code and new password , then
      setButtonDisabled(true);
      setIsWaiting(true);
      Auth.forgotPasswordSubmit(email, resetCode, newPassword)
        .then((data) => {
          setMessage('Password reset successfully.');
          setIsWaiting(false);
          router.push('/');
        })
        .catch((err) => {
          setMessage(err.message);
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    }
  }

  return (
    <div>
      <section className="app-pane">
        <h2>
          {showResetScreen && 'Reset Your Password'}
          {!showResetScreen && 'Forgot Your Password?'}
        </h2>

        <form role="form" action="#">
          {!showResetScreen && (
            <div>
              <p>We&apos;ll send password reset instructions.</p>

              <Emailfield
                label="Email Address"
                wrapperClass="email"
                inputValue={email}
                inputOnChange={(e) => setEmail(e.target.value)}
                inputRequired={true}
                inputOnBlur={(e) => setEmailValid(validateEmail(e.target.value))}
                isValid={emailValid.valid}
                errorMessage={emailValid.message}
              />

              <SubmitButton
                inputValue="Submit"
                inputOnClick={attemptPasswordReset}
                inputDisabled={buttonDisabled}
              />

              <p>
                Return to{' '}
                <Link href="/">
                  <a>Login</a>
                </Link>
                .
              </p>
            </div>
          )}

          {showResetScreen && (
            <div>
              {!resetCodeFromUrl && (
                <Textfield
                  label="Reset Code"
                  wrapperClass="code"
                  inputValue={resetCode}
                  inputOnChange={(e) => setResetCode(e.target.value)}
                  inputRequired={true}
                  inputOnBlur={(e) => setResetCodeValid(validateNumeric(e.target.value))}
                  isValid={resetCodeValid.valid}
                  errorMessage={resetCodeValid.message}
                />
              )}

              <Passwordfield
                label="New Password"
                wrapperClass="password"
                inputValue={newPassword}
                inputOnChange={(e) => setNewPassword(e.target.value)}
                inputRequired={true}
                inputOnBlur={(e) => setNewPasswordValid(validatePassword(e.target.value))}
                isValid={newPasswordValid.valid}
                errorMessage={newPasswordValid.message}
              />

              <Passwordfield
                label="Confirm Password"
                wrapperClass="password"
                inputValue={confirmPassword}
                inputOnChange={(e) => setConfirmPassword(e.target.value)}
                inputRequired
                inputOnBlur={() => setConfirmPWValid(validateConfirmPassword())}
                isValid={confirmPWValid.valid}
                errorMessage={confirmPWValid.message}
              />

              <SubmitButton
                inputValue="Submit"
                inputOnClick={attemptPasswordChange}
                inputDisabled={buttonDisabled}
              />

              <p>
                <a onClick={(e) => setShowResetScreen(!showResetScreen)}>Resend</a> password reset
                information.
              </p>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

ForgotPasswordForm.defaultProps = {
  email: '',
  code: '',
};
