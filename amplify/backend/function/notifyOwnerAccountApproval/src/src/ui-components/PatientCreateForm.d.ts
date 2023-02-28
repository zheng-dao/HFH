/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { EscapeHatchProps } from '@aws-amplify/ui-react/internal';
import { GridProps, SelectFieldProps, TextFieldProps } from '@aws-amplify/ui-react';
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse
) => ValidationResponse | Promise<ValidationResponse>;
export declare type PatientCreateFormInputValues = {
  first_name?: string;
  middle_initial?: string;
  last_name?: string;
  relationship?: string;
};
export declare type PatientCreateFormValidationValues = {
  first_name?: ValidationFunction<string>;
  middle_initial?: ValidationFunction<string>;
  last_name?: ValidationFunction<string>;
  relationship?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PatientCreateFormOverridesProps = {
  PatientCreateFormGrid?: FormProps<GridProps>;
  first_name?: FormProps<TextFieldProps>;
  middle_initial?: FormProps<TextFieldProps>;
  last_name?: FormProps<TextFieldProps>;
  relationship?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type PatientCreateFormProps = React.PropsWithChildren<
  {
    overrides?: PatientCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PatientCreateFormInputValues) => PatientCreateFormInputValues;
    onSuccess?: (fields: PatientCreateFormInputValues) => void;
    onError?: (fields: PatientCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: PatientCreateFormInputValues) => PatientCreateFormInputValues;
    onValidate?: PatientCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function PatientCreateForm(props: PatientCreateFormProps): React.ReactElement;
