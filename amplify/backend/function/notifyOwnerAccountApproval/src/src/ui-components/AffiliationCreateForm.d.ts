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
export declare type AffiliationCreateFormInputValues = {
  name?: string;
  type?: string;
  status?: string;
  display_name?: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  branch?: string;
};
export declare type AffiliationCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  type?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
  display_name?: ValidationFunction<string>;
  address?: ValidationFunction<string>;
  address_2?: ValidationFunction<string>;
  city?: ValidationFunction<string>;
  state?: ValidationFunction<string>;
  zip?: ValidationFunction<string>;
  branch?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AffiliationCreateFormOverridesProps = {
  AffiliationCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  type?: FormProps<SelectFieldProps>;
  status?: FormProps<SelectFieldProps>;
  display_name?: FormProps<TextFieldProps>;
  address?: FormProps<TextFieldProps>;
  address_2?: FormProps<TextFieldProps>;
  city?: FormProps<TextFieldProps>;
  state?: FormProps<TextFieldProps>;
  zip?: FormProps<TextFieldProps>;
  branch?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type AffiliationCreateFormProps = React.PropsWithChildren<
  {
    overrides?: AffiliationCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AffiliationCreateFormInputValues) => AffiliationCreateFormInputValues;
    onSuccess?: (fields: AffiliationCreateFormInputValues) => void;
    onError?: (fields: AffiliationCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: AffiliationCreateFormInputValues) => AffiliationCreateFormInputValues;
    onValidate?: AffiliationCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function AffiliationCreateForm(
  props: AffiliationCreateFormProps
): React.ReactElement;
