import { RequestHandler } from 'ask-sdk-core';

import { AttributesSession, errorHelper, IntentTypes, skillHelpers, SlotsTypes, Strings } from '../../lib';
import {
    IntentRequest,
} from 'ask-sdk-model';
import _ from 'lodash';

export const GetVisitDateTime: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.GetVisitDateTimeIntent);
    },
    handle(handlerInput) {
        try {
            const { tr } = skillHelpers.getRequestAttributes(handlerInput);

            let visitDateTime: { date: string, time: string };
            let speechText: string = "";
            const slots = skillHelpers.getSlotValues((handlerInput.requestEnvelope.request as IntentRequest).intent.slots);

            switch (true) {
                case !_.isEmpty(slots[SlotsTypes.VisitDateSlot].value) && _.isEmpty(slots[SlotsTypes.VisitTimeSlot].value):
                    visitDateTime = {
                        date: slots[SlotsTypes.VisitDateSlot].value,
                        time: ""
                    };
                    speechText = tr(Strings.ASK_VISIT_TIME_MSG);

                    break;
                case !_.isEmpty(slots[SlotsTypes.VisitDateSlot].value) && !_.isEmpty(slots[SlotsTypes.VisitTimeSlot].value):
                    visitDateTime = {
                        date: slots[SlotsTypes.VisitDateSlot].value,
                        time: slots[SlotsTypes.VisitTimeSlot].value
                    };

                    speechText = tr(Strings.ASK_CLIENT_NAME_MSG);
                    break;
                default:
                    break;
            }

            handlerInput.attributesManager.setSessionAttributes({ [AttributesSession.VisitDateTime]: visitDateTime });

            return handlerInput
                .responseBuilder
                .speak(speechText)
                .withShouldEndSession(false)
                .getResponse();

        } catch (e) {
            const error = (e as Error);
            throw errorHelper.createError(error);
        }
    }
};
