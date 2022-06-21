import { RequestHandler } from 'ask-sdk-core';

import { IntentTypes, skillHelpers, Strings } from '../../lib';

export const GetClientName: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.GetClientNameIntent);
    },
    handle(handlerInput) {
        const { tr } = skillHelpers.getRequestAttributes(handlerInput);

        const speechText = tr(Strings.HELLO_MSG);

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
