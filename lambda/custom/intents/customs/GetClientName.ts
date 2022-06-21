import { RequestHandler } from 'ask-sdk-core';

import { IntentTypes, skillHelpers, Strings } from '../../lib';

export const GetClientName: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.GetClientNameIntent);
    },
    handle(handlerInput) {
        const { t } = skillHelpers.getRequestAttributes(handlerInput);

        const speechText = t(Strings.HELLO_MSG);

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(t(Strings.SKILL_NAME), speechText)
            .getResponse();
    }
};
