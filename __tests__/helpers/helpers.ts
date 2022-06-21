import { RequestEnvelope, ResponseEnvelope, ui } from 'ask-sdk-model';
import { Resource } from 'i18next';
import _ from 'lodash';

import { handler } from '../../lambda/custom';
import { logHelpers } from '../../lambda/custom/lib';
import { ConsoleColorBg, ConsoleColorFg, ConsoleConfig, LocaleTypes } from '../../lambda/custom/lib/constants';
import { localeHelpers } from '../../lambda/custom/lib/localeHelper';
import { ResponseBuilder } from './ResponseBuilder';

export type PartialDeep<T> = {
    [P in keyof T]?: PartialDeep<T[P]>;
};

let locales: LocaleTypes[][];
let logging: boolean;

/**
 * build the test pipeline.
 * @param config the configuration for tests
 */
function buildTestPipeline(config: {
    resource: Resource | string,
    timeout?: number,
    logging?: boolean,
    locales?: LocaleTypes[][]
}, jestPipeline: (locale: LocaleTypes) => any) {

    logging = config.logging ?? false;
    locales = config.locales ?? [[LocaleTypes.enGB]];

    const processTests = describe.each(locales);

    processTests('Running test for %s', (...locales: LocaleTypes[]) => {
        const locale = locales[0];

        beforeAll(() => localeHelpers.setResource(locale, config.resource));

        return jestPipeline(locale);
    }, config.timeout);
}

/**
 * Accepts a partial T object and returns it as T.
 * Useful when you only need a few fields of T but still want to get type
 * completions and to suppress compilation error.
 * 
 * @param value 
 */
function partial<T>(value: PartialDeep<T>): T {
    return value as T;
}

/**
 * expect the responseBuilder that contains the arrays contains de response from the responseEnvelope.
 * @param matcher @type{ResponseBuilder}
 * @param responseEnvelope @type{ResponseEnvelope}
 */
function expectResponseArray(matcher: ResponseBuilder, responseEnvelope: ResponseEnvelope) {
    const responseMatcher = matcher.getResponse();
    var array = (responseMatcher.response.outputSpeech as ui.SsmlOutputSpeech).ssml as any as string[];

    expect.extend({
        toBe(input: string) {
            let clearText = replaceAllTags(input);

            return {
                message: () => `expected '${clearText}' to be included in array [${array.join(', ')}].`,
                pass: array.some(ar => ar.includes(clearText)),
            };
        }
    });

    expect((responseEnvelope.response.outputSpeech as ui.SsmlOutputSpeech).ssml).toBe(array);

    if (!_.isNil(responseEnvelope.response.canFulfillIntent)) {
        expect(responseEnvelope.response.canFulfillIntent).toMatchObject(responseMatcher.response.canFulfillIntent as any);
    }
    if (!_.isNil(responseEnvelope.response.shouldEndSession)) {
        expect(responseEnvelope.response.shouldEndSession).toMatchObject(responseMatcher.response.shouldEndSession as any);
    }
    if (!_.isNil(responseEnvelope.response.apiResponse)) {
        expect(responseEnvelope.response.apiResponse).toMatchObject(responseMatcher.response.apiResponse as any);
    }
    if (!_.isNil(responseEnvelope.response.directives)) {
        expect(responseEnvelope.response.directives).toMatchObject(responseMatcher.response.directives as any);
    }
    if (!_.isNil(responseEnvelope.response.reprompt)) {
        expect(responseEnvelope.response.reprompt).toMatchObject(responseMatcher.response.reprompt as any);
    }
    if (!_.isNil(responseEnvelope.response.card)) {
        expect(responseEnvelope.response.card).toMatchObject(responseMatcher.response.card as any);
    }
}
/**
 * Replace all tags in a string for empty spaces. w
 * @param input string to replace all tags
 * @returns a string without tags
 */
function replaceAllTags(input: string): string {
    var regex = new RegExp(/\<\/?\w+\>/);
    do {
        input = input.replace(regex, '');
    }
    while (input.match(regex));
    return input;
}

/**
 * Calls the skill handler with the given RequestEnvelope. Returns a promise
 * with the response.
 * 
 * @param event 
 */
function skill(event: RequestEnvelope): Promise<ResponseEnvelope> {
    return new Promise((fulfill, reject) => {
        return handler(event, null, (err, res) => {
            if (err) return reject(err);
            return fulfill(res);
        });
    });
}

function logEvents(config: { console?: ConsoleConfig, fgColor?: ConsoleColorFg, bgColor?: ConsoleColorBg } = {}, title: string, object: any) {
    if (logging) {
        logHelpers.logCustom(config, title, object);
    }
}
export const helpers = {
    expectResponseArray,
    buildTestPipeline,
    partial,
    skill,
    logEvents
}