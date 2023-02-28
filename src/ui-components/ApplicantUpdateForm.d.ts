/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { Applicant } from '../models';
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
export declare type ApplicantUpdateFormInputValues = {
  first_name?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  signature?: string;
  job?: string;
  branch_of_service?: string;
  current_status?: string;
  base_assigned_to?: string;
  relation_to_service_member?: string;
  referrer_date?: string;
  user_type?: string;
  middle_initial?: string;
  patient_type?: string;
  extension?: string;
  family_lodge?: string;
  location_name?: string;
  location_address?: string;
  lodging_explanation?: string;
  affiliation_type?: string;
  collected_outside_fisherhouse?: boolean;
};
export declare type ApplicantUpdateFormValidationValues = {
  first_name?: ValidationFunction<string>;
  last_name?: ValidationFunction<string>;
  email?: ValidationFunction<string>;
  telephone?: ValidationFunction<string>;
  signature?: ValidationFunction<string>;
  job?: ValidationFunction<string>;
  branch_of_service?: ValidationFunction<string>;
  current_status?: ValidationFunction<string>;
  base_assigned_to?: ValidationFunction<string>;
  relation_to_service_member?: ValidationFunction<string>;
  referrer_date?: ValidationFunction<string>;
  user_type?: ValidationFunction<string>;
  middle_initial?: ValidationFunction<string>;
  patient_type?: ValidationFunction<string>;
  extension?: ValidationFunction<string>;
  family_lodge?: ValidationFunction<string>;
  location_name?: ValidationFunction<string>;
  location_address?: ValidationFunction<string>;
  lodging_explanation?: ValidationFunction<string>;
  affiliation_type?: ValidationFunction<string>;
  collected_outside_fisherhouse?: ValidationFunction<boolean>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApplicantUpdateFormOverridesProps = {
  ApplicantUpdateFormGrid?: FormProps<GridProps>;
  first_name?: FormProps<TextFieldProps>;
  last_name?: FormProps<TextFieldProps>;
  email?: FormProps<TextFieldProps>;
  telephone?: FormProps<TextFieldProps>;
  signature?: FormProps<TextFieldProps>;
  job?: FormProps<TextFieldProps>;
  branch_of_service?: FormProps<TextFieldProps>;
  current_status?: FormProps<TextFieldProps>;
  base_assigned_to?: FormProps<TextFieldProps>;
  relation_to_service_member?: FormProps<TextFieldProps>;
  referrer_date?: FormProps<TextFieldProps>;
  user_type?: FormProps<TextFieldProps>;
  middle_initial?: FormProps<TextFieldProps>;
  patient_type?: FormProps<TextFieldProps>;
  extension?: FormProps<TextFieldProps>;
  family_lodge?: FormProps<TextFieldProps>;
  location_name?: FormProps<TextFieldProps>;
  location_address?: FormProps<TextFieldProps>;
  lodging_explanation?: FormProps<TextFieldProps>;
  affiliation_type?: FormProps<SelectFieldProps>;
  collected_outside_fisherhouse?: FormProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ApplicantUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: ApplicantUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    applicant?: Applicant;
    onSubmit?: (fields: ApplicantUpdateFormInputValues) => ApplicantUpdateFormInputValues;
    onSuccess?: (fields: ApplicantUpdateFormInputValues) => void;
    onError?: (fields: ApplicantUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: ApplicantUpdateFormInputValues) => ApplicantUpdateFormInputValues;
    onValidate?: ApplicantUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function ApplicantUpdateForm(props: ApplicantUpdateFormProps): React.ReactElement;
