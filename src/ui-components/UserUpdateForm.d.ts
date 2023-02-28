/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { User } from '../models';
import { EscapeHatchProps } from '@aws-amplify/ui-react/internal';
import {
  GridProps,
  SelectFieldProps,
  SwitchFieldProps,
  TextFieldProps,
} from '@aws-amplify/ui-react';
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse
) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserUpdateFormInputValues = {
  username?: string;
  first_name?: string;
  last_name?: string;
  middle_initial?: string;
  telephone?: string;
  signature?: string;
  job?: string;
  admin_approval?: boolean;
  expiration_date?: string;
  extension?: string;
  affiliation?: string;
  timezone?: string;
  observes_dst?: string;
  receive_emails?: boolean;
  status?: string;
  affiliation_type?: string;
};
export declare type UserUpdateFormValidationValues = {
  username?: ValidationFunction<string>;
  first_name?: ValidationFunction<string>;
  last_name?: ValidationFunction<string>;
  middle_initial?: ValidationFunction<string>;
  telephone?: ValidationFunction<string>;
  signature?: ValidationFunction<string>;
  job?: ValidationFunction<string>;
  admin_approval?: ValidationFunction<boolean>;
  expiration_date?: ValidationFunction<string>;
  extension?: ValidationFunction<string>;
  affiliation?: ValidationFunction<string>;
  timezone?: ValidationFunction<string>;
  observes_dst?: ValidationFunction<string>;
  receive_emails?: ValidationFunction<boolean>;
  status?: ValidationFunction<string>;
  affiliation_type?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserUpdateFormOverridesProps = {
  UserUpdateFormGrid?: FormProps<GridProps>;
  username?: FormProps<TextFieldProps>;
  first_name?: FormProps<TextFieldProps>;
  last_name?: FormProps<TextFieldProps>;
  middle_initial?: FormProps<TextFieldProps>;
  telephone?: FormProps<TextFieldProps>;
  signature?: FormProps<TextFieldProps>;
  job?: FormProps<TextFieldProps>;
  admin_approval?: FormProps<SwitchFieldProps>;
  expiration_date?: FormProps<TextFieldProps>;
  extension?: FormProps<TextFieldProps>;
  affiliation?: FormProps<TextFieldProps>;
  timezone?: FormProps<SelectFieldProps>;
  observes_dst?: FormProps<TextFieldProps>;
  receive_emails?: FormProps<SwitchFieldProps>;
  status?: FormProps<SelectFieldProps>;
  affiliation_type?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type UserUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: UserUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    user?: User;
    onSubmit?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onSuccess?: (fields: UserUpdateFormInputValues) => void;
    onError?: (fields: UserUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: UserUpdateFormInputValues) => UserUpdateFormInputValues;
    onValidate?: UserUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function UserUpdateForm(props: UserUpdateFormProps): React.ReactElement;
