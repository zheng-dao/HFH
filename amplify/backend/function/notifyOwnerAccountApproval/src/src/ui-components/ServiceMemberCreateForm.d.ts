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
export declare type ServiceMemberCreateFormInputValues = {
  first_name?: string;
  middle_initial?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  extension?: string;
  branch_of_service?: string;
  current_status?: string;
  on_military_travel_orders?: boolean;
  other_patient?: boolean;
  lodging_explanation?: string;
  unidentified_explanation?: string;
};
export declare type ServiceMemberCreateFormValidationValues = {
  first_name?: ValidationFunction<string>;
  middle_initial?: ValidationFunction<string>;
  last_name?: ValidationFunction<string>;
  email?: ValidationFunction<string>;
  telephone?: ValidationFunction<string>;
  extension?: ValidationFunction<string>;
  branch_of_service?: ValidationFunction<string>;
  current_status?: ValidationFunction<string>;
  on_military_travel_orders?: ValidationFunction<boolean>;
  other_patient?: ValidationFunction<boolean>;
  lodging_explanation?: ValidationFunction<string>;
  unidentified_explanation?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ServiceMemberCreateFormOverridesProps = {
  ServiceMemberCreateFormGrid?: FormProps<GridProps>;
  first_name?: FormProps<TextFieldProps>;
  middle_initial?: FormProps<TextFieldProps>;
  last_name?: FormProps<TextFieldProps>;
  email?: FormProps<TextFieldProps>;
  telephone?: FormProps<TextFieldProps>;
  extension?: FormProps<TextFieldProps>;
  branch_of_service?: FormProps<SelectFieldProps>;
  current_status?: FormProps<SelectFieldProps>;
  on_military_travel_orders?: FormProps<SwitchFieldProps>;
  other_patient?: FormProps<SwitchFieldProps>;
  lodging_explanation?: FormProps<TextFieldProps>;
  unidentified_explanation?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ServiceMemberCreateFormProps = React.PropsWithChildren<
  {
    overrides?: ServiceMemberCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ServiceMemberCreateFormInputValues) => ServiceMemberCreateFormInputValues;
    onSuccess?: (fields: ServiceMemberCreateFormInputValues) => void;
    onError?: (fields: ServiceMemberCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: ServiceMemberCreateFormInputValues) => ServiceMemberCreateFormInputValues;
    onValidate?: ServiceMemberCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function ServiceMemberCreateForm(
  props: ServiceMemberCreateFormProps
): React.ReactElement;
