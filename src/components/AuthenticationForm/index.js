import { useState } from 'react';
import Link from 'next/link';
import Textfield from '@components/Inputs/Textfield';
import Emailfield from '@components/Inputs/Emailfield';
import Passwordfield from '@components/Inputs/Passwordfield';
import SubmitButton from '@components/Inputs/SubmitButton';
import validateEmail from '@utils/validators/email';
import validatePassword from '@utils/validators/password';
import validateRequired from '@utils/validators/required';
import validateConfirmPassword from '@utils/validators/confirmPassword';
import useAuth from '@contexts/AuthContext';
import useDialog from '@contexts/DialogContext';
import validateLetter from '@utils/validators/letter';
import Recaptcha from 'react-google-recaptcha';
import { useRouter } from 'next/router';
import { API } from 'aws-amplify';
import useButtonWait from '@contexts/ButtonWaitContext';

export default function AuthenticationForm(props) {
  // Login.
  const [loginEmail, setLoginEmail] = useState('');
  const [loginEmailValid, setLoginEmailValid] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPasswordValid, setLoginPasswordValid] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);

  // Signup.
  const [signupEmail, setSignupEmail] = useState('');
  const [signupEmailValid, setSignupEmailValid] = useState(false);
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordValid, setSignupPasswordValid] = useState(false);
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupFirstNameValid, setSignupFirstNameValid] = useState(false);
  const [signupMiddleInitial, setSignupMiddleInitial] = useState('');
  const [signupMiddleInitialValid, setSignupMiddleInitialValid] = useState(false);
  const [signupLastName, setSignupLastName] = useState('');
  const [signupLastNameValid, setSignupLastNameValid] = useState(false);
  const [signupRecaptchaValid, setSignupRecaptchaValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { setIsWaiting } = useButtonWait();

  const shouldShowSignup = isSignupVisible ? '' : 'hidden';

  const { login, signUp } = useAuth();
  const { setMessage } = useDialog();
  const router = useRouter();

  async function attemptLogin(event) {
    event.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    const isEmailValid = validateEmail(loginEmail);
    const isPasswordValid = validatePassword(loginPassword);
    setLoginEmailValid(isEmailValid);
    setLoginPasswordValid(isPasswordValid);
    if (isEmailValid.valid && isPasswordValid.valid) {
      login(loginEmail, loginPassword)
        .then(() => {
          setIsWaiting(false);
          router.push('/');
        })
        .catch((err) => {
          switch (err.message) {
            case 'Incorrect username or password.':
              setMessage(`Incorrect username or password.`);
              break;
            case 'User does not exist.':
              setMessage(`Incorrect username or password.`);
              break;
            default:
              setMessage(err.message);
          }
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    } else {
      setMessage('Please enter a valid email address and password.');
      setButtonDisabled(false);
      setIsWaiting(false);
    }
  }

  async function attemptSignup(event) {
    event.preventDefault();
    setButtonDisabled(true);
    setIsWaiting(true);
    setSignupFirstNameValid(validateRequired(signupFirstName));
    setSignupMiddleInitialValid(validateLetter(signupMiddleInitial));
    setSignupLastNameValid(validateRequired(signupLastName));
    setSignupEmailValid(validateEmail(signupEmail));
    setSignupPasswordValid(validatePassword(signupPassword));
    setConfirmPasswordValid(validateConfirmPassword(confirmPassword, signupPassword));

    if (
      signupFirstNameValid.valid &&
      signupMiddleInitialValid.valid &&
      signupLastNameValid.valid &&
      signupEmailValid.valid &&
      signupPasswordValid.valid &&
      confirmPasswordValid.valid &&
      signupRecaptchaValid
    ) {
      signUp(signupEmail, signupPassword, signupFirstName, signupLastName, signupMiddleInitial)
        .then(() => setIsSignupVisible(false))
        .then(() =>
          setMessage(
            'A message with a confirmation link has been sent to your email address. Please open the link to confirm your account.'
          )
        )
        .catch((err) => setMessage(err.message))
        .finally(() => {
          setButtonDisabled(false);
          setIsWaiting(false);
        });
    } else {
      setButtonDisabled(false);
      setIsWaiting(false);
    }
  }

  return (
    <div>
      <section className="app-pane">
        {props.shouldShowConfirmation && (
          <h1>Your email address has been confirmed. Please log in below.</h1>
        )}
        <h2>Log In</h2>

        <form role="form" action="#">
          <Emailfield
            label="Email Address"
            wrapperClass="email"
            inputValue={loginEmail}
            inputOnChange={(e) => setLoginEmail(e.target.value)}
            inputRequired={true}
            inputOnBlur={(e) => setLoginEmailValid(validateEmail(e.target.value))}
            isValid={loginEmailValid.valid}
            errorMessage={loginEmailValid.message}
            childProps={{ autoComplete: 'username' }}
          />

          <Passwordfield
            label="Password"
            wrapperClass="password"
            inputValue={loginPassword}
            inputOnChange={(e) => setLoginPassword(e.target.value)}
            inputRequired={true}
            inputOnBlur={(e) => setLoginPasswordValid(validateRequired(e.target.value))}
            isValid={loginPasswordValid.valid}
            errorMessage={loginPasswordValid.message}
            childProps={{ autoComplete: 'current-password' }}
          />

          <SubmitButton
            inputValue="Log In"
            inputOnClick={attemptLogin}
            inputDisabled={buttonDisabled}
          />

          <p>
            Forgot your password or want to change it?{' '}
            <Link href="/forgot-password">
              <a>Reset it now</a>
            </Link>
          </p>
        </form>
      </section>

      <a
        id="create-new"
        className="button"
        href="#new-account"
        onClick={(e) => {
          e.preventDefault();
          setIsSignupVisible(!isSignupVisible);
        }}
      >
        Create a new user account
      </a>

      <section className={`app-pane ${shouldShowSignup}`} id="new-account">
        <form role="form" action="#" id="new-account-form">
          <div className="name-block">
            <Textfield
              label="First Name"
              wrapperClass="first-name"
              inputValue={signupFirstName}
              inputOnChange={(e) => setSignupFirstName(e.target.value)}
              inputRequired={true}
              inputOnBlur={(e) => setSignupFirstNameValid(validateRequired(e.target.value))}
              isValid={signupFirstNameValid.valid}
              errorMessage={signupFirstNameValid.message}
            />

            <Textfield
              label="MI"
              wrapperClass="mi"
              inputValue={signupMiddleInitial}
              inputOnChange={(e) => setSignupMiddleInitial(e.target.value)}
              maxLength="1"
              inputOnBlur={(e) => setSignupMiddleInitialValid(validateLetter(e.target.value))}
              isValid={signupMiddleInitialValid.valid}
              errorMessage={signupMiddleInitialValid.message}
            />

            <Textfield
              label="Last Name"
              wrapperClass="last-name"
              inputValue={signupLastName}
              inputOnChange={(e) => setSignupLastName(e.target.value)}
              inputRequired={true}
              inputOnBlur={(e) => setSignupLastNameValid(validateRequired(e.target.value))}
              isValid={signupLastNameValid.valid}
              errorMessage={signupLastNameValid.message}
            />
          </div>

          <Emailfield
            label="Email Address"
            wrapperClass="email"
            inputValue={signupEmail}
            inputOnChange={(e) => setSignupEmail(e.target.value)}
            inputRequired={true}
            inputOnBlur={(e) => setSignupEmailValid(validateEmail(e.target.value))}
            isValid={signupEmailValid.valid}
            errorMessage={signupEmailValid.message}
            childProps={{ autoComplete: 'username' }}
          />

          <Passwordfield
            label="Password"
            wrapperClass="password"
            inputValue={signupPassword}
            inputOnChange={(e) => setSignupPassword(e.target.value)}
            inputRequired={true}
            inputOnBlur={(e) => setSignupPasswordValid(validatePassword(e.target.value))}
            isValid={signupPasswordValid.valid}
            errorMessage={signupPasswordValid.message}
            childProps={{ autoComplete: 'new-password' }}
          />

          <Passwordfield
            label="Confirm Password"
            wrapperClass="password"
            inputValue={confirmPassword}
            inputOnChange={(e) => setConfirmPassword(e.target.value)}
            inputRequired={true}
            inputOnBlur={(e) =>
              setConfirmPasswordValid(validateConfirmPassword(e.target.value, signupPassword))
            }
            isValid={confirmPasswordValid.valid}
            errorMessage={confirmPasswordValid.message}
            childProps={{ autoComplete: 'new-password' }}
          />

          <Recaptcha
            onChange={setSignupRecaptchaValid}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}
            className="recaptcha"
          />

          <SubmitButton
            inputValue="Submit"
            inputOnClick={attemptSignup}
            inputDisabled={buttonDisabled}
          />
        </form>
      </section>
    </div>
  );
}

AuthenticationForm.defaultProps = {
  shouldShowConfirmation: false,
};
