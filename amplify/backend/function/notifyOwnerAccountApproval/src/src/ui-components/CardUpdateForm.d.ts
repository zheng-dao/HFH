/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { Card } from '../models';
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
export declare type CardUpdateFormInputValues = {
  name?: string;
  number?: string;
  status?: string;
  type?: string;
};
export declare type CardUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  number?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
  type?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CardUpdateFormOverridesProps = {
  CardUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  number?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
  type?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type CardUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: CardUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    card?: Card;
    onSubmit?: (fields: CardUpdateFormInputValues) => CardUpdateFormInputValues;
    onSuccess?: (fields: CardUpdateFormInputValues) => void;
    onError?: (fields: CardUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: CardUpdateFormInputValues) => CardUpdateFormInputValues;
    onValidate?: CardUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function CardUpdateForm(props: CardUpdateFormProps): React.ReactElement;
