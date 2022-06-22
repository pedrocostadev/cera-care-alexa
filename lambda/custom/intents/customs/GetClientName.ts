import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import _ from 'lodash';
import { AttributesSession, DecisionStatus, errorHelper, IntentTypes, OutcomeList, skillHelpers, SlotsTypes, Strings } from '../../lib';

export const GetClientName: RequestHandler = {
    canHandle(handlerInput) {
        const result = skillHelpers.isIntent(handlerInput, IntentTypes.GetClientNameIntent);
        return result;
    },
    handle(handlerInput) {
        try {
            let speechText: string;
            let clientData: { name: string, address: string };

            const { tr } = skillHelpers.getRequestAttributes(handlerInput);
            const attribute = skillHelpers.getSessionAttributesByName(handlerInput, AttributesSession.ClientData);
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
                    if (_.isEmpty(attribute.name)) {
                        clientData = {
                            address: slots[SlotsTypes.ClientAddressSlot].value,
                            name: slots[SlotsTypes.ClientNameSlot].value
                        }
                        speechText = tr(Strings.ASK_CLIENT_NAME_MSG);
                        break;
                    }

                    clientData = {
                        address: slots[SlotsTypes.ClientAddressSlot].value,
                        name: attribute.name
                    };

                    speechText = setVisitOrOutcome(handlerInput);
                    break;
                case _.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && !_.isEmpty(slots[SlotsTypes.ClientNameSlot].value):

                    if (_.isEmpty(attribute.address)) {
                        clientData = {
                            address: slots[SlotsTypes.ClientAddressSlot].value,
                            name: slots[SlotsTypes.ClientNameSlot].value
                        }
                        speechText = tr(Strings.ASK_CLIENT_ADDRESS_MSG);
                        break;
                    }

                    clientData = {
                        address: attribute.address,
                        name: slots[SlotsTypes.ClientNameSlot].value
                    };
                    speechText = setVisitOrOutcome(handlerInput);
                    break;

                case _.isEmpty(slots[SlotsTypes.ClientAddressSlot].value) && !_.isEmpty(attribute.name):
                    clientData = {
                        address: slots[SlotsTypes.ClientAddressSlot].value,
                        name: attribute.name
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
        } catch (e) {
            const error = (e as Error);
            throw errorHelper.createError(error);
        }
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
            const outcomes = OutcomeList.map(outcome => outcome.value).join(`<break time="1s"/>`);
            let speechText = tr(Strings.ASK_OUTCOME_MSG);
            return speechText.replace("{{outcomes}}", outcomes);
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