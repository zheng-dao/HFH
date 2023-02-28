/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { HotelBrand } from '../models';
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
export declare type HotelBrandUpdateFormInputValues = {
  name?: string;
  status?: string;
  logo?: string;
};
export declare type HotelBrandUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
  logo?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type HotelBrandUpdateFormOverridesProps = {
  HotelBrandUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
  logo?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type HotelBrandUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: HotelBrandUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    hotelBrand?: HotelBrand;
    onSubmit?: (fields: HotelBrandUpdateFormInputValues) => HotelBrandUpdateFormInputValues;
    onSuccess?: (fields: HotelBrandUpdateFormInputValues) => void;
    onError?: (fields: HotelBrandUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: HotelBrandUpdateFormInputValues) => HotelBrandUpdateFormInputValues;
    onValidate?: HotelBrandUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function HotelBrandUpdateForm(props: HotelBrandUpdateFormProps): React.ReactElement;
