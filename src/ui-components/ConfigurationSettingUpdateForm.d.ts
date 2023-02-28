/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from 'react';
import { ConfigurationSetting } from '../models';
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
export declare type ConfigurationSettingUpdateFormInputValues = {
  name?: string;
  value?: string;
};
export declare type ConfigurationSettingUpdateFormValidationValues = {
  name?: ValidationFunction<string>;
  value?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ConfigurationSettingUpdateFormOverridesProps = {
  ConfigurationSettingUpdateFormGrid?: FormProps<GridProps>;
  name?: FormProps<TextFieldProps>;
  value?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ConfigurationSettingUpdateFormProps = React.PropsWithChildren<
  {
    overrides?: ConfigurationSettingUpdateFormOverridesProps | undefined | null;
  } & {
    id?: string;
    configurationSetting?: ConfigurationSetting;
    onSubmit?: (
      fields: ConfigurationSettingUpdateFormInputValues
    ) => ConfigurationSettingUpdateFormInputValues;
    onSuccess?: (fields: ConfigurationSettingUpdateFormInputValues) => void;
    onError?: (fields: ConfigurationSettingUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (
      fields: ConfigurationSettingUpdateFormInputValues
    ) => ConfigurationSettingUpdateFormInputValues;
    onValidate?: ConfigurationSettingUpdateFormValidationValues;
  } & React.CSSProperties
>;
export default function ConfigurationSettingUpdateForm(
  props: ConfigurationSettingUpdateFormProps
): React.ReactElement;
