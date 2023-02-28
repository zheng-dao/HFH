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
export declare type HotelPropertyCreateFormInputValues = {
  name?: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  contact_name?: string;
  contact_position?: string;
  telephone?: string;
  email?: string;
  is_blacklist?: boolean;
  status?: string;
  extension?: string;
};
export declare type HotelPropertyCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  address?: ValidationFunction<string>;
  address_2?: ValidationFunction<string>;
  city?: ValidationFunction<string>;
  state?: ValidationFunction<string>;
  zip?: ValidationFunction<string>;
  contact_name?: ValidationFunction<string>;
  contact_position?: ValidationFunction<string>;
  telephone?: ValidationFunction<string>;
  email?: ValidationFunction<string>;
  is_blacklist?: ValidationFunction<boolean>;
  status?: ValidationFunction<string>;
  extension?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type HotelPropertyCreateFormOverridesProps = {
  HotelPropertyCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  address?: FormProps<TextFieldProps>;
  address_2?: FormProps<TextFieldProps>;
  city?: FormProps<TextFieldProps>;
  state?: FormProps<TextFieldProps>;
  zip?: FormProps<TextFieldProps>;
  contact_name?: FormProps<TextFieldProps>;
  contact_position?: FormProps<TextFieldProps>;
  telephone?: FormProps<TextFieldProps>;
  email?: FormProps<TextFieldProps>;
  is_blacklist?: FormProps<SwitchFieldProps>;
  status?: FormProps<SelectFieldProps>;
  extension?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type HotelPropertyCreateFormProps = React.PropsWithChildren<
  {
    overrides?: HotelPropertyCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: HotelPropertyCreateFormInputValues) => HotelPropertyCreateFormInputValues;
    onSuccess?: (fields: HotelPropertyCreateFormInputValues) => void;
    onError?: (fields: HotelPropertyCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: HotelPropertyCreateFormInputValues) => HotelPropertyCreateFormInputValues;
    onValidate?: HotelPropertyCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function HotelPropertyCreateForm(
  props: HotelPropertyCreateFormProps
): React.ReactElement;
