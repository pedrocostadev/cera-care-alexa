import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import _ from 'lodash';
import { aplHelpers } from '../../../custom/apl';
import { AttributesSession, IntentTypes, skillHelpers, Strings } from '../../lib';

export const YesOrNo: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent, IntentTypes.NoIntent);
    },
    handle(handlerInput) {
        let speechText: string;

        const { tr } = skillHelpers.getRequestAttributes(handlerInput);
        const attribute = skillHelpers.getSessionAttributesByName(handlerInput, AttributesSession.VisitDateTime);
        let isYesIntent: boolean = false;

        switch (true) {
            case !_.isEmpty(attribute[AttributesSession.AbleToMakeDecisions]):
                isYesIntent = skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent);
                skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.AbleToMakeDecisions]: isYesIntent });
                speechText = setVisitOrOutcome(handlerInput);
                break;
            case !_.isEmpty(attribute[AttributesSession.CareDecisions]):
                isYesIntent = skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent);
                skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.CareDecisions]: isYesIntent });
                speechText = setVisitOrOutcome(handlerInput);
                break;
            default:
                speechText = tr(Strings.ERROR_UNEXPECTED_MSG);
                break;
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

function setVisitOrOutcome(handlerInput: HandlerInput): string {
    const { tr } = skillHelpers.getRequestAttributes(handlerInput);
    const attribute = skillHelpers.getSessionAttributesByName(handlerInput, AttributesSession.VisitDateTime);

    switch (true) {
        case _.isEmpty(attribute[AttributesSession.VisitDateTime].value):
            return tr(Strings.ASK_VISIT_MSG);
        case _.isEmpty(attribute[AttributesSession.ClientData].value):
            return tr(Strings.ASK_CLIENT_MSG);
        case _.isEmpty(attribute[AttributesSession.OutcomeIndex].value):
            aplHelpers.createOutcomeApl(handlerInput);
            return tr(Strings.ASK_OUTCOME_MSG);
        default:
            return tr(Strings.ERROR_UNEXPECTED_MSG);
    }
}