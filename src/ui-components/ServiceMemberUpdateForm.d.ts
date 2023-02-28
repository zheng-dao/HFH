/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { ServiceMember } from '../models';
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
export declare type ServiceMemberUpdateFormInputValues = {
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
export declare type ServiceMemberUpdateFormValidationValues = {
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
export declare type ServiceMemberUpdateFormOverridesProps = {
  ServiceMemberUpdateFormGrid?: FormProps<GridProps>;
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
export declare type ServiceMemberUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: ServiceMemberUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    serviceMember?: ServiceMember;
    onSubmit?: (fields: ServiceMemberUpdateFormInputValues) => ServiceMemberUpdateFormInputValues;
    onSuccess?: (fields: ServiceMemberUpdateFormInputValues) => void;
    onError?: (fields: ServiceMemberUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: ServiceMemberUpdateFormInputValues) => ServiceMemberUpdateFormInputValues;
    onValidate?: ServiceMemberUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function ServiceMemberUpdateForm(
  props: ServiceMemberUpdateFormProps
): React.ReactElement;
