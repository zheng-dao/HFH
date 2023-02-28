/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { Application } from '../models';
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
export declare type ApplicationUpdateFormInputValues = {
  status?: string;
  liaison_read?: string;
  admin_read?: string;
  exception_narrative?: string;
  liaison_terms_of_use_agreement?: boolean;
  sm_terms_of_use_agreement?: boolean;
};
export declare type ApplicationUpdateFormValidationValues = {
  status?: ValidationFunction<string>;
  liaison_read?: ValidationFunction<string>;
  admin_read?: ValidationFunction<string>;
  exception_narrative?: ValidationFunction<string>;
  liaison_terms_of_use_agreement?: ValidationFunction<boolean>;
  sm_terms_of_use_agreement?: ValidationFunction<boolean>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApplicationUpdateFormOverridesProps = {
  ApplicationUpdateFormGrid?: FormProps<GridProps>;
  status?: FormProps<SelectFieldProps>;
  liaison_read?: FormProps<SelectFieldProps>;
  admin_read?: FormProps<SelectFieldProps>;
  exception_narrative?: FormProps<TextFieldProps>;
  liaison_terms_of_use_agreement?: FormProps<SwitchFieldProps>;
  sm_terms_of_use_agreement?: FormProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ApplicationUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: ApplicationUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    application?: Application;
    onSubmit?: (fields: ApplicationUpdateFormInputValues) => ApplicationUpdateFormInputValues;
    onSuccess?: (fields: ApplicationUpdateFormInputValues) => void;
    onError?: (fields: ApplicationUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: ApplicationUpdateFormInputValues) => ApplicationUpdateFormInputValues;
    onValidate?: ApplicationUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function ApplicationUpdateForm(
  props: ApplicationUpdateFormProps
): React.ReactElement;
