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
export declare type HotelBrandCreateFormInputValues = {
  name?: string;
  status?: string;
  logo?: string;
};
export declare type HotelBrandCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
  logo?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type HotelBrandCreateFormOverridesProps = {
  HotelBrandCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
  logo?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type HotelBrandCreateFormProps = React.PropsWithChildren<
  {
    overrides?: HotelBrandCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: HotelBrandCreateFormInputValues) => HotelBrandCreateFormInputValues;
    onSuccess?: (fields: HotelBrandCreateFormInputValues) => void;
    onError?: (fields: HotelBrandCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: HotelBrandCreateFormInputValues) => HotelBrandCreateFormInputValues;
    onValidate?: HotelBrandCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function HotelBrandCreateForm(props: HotelBrandCreateFormProps): React.ReactElement;
