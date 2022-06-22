import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import _ from 'lodash';
import { aplHelpers } from '../../../custom/apl';
import { createVisit } from '../../../../prisma/client/create';
import { VisitForm } from '../../../model/visitForm.model';
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
            case !_.isEmpty(attribute[AttributesSession.SaveForm]) && attribute[AttributesSession.SaveForm]:
                isYesIntent = skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent);
                if (!isYesIntent) {
                    break;
                }
                const client = attribute[AttributesSession.ClientData].value;
                const visit = attribute[AttributesSession.VisitDateTime].value;
                const outcomeIndex = attribute[AttributesSession.OutcomeIndex].value;
                const isAbleToMakeDecisions = attribute[AttributesSession.AbleToMakeDecisions].value;
                const careDecisions = attribute[AttributesSession.CareDecisions].value;
                const timestamp = Date.(`${visit.date} ${visit.time}`);
                const visitForm: VisitForm = {
                    clientName: client.name,
                    address: client.address,
                    visitDatetime: new Date(timestamp),
                    outcomeIndex: Number.parseInt(outcomeIndex),
                    ableToMakeDecisions: isAbleToMakeDecisions,
                    careDecisions: careDecisions
                };

                createVisit(visitForm);

                speechText = tr(Strings.GOODBYE_MSG);

                return handlerInput.responseBuilder
                    .withShouldEndSession(true)
                    .speak(speechText)
                    .getResponse();
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
    const attribute = skillHelpers.getSessionAttributes(handlerInput);

    switch (true) {
        case _.isEmpty(attribute[AttributesSession.VisitDateTime]):
            return tr(Strings.ASK_VISIT_MSG);
        case _.isEmpty(attribute[AttributesSession.ClientData]):
            return tr(Strings.ASK_CLIENT_MSG);
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
