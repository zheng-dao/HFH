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
export declare type PaymentTypeCreateFormInputValues = {
  name?: string;
  description?: string;
  status?: string;
};
export declare type PaymentTypeCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  description?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentTypeCreateFormOverridesProps = {
  PaymentTypeCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  description?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type PaymentTypeCreateFormProps = React.PropsWithChildren<
  {
    overrides?: PaymentTypeCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PaymentTypeCreateFormInputValues) => PaymentTypeCreateFormInputValues;
    onSuccess?: (fields: PaymentTypeCreateFormInputValues) => void;
    onError?: (fields: PaymentTypeCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: PaymentTypeCreateFormInputValues) => PaymentTypeCreateFormInputValues;
    onValidate?: PaymentTypeCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function PaymentTypeCreateForm(
  props: PaymentTypeCreateFormProps
): React.ReactElement;
