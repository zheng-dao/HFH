/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { PaymentType } from '../models';
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
export declare type PaymentTypeUpdateFormInputValues = {
  name?: string;
  description?: string;
  status?: string;
};
export declare type PaymentTypeUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  description?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentTypeUpdateFormOverridesProps = {
  PaymentTypeUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  description?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type PaymentTypeUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: PaymentTypeUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    paymentType?: PaymentType;
    onSubmit?: (fields: PaymentTypeUpdateFormInputValues) => PaymentTypeUpdateFormInputValues;
    onSuccess?: (fields: PaymentTypeUpdateFormInputValues) => void;
    onError?: (fields: PaymentTypeUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: PaymentTypeUpdateFormInputValues) => PaymentTypeUpdateFormInputValues;
    onValidate?: PaymentTypeUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function PaymentTypeUpdateForm(
  props: PaymentTypeUpdateFormProps
): React.ReactElement;
