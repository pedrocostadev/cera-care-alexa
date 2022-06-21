import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import _ from 'lodash';
import { aplHelpers } from '../../../custom/apl';
import { AttributesSession, IntentTypes, skillHelpers, SlotsTypes, Strings } from '../../lib';

export const AddOutcome: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.AddOutcomeIntent);
    },
    handle(handlerInput) {
        let speechText = "";
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

                speechText = setClientOrOutcome(handlerInput);
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

                speechText = setClientOrOutcome(handlerInput);
                break;
            case _.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && !_.isEmpty(attribute.name):
                clientData = {
                    address: slots[SlotsTypes.ClientAddressSlot].value,
                    name: slots[SlotsTypes.ClientNameSlot].value
                };

                speechText = setClientOrOutcome(handlerInput);
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

function setClientOrOutcome(handlerInput: HandlerInput): string {
    const { tr } = skillHelpers.getRequestAttributes(handlerInput);
    const attribute = skillHelpers.getSessionAttributesByName(handlerInput, AttributesSession.ClientData);

    if (_.isEmpty(attribute)) {
        return tr(Strings.ASK_VISIT_MSG);
    }

    aplHelpers.createOutcomeApl(handlerInput);

    return tr(Strings.ASK_OUTCOME_MSG);
}