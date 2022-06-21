import { RequestHandler } from 'ask-sdk-core';

import { RequestTypes, skillHelpers, Strings } from '../lib';

export const Launch: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isType(handlerInput, RequestTypes.Launch);
    },
    handle(handlerInput) {
        const { t: tr, t } = skillHelpers.getRequestAttributes(handlerInput);

        const speechText = tr(Strings.WELCOME_MSG);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(t(Strings.SKILL_NAME), speechText)
            .getResponse();
    }
};
