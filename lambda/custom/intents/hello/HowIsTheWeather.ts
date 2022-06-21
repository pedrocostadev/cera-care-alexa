import { RequestHandler } from 'ask-sdk-core';

import { IntentTypes, skillHelpers, Strings } from '../../lib';

export const HowIsTheWeather: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.HowIsTheWeather);
    },
    handle(handlerInput) {
        const { tr } = skillHelpers.getRequestAttributes(handlerInput);

        const speechText = tr(Strings.STRINGARRAY_MSG);

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
