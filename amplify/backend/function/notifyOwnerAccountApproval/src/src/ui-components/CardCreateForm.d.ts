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
export declare type CardCreateFormInputValues = {
  name?: string;
  number?: string;
  status?: string;
  type?: string;
};
export declare type CardCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  number?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
  type?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CardCreateFormOverridesProps = {
  CardCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  number?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
  type?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type CardCreateFormProps = React.PropsWithChildren<
  {
    overrides?: CardCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CardCreateFormInputValues) => CardCreateFormInputValues;
    onSuccess?: (fields: CardCreateFormInputValues) => void;
    onError?: (fields: CardCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: CardCreateFormInputValues) => CardCreateFormInputValues;
    onValidate?: CardCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function CardCreateForm(props: CardCreateFormProps): React.ReactElement;
