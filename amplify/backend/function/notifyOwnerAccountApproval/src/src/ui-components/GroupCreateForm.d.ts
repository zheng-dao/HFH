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
export declare type GroupCreateFormInputValues = {
  name?: string;
  status?: string;
};
export declare type GroupCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GroupCreateFormOverridesProps = {
  GroupCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type GroupCreateFormProps = React.PropsWithChildren<
  {
    overrides?: GroupCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: GroupCreateFormInputValues) => GroupCreateFormInputValues;
    onSuccess?: (fields: GroupCreateFormInputValues) => void;
    onError?: (fields: GroupCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: GroupCreateFormInputValues) => GroupCreateFormInputValues;
    onValidate?: GroupCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function GroupCreateForm(props: GroupCreateFormProps): React.ReactElement;
