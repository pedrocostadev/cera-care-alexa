import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest } from 'ask-sdk-model';
import _ from 'lodash';
import { aplHelpers } from '../../../custom/apl';
import { AttributesSession, DecisionStatus, IntentTypes, OutcomeList, skillHelpers, SlotsTypes, Strings } from '../../lib';

export const AddOutcome: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.AddOutcomeIntent, IntentTypes.SelectIntent);
    },
    handle(handlerInput) {
        let speechText = "";
        let clientData: { name: string, address: string };

        const { tr } = skillHelpers.getRequestAttributes(handlerInput);

        switch (true) {
            case skillHelpers.isIntent(handlerInput, IntentTypes.AddOutcomeIntent):
                aplHelpers.createOutcomeApl(handlerInput);

                speechText = tr(Strings.ASK_OUTCOME_MSG);
                break;
            case skillHelpers.isIntent(handlerInput, IntentTypes.SelectIntent):
                const slots = skillHelpers.getSlotValues((handlerInput.requestEnvelope.request as IntentRequest).intent.slots);
                let index = 0;

                if (!_.isEmpty(slots[SlotsTypes.PositionRelationSlot].value)) {
                    const positionRelated = slots[SlotsTypes.PositionRelationSlot].value
                    if (positionRelated === "Top") {
                        index = OutcomeList.at(0).id;
                    } else {
                        index = OutcomeList.at(OutcomeList.length).id;
                    }
                }

                if (!_.isEmpty(slots[SlotsTypes.ListPositionSlot].value)) {
                    index = slots[SlotsTypes.ListPositionSlot].value as unknown as number;
                }

                skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.OutcomeIndex]: index });
                speechText = setFlowBasedOnAttributes(handlerInput);
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

function setFlowBasedOnAttributes(handlerInput: HandlerInput): string {
    const { tr } = skillHelpers.getRequestAttributes(handlerInput);
    const attribute = skillHelpers.getSessionAttributes(handlerInput);

    switch (true) {
        case _.isEmpty(attribute[AttributesSession.VisitDateTime]):
            return tr(Strings.ASK_VISIT_MSG);
        case _.isEmpty(attribute[AttributesSession.ClientData]):
            return tr(Strings.ASK_CLIENT_MSG);
        case _.isEmpty(attribute[AttributesSession.AbleToMakeDecisions]):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.AbleToMakeDecisions]: DecisionStatus.Wait });
            return tr(Strings.ASK_IF_IS_ABLE_TO_MAKE_DECISIONS_MSG);
        case _.isEmpty(attribute[AttributesSession.CareDecisions]):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.CareDecisions]: DecisionStatus.Wait });
            return tr(Strings.ASK_CARE_DECISIONS_MSG);
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