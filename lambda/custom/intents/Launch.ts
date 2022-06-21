import { RequestHandler } from 'ask-sdk-core';

import { errorHelper, RequestTypes, skillHelpers, Strings } from '../lib';

export const Launch: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isType(handlerInput, RequestTypes.Launch);
    },
    handle(handlerInput) {
        try {
            const { tr } = skillHelpers.getRequestAttributes(handlerInput);

            const speechText = tr(Strings.WELCOME_MSG);

            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
        }
        catch (e) {
            const error = (e as Error);
            throw errorHelper.createError(error);
        }
    }
};
