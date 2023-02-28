/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { Patient } from '../models';
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
export declare type PatientUpdateFormInputValues = {
  first_name?: string;
  middle_initial?: string;
  last_name?: string;
  relationship?: string;
};
export declare type PatientUpdateFormValidationValues = {
  first_name?: ValidationFunction<string>;
  middle_initial?: ValidationFunction<string>;
  last_name?: ValidationFunction<string>;
  relationship?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PatientUpdateFormOverridesProps = {
  PatientUpdateFormGrid?: FormProps<GridProps>;
  first_name?: FormProps<TextFieldProps>;
  middle_initial?: FormProps<TextFieldProps>;
  last_name?: FormProps<TextFieldProps>;
  relationship?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type PatientUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: PatientUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    patient?: Patient;
    onSubmit?: (fields: PatientUpdateFormInputValues) => PatientUpdateFormInputValues;
    onSuccess?: (fields: PatientUpdateFormInputValues) => void;
    onError?: (fields: PatientUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: PatientUpdateFormInputValues) => PatientUpdateFormInputValues;
    onValidate?: PatientUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function PatientUpdateForm(props: PatientUpdateFormProps): React.ReactElement;
