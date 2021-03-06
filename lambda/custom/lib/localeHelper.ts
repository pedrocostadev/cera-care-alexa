import i18next, { InitOptions, Resource } from 'i18next';
import _ from 'lodash';
import { join } from 'path';

import { LocaleTypes } from './constants';

import Backend from 'i18next-fs-backend';

const options: InitOptions = {
    initImmediate: false,
    returnObjects: true,
};

/**
 * 
 * @param locale the locale
 * @param resource the resource. If the resource is a path, the locales need be the follow pattern *path/en-US.json
 */
function setResource(locale: LocaleTypes, resource: Resource | string) {

    options.lng = locale;

    switch (true) {
        case _.isString(resource):
            options.backend = {
                loadPath: join(resource as string, `/${locale}.json`)
            }
            break;
        default:
            options.resources = resource as Resource;
            break;
    }
    i18next.use(Backend).init(options);
}

export const localeHelpers = {
    setResource
}