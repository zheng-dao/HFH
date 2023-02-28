/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { EscapeHatchProps } from '@aws-amplify/ui-react/internal';
import { GridProps, TextFieldProps } from '@aws-amplify/ui-react';
export declare type ValidationResponse = {
  hasError: boolean;
  errorMessage?: string;
};
export declare type ValidationFunction<T> = (
  value: T,
  validationResponse: ValidationResponse
) => ValidationResponse | Promise<ValidationResponse>;
export declare type ConfigurationSettingCreateFormInputValues = {
  name?: string;
  value?: string;
};
export declare type ConfigurationSettingCreateFormValidationValues = {
  name?: ValidationFunction<string>;
  value?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ConfigurationSettingCreateFormOverridesProps = {
  ConfigurationSettingCreateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  value?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ConfigurationSettingCreateFormProps = React.PropsWithChildren<
  {
    overrides?: ConfigurationSettingCreateFormOverridesProps | undefined | null;
  } & {
    clearOnSuccess?: boolean;
    onSubmit?: (
      fields: ConfigurationSettingCreateFormInputValues
    ) => ConfigurationSettingCreateFormInputValues;
    onSuccess?: (fields: ConfigurationSettingCreateFormInputValues) => void;
    onError?: (fields: ConfigurationSettingCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (
      fields: ConfigurationSettingCreateFormInputValues
    ) => ConfigurationSettingCreateFormInputValues;
    onValidate?: ConfigurationSettingCreateFormValidationValues;
  } & React.CSSProperties
>;
export default function ConfigurationSettingCreateForm(
  props: ConfigurationSettingCreateFormProps
): React.ReactElement;
