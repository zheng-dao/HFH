/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { HotelProperty } from '../models';
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
export declare type HotelPropertyUpdateFormInputValues = {
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
export declare type HotelPropertyUpdateFormValidationValues = {
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
export declare type HotelPropertyUpdateFormOverridesProps = {
  HotelPropertyUpdateFormGrid?: FormProps<GridProps>;
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
export declare type HotelPropertyUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: HotelPropertyUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    hotelProperty?: HotelProperty;
    onSubmit?: (fields: HotelPropertyUpdateFormInputValues) => HotelPropertyUpdateFormInputValues;
    onSuccess?: (fields: HotelPropertyUpdateFormInputValues) => void;
    onError?: (fields: HotelPropertyUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: HotelPropertyUpdateFormInputValues) => HotelPropertyUpdateFormInputValues;
    onValidate?: HotelPropertyUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function HotelPropertyUpdateForm(
  props: HotelPropertyUpdateFormProps
): React.ReactElement;
