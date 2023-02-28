/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { Guest } from '../models';
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
export declare type GuestUpdateFormInputValues = {
  first_name?: string;
  relationship?: string;
  middle_initial?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  extension?: string;
  type?: string;
  under_age_three?: boolean;
};
export declare type GuestUpdateFormValidationValues = {
  first_name?: ValidationFunction<string>;
  relationship?: ValidationFunction<string>;
  middle_initial?: ValidationFunction<string>;
  last_name?: ValidationFunction<string>;
  email?: ValidationFunction<string>;
  telephone?: ValidationFunction<string>;
  extension?: ValidationFunction<string>;
  type?: ValidationFunction<string>;
  under_age_three?: ValidationFunction<boolean>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GuestUpdateFormOverridesProps = {
  GuestUpdateFormGrid?: FormProps<GridProps>;
  first_name?: FormProps<TextFieldProps>;
  relationship?: FormProps<TextFieldProps>;
  middle_initial?: FormProps<TextFieldProps>;
  last_name?: FormProps<TextFieldProps>;
  email?: FormProps<TextFieldProps>;
  telephone?: FormProps<TextFieldProps>;
  extension?: FormProps<TextFieldProps>;
  type?: FormProps<SelectFieldProps>;
  under_age_three?: FormProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type GuestUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: GuestUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    guest?: Guest;
    onSubmit?: (fields: GuestUpdateFormInputValues) => GuestUpdateFormInputValues;
    onSuccess?: (fields: GuestUpdateFormInputValues) => void;
    onError?: (fields: GuestUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: GuestUpdateFormInputValues) => GuestUpdateFormInputValues;
    onValidate?: GuestUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function GuestUpdateForm(props: GuestUpdateFormProps): React.ReactElement;
