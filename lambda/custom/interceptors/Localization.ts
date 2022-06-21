import { RequestInterceptor, getLocale } from "ask-sdk-core";
import { RequestAttributes } from "../interfaces";
import i18next from 'i18next';
import { localeHelpers, LocaleTypes, skillHelpers } from "../lib";
import { getLocalePath } from '../locales/locale';

/**
 * Adds translation functions to the RequestAttributes.
 */
export const Localization: RequestInterceptor = {
    process(handlerInput) {
        const localeType = getLocale(handlerInput.requestEnvelope) as LocaleTypes;
        localeHelpers.setResource(localeType, getLocalePath());

        const attributes = handlerInput.attributesManager.getRequestAttributes() as RequestAttributes;
        attributes.t = function (key: string, ...args: any[]) {
            return i18next.t(key, args)
        };

        attributes.tr = function (key: any, ...args: any[]) {
            const result = i18next.t<string[]>(key, args);

            return skillHelpers.random(result);
        };
    },
};
