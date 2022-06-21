import * as Alexa from 'ask-sdk-core';

import * as Errors from './errors';
import * as DefaultIntents from './intents';
import * as CustomIntents from './intents/hello';
import * as Interceptors from './interceptors';

export const handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        // Intents.Debug,

        // Default intents
        DefaultIntents.Launch,
        DefaultIntents.Help,
        DefaultIntents.Stop,
        DefaultIntents.SessionEnded,
        DefaultIntents.SystemExceptionEncountered,
        DefaultIntents.Fallback,

        // Hello intents
        CustomIntents.HelloWorld,
        CustomIntents.HowIsTheWeather
    )
    .addErrorHandlers(
        Errors.Unknown,
        Errors.Unexpected
    )
    .addRequestInterceptors(
        Interceptors.Localization,
        Interceptors.SlotInterceptor,
        Interceptors.LogRequest,
    ).addResponseInterceptors(
        Interceptors.LogResponse
    )
    .lambda();
