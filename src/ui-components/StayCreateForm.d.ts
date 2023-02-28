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
export declare type StayCreateFormInputValues = {
  type?: string;
  state?: string;
  reservation_number?: string;
  payment_type?: string;
  payment_points_used?: string;
  payment_cost_of_reservation?: string;
  checkout_points_used?: string;
  checkout_cost_of_reservation?: string;
  requested_check_in?: string;
  requested_check_out?: string;
  status?: string;
  actual_check_in?: string;
  actual_check_out?: string;
  guest_stayed_at_hotel?: boolean;
  reason_guest_did_not_stay?: string;
  payment_incidental_cost?: string;
  charge_type?: string;
  card?: string;
  note?: string;
  reconciled?: boolean;
  ready_for_final_reconcile?: boolean;
  comment?: string;
  comparable_cost?: string;
  certificate_number?: string;
  confirmation_number?: string;
  card_used_for_incidentals?: boolean;
  room_type_requests?: string;
  room_feature_requests?: string[];
  room_type_actual?: string;
  room_feature_actual?: string[];
  room_description?: string;
  reason_decline?: string;
  reason_return?: string;
  charge_reconcile?: boolean;
  hotel_reconcile?: boolean;
  points_reconcile?: boolean;
  giftcard_reconcile?: boolean;
  batch_no?: string;
  city?: string;
  narrative?: string;
  special_requests?: string;
};
export declare type StayCreateFormValidationValues = {
  type?: ValidationFunction<string>;
  state?: ValidationFunction<string>;
  reservation_number?: ValidationFunction<string>;
  payment_type?: ValidationFunction<string>;
  payment_points_used?: ValidationFunction<string>;
  payment_cost_of_reservation?: ValidationFunction<string>;
  checkout_points_used?: ValidationFunction<string>;
  checkout_cost_of_reservation?: ValidationFunction<string>;
  requested_check_in?: ValidationFunction<string>;
  requested_check_out?: ValidationFunction<string>;
  status?: ValidationFunction<string>;
  actual_check_in?: ValidationFunction<string>;
  actual_check_out?: ValidationFunction<string>;
  guest_stayed_at_hotel?: ValidationFunction<boolean>;
  reason_guest_did_not_stay?: ValidationFunction<string>;
  payment_incidental_cost?: ValidationFunction<string>;
  charge_type?: ValidationFunction<string>;
  card?: ValidationFunction<string>;
  note?: ValidationFunction<string>;
  reconciled?: ValidationFunction<boolean>;
  ready_for_final_reconcile?: ValidationFunction<boolean>;
  comment?: ValidationFunction<string>;
  comparable_cost?: ValidationFunction<string>;
  certificate_number?: ValidationFunction<string>;
  confirmation_number?: ValidationFunction<string>;
  card_used_for_incidentals?: ValidationFunction<boolean>;
  room_type_requests?: ValidationFunction<string>;
  room_feature_requests?: ValidationFunction<string>;
  room_type_actual?: ValidationFunction<string>;
  room_feature_actual?: ValidationFunction<string>;
  room_description?: ValidationFunction<string>;
  reason_decline?: ValidationFunction<string>;
  reason_return?: ValidationFunction<string>;
  charge_reconcile?: ValidationFunction<boolean>;
  hotel_reconcile?: ValidationFunction<boolean>;
  points_reconcile?: ValidationFunction<boolean>;
  giftcard_reconcile?: ValidationFunction<boolean>;
  batch_no?: ValidationFunction<string>;
  city?: ValidationFunction<string>;
  narrative?: ValidationFunction<string>;
  special_requests?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type StayCreateFormOverridesProps = {
  StayCreateFormGrid?: FormProps<GridProps>;
  type?: FormProps<SelectFieldProps>;
  state?: FormProps<TextFieldProps>;
  reservation_number?: FormProps<TextFieldProps>;
  payment_type?: FormProps<TextFieldProps>;
  payment_points_used?: FormProps<TextFieldProps>;
  payment_cost_of_reservation?: FormProps<TextFieldProps>;
  checkout_points_used?: FormProps<TextFieldProps>;
  checkout_cost_of_reservation?: FormProps<TextFieldProps>;
  requested_check_in?: FormProps<TextFieldProps>;
  requested_check_out?: FormProps<TextFieldProps>;
  status?: FormProps<SelectFieldProps>;
  actual_check_in?: FormProps<TextFieldProps>;
  actual_check_out?: FormProps<TextFieldProps>;
  guest_stayed_at_hotel?: FormProps<SwitchFieldProps>;
  reason_guest_did_not_stay?: FormProps<TextFieldProps>;
  payment_incidental_cost?: FormProps<TextFieldProps>;
  charge_type?: FormProps<TextFieldProps>;
  card?: FormProps<TextFieldProps>;
  note?: FormProps<TextFieldProps>;
  reconciled?: FormProps<SwitchFieldProps>;
  ready_for_final_reconcile?: FormProps<SwitchFieldProps>;
  comment?: FormProps<TextFieldProps>;
  comparable_cost?: FormProps<TextFieldProps>;
  certificate_number?: FormProps<TextFieldProps>;
  confirmation_number?: FormProps<TextFieldProps>;
  card_used_for_incidentals?: FormProps<SwitchFieldProps>;
  room_type_requests?: FormProps<SelectFieldProps>;
  room_feature_requests?: FormProps<SelectFieldProps>;
  room_type_actual?: FormProps<SelectFieldProps>;
  room_feature_actual?: FormProps<SelectFieldProps>;
  room_description?: FormProps<TextFieldProps>;
  reason_decline?: FormProps<TextFieldProps>;
  reason_return?: FormProps<TextFieldProps>;
  charge_reconcile?: FormProps<SwitchFieldProps>;
  hotel_reconcile?: FormProps<SwitchFieldProps>;
  points_reconcile?: FormProps<SwitchFieldProps>;
  giftcard_reconcile?: FormProps<SwitchFieldProps>;
  batch_no?: FormProps<TextFieldProps>;
  city?: FormProps<TextFieldProps>;
  narrative?: FormProps<TextFieldProps>;
  special_requests?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type StayCreateFormProps = React.PropsWithChildren<
  {
    overrides?: StayCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: StayCreateFormInputValues) => StayCreateFormInputValues;
    onSuccess?: (fields: StayCreateFormInputValues) => void;
    onError?: (fields: StayCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: StayCreateFormInputValues) => StayCreateFormInputValues;
    onValidate?: StayCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function StayCreateForm(props: StayCreateFormProps): React.ReactElement;
