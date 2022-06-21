import { RequestHandler } from 'ask-sdk-core';

import { IntentTypes, skillHelpers, SlotsTypes, Strings } from '../../lib';
import {
    IntentRequest,
} from 'ask-sdk-model';
import _ from 'lodash';

export const GetVisitDateTime: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.GetVisitDateTimeIntent);
    },
    handle(handlerInput) {
        const { t } = skillHelpers.getRequestAttributes(handlerInput);

        let visitDateTime: { date: string, time: string };
        let speechText: string = "";
        const slots = skillHelpers.getSlotValues((handlerInput.requestEnvelope.request as IntentRequest).intent.slots);

        switch (true) {
            case !_.isNil(slots[SlotsTypes.VisitDateSlot].value) && _.isNil(slots[SlotsTypes.VisitTimeSlot].value):
                visitDateTime = {
                    date: slots[SlotsTypes.VisitDateSlot].value,
                    time: ""
                };
                
                speechText = t(Strings.ASK_VISIT_TIME_MSG);

                break;
            case  !_.isNil(slots[SlotsTypes.VisitDateSlot].value) && !_.isNil(slots[SlotsTypes.VisitTimeSlot].value):
                visitDateTime = {
                    date: slots[SlotsTypes.VisitDateSlot].value,
                    time: slots[SlotsTypes.VisitTimeSlot].value
                };

                speechText = t(Strings.ASK_CLIENT_NAME_MSG);
                break;
            default:
                break;
        }

        handlerInput.attributesManager.setSessionAttributes(visitDateTime);

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
