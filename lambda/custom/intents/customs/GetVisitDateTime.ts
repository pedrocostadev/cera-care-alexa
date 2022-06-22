import { HandlerInput, RequestHandler } from 'ask-sdk-core';

import { AttributesSession, DecisionStatus, errorHelper, IntentTypes, skillHelpers, SlotsTypes, Strings } from '../../lib';
import {
    IntentRequest,
} from 'ask-sdk-model';
import _ from 'lodash';
import { aplHelpers } from '../../apl';

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
            const attribute = skillHelpers.getSessionAttributesByName(handlerInput, AttributesSession.VisitDateTime);

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

                    speechText = setClientOrOutcome(handlerInput);
                    break;
                case !_.isEmpty(attribute.date) && !_.isEmpty(slots[SlotsTypes.VisitTimeSlot].value):
                    visitDateTime = {
                        date: attribute.date,
                        time: slots[SlotsTypes.VisitTimeSlot].value
                    };

                    speechText = setClientOrOutcome(handlerInput);
                    break;

                case _.isEmpty(attribute.date) && !_.isEmpty(slots[SlotsTypes.VisitTimeSlot].value):
                    visitDateTime = {
                        date: slots[SlotsTypes.VisitDateSlot].value,
                        time: slots[SlotsTypes.VisitTimeSlot].value
                    };

                    speechText = setClientOrOutcome(handlerInput);
                    break;

                default:
                    speechText = tr(Strings.ERROR_UNEXPECTED_MSG);
                    break;
            }

            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.VisitDateTime]: visitDateTime });

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

function setClientOrOutcome(handlerInput: HandlerInput): string {
    const { tr } = skillHelpers.getRequestAttributes(handlerInput);
    const attribute = skillHelpers.getSessionAttributes(handlerInput);

    switch (true) {
        case _.isEmpty(attribute[AttributesSession.ClientData].value):
            return tr(Strings.ASK_CLIENT_MSG);
        case _.isEmpty(attribute[AttributesSession.AbleToMakeDecisions].value):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.AbleToMakeDecisions]: DecisionStatus.Wait });
            return tr(Strings.ASK_IF_IS_ABLE_TO_MAKE_DECISIONS_MSG);
        case _.isEmpty(attribute[AttributesSession.CareDecisions].value):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.CareDecisions]: DecisionStatus.Wait });
            return tr(Strings.ASK_CARE_DECISIONS_MSG);
        case _.isEmpty(attribute[AttributesSession.OutcomeIndex].value):
            aplHelpers.createOutcomeApl(handlerInput);

            return tr(Strings.ASK_OUTCOME_MSG);
    }
}