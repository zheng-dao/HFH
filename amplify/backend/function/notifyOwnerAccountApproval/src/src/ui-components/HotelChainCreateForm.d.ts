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
export declare type HotelChainCreateFormInputValues = {
  name?: string;
  status?: string;
};
export declare type HotelChainCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type HotelChainCreateFormOverridesProps = {
  HotelChainCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type HotelChainCreateFormProps = React.PropsWithChildren<
  {
    overrides?: HotelChainCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: HotelChainCreateFormInputValues) => HotelChainCreateFormInputValues;
    onSuccess?: (fields: HotelChainCreateFormInputValues) => void;
    onError?: (fields: HotelChainCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: HotelChainCreateFormInputValues) => HotelChainCreateFormInputValues;
    onValidate?: HotelChainCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function HotelChainCreateForm(props: HotelChainCreateFormProps): React.ReactElement;
