import { RequestHandler } from 'ask-sdk-core';

import { IntentTypes, skillHelpers, Strings } from '../lib';

export const Fallback: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.Fallback);
    },
    handle(handlerInput) {
        const { tr } = skillHelpers.getRequestAttributes(handlerInput);

        const speechText = tr(Strings.ERROR_MSG);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(tr(Strings.HELP_MSG))
            .getResponse();
    }
};
