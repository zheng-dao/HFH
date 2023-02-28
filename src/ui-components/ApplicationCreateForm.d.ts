/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
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
export declare type ApplicationCreateFormInputValues = {
  status?: string;
  liaison_read?: string;
  admin_read?: string;
  exception_narrative?: string;
  liaison_terms_of_use_agreement?: boolean;
  sm_terms_of_use_agreement?: boolean;
};
export declare type ApplicationCreateFormValidationValues = {
  status?: ValidationFunction<string>;
  liaison_read?: ValidationFunction<string>;
  admin_read?: ValidationFunction<string>;
  exception_narrative?: ValidationFunction<string>;
  liaison_terms_of_use_agreement?: ValidationFunction<boolean>;
  sm_terms_of_use_agreement?: ValidationFunction<boolean>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApplicationCreateFormOverridesProps = {
  ApplicationCreateFormGrid?: FormProps<GridProps>;
  status?: FormProps<SelectFieldProps>;
  liaison_read?: FormProps<SelectFieldProps>;
  admin_read?: FormProps<SelectFieldProps>;
  exception_narrative?: FormProps<TextFieldProps>;
  liaison_terms_of_use_agreement?: FormProps<SwitchFieldProps>;
  sm_terms_of_use_agreement?: FormProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ApplicationCreateFormProps = React.PropsWithChildren<
  {
    overrides?: ApplicationCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ApplicationCreateFormInputValues) => ApplicationCreateFormInputValues;
    onSuccess?: (fields: ApplicationCreateFormInputValues) => void;
    onError?: (fields: ApplicationCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: ApplicationCreateFormInputValues) => ApplicationCreateFormInputValues;
    onValidate?: ApplicationCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function ApplicationCreateForm(
  props: ApplicationCreateFormProps
): React.ReactElement;
