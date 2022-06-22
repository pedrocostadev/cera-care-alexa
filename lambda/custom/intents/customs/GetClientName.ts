import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import _ from 'lodash';
import { aplHelpers } from '../../../custom/apl';
import { AttributesSession, DecisionStatus, IntentTypes, skillHelpers, SlotsTypes, Strings } from '../../lib';

export const GetClientName: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.GetClientNameIntent);
    },
    handle(handlerInput) {
        let speechText: string;
        let clientData: { name: string, address: string };

        const { tr } = skillHelpers.getRequestAttributes(handlerInput);
        const attribute = skillHelpers.getSessionAttributesByName(handlerInput, AttributesSession.VisitDateTime);
        const slots = skillHelpers.getSlotValues((handlerInput.requestEnvelope.request as IntentRequest).intent.slots);

        switch (true) {
            case !_.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && !_.isEmpty(slots[SlotsTypes.ClientNameSlot].value):
                clientData = {
                    address: slots[SlotsTypes.ClientAddressSlot].value,
                    name: slots[SlotsTypes.ClientNameSlot].value
                };

                speechText = setVisitOrOutcome(handlerInput);
                break;
            case !_.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && _.isEmpty(slots[SlotsTypes.ClientNameSlot].value):
                clientData = {
                    address: slots[SlotsTypes.ClientAddressSlot].value,
                    name: slots[SlotsTypes.ClientNameSlot].value
                };

                speechText = tr(Strings.ASK_CLIENT_NAME_MSG);
                break;
            case _.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && !_.isEmpty(slots[SlotsTypes.ClientNameSlot].value):
                clientData = {
                    address: slots[SlotsTypes.ClientAddressSlot].value,
                    name: slots[SlotsTypes.ClientNameSlot].value
                };

                speechText = tr(Strings.ASK_CLIENT_ADDRESS_MSG);
                break;
            case !_.isEmpty(attribute.address) && _.isEmpty(slots[SlotsTypes.ClientNameSlot].value):
                clientData = {
                    address: slots[SlotsTypes.ClientAddressSlot].value,
                    name: slots[SlotsTypes.ClientNameSlot].value
                };

                speechText = setVisitOrOutcome(handlerInput);
                break;
            case _.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && !_.isEmpty(attribute.name):
                clientData = {
                    address: slots[SlotsTypes.ClientAddressSlot].value,
                    name: slots[SlotsTypes.ClientNameSlot].value
                };

                speechText = setVisitOrOutcome(handlerInput);
                break;
            default:
                speechText = tr(Strings.ERROR_UNEXPECTED_MSG);
                break;
        }

        skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.ClientData]: clientData });

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

function setVisitOrOutcome(handlerInput: HandlerInput): string {
    const { tr } = skillHelpers.getRequestAttributes(handlerInput);
    const attribute = skillHelpers.getSessionAttributes(handlerInput);

    switch (true) {
        case _.isEmpty(attribute[AttributesSession.VisitDateTime]):
            return tr(Strings.ASK_VISIT_MSG);
        case _.isEmpty(attribute[AttributesSession.AbleToMakeDecisions]):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.AbleToMakeDecisions]: DecisionStatus.Wait });
            return tr(Strings.ASK_IF_IS_ABLE_TO_MAKE_DECISIONS_MSG);
        case _.isEmpty(attribute[AttributesSession.CareDecisions]):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.CareDecisions]: DecisionStatus.Wait });
            return tr(Strings.ASK_CARE_DECISIONS_MSG);
        case _.isEmpty(attribute[AttributesSession.OutcomeIndex]):
            aplHelpers.createOutcomeApl(handlerInput);

            return tr(Strings.ASK_OUTCOME_MSG);
        case !_.isEmpty(attribute[AttributesSession.OutcomeIndex]) &&
            !_.isEmpty(attribute[AttributesSession.ClientData]) &&
            !_.isEmpty(attribute[AttributesSession.CareDecisions]) &&
            !_.isEmpty(attribute[AttributesSession.AbleToMakeDecisions]) &&
            !_.isEmpty(attribute[AttributesSession.VisitDateTime]):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.SaveForm]: true });
            return tr(Strings.ASK_SAVE_FORM_MSG);
        default:
            return tr(Strings.ERROR_UNEXPECTED_MSG);
    }
}