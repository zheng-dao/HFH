/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { Group } from '../models';
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
export declare type GroupUpdateFormInputValues = {
  name?: string;
  status?: string;
};
export declare type GroupUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GroupUpdateFormOverridesProps = {
  GroupUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type GroupUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: GroupUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    group?: Group;
    onSubmit?: (fields: GroupUpdateFormInputValues) => GroupUpdateFormInputValues;
    onSuccess?: (fields: GroupUpdateFormInputValues) => void;
    onError?: (fields: GroupUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: GroupUpdateFormInputValues) => GroupUpdateFormInputValues;
    onValidate?: GroupUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function GroupUpdateForm(props: GroupUpdateFormProps): React.ReactElement;
