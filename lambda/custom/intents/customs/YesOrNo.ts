import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import _ from 'lodash';
import { createVisit } from '../../../../prisma/client/create';
import { VisitForm } from '../../../model/visitForm.model';

import { AttributesSession, IntentTypes, skillHelpers, Strings, OutcomeList, errorHelper, DecisionStatus } from '../../lib';

export const YesOrNo: RequestHandler = {
    canHandle(handlerInput) {
        return skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent, IntentTypes.NoIntent);
    },
    handle(handlerInput) {
        try {
            let speechText: string;

            const { tr } = skillHelpers.getRequestAttributes(handlerInput);
            const attribute = skillHelpers.getSessionAttributes(handlerInput);
            let isYesIntent: boolean = false;

            switch (true) {
                case attribute[AttributesSession.AbleToMakeDecisions] === DecisionStatus.Wait && _.isNil(attribute[AttributesSession.SaveForm]):
                    isYesIntent = skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent);
                    skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.AbleToMakeDecisions]: isYesIntent });
                    speechText = setVisitOrOutcome(handlerInput);
                    break;
                case attribute[AttributesSession.CareDecisions] === DecisionStatus.Wait && _.isNil(attribute[AttributesSession.SaveForm]):
                    isYesIntent = skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent);
                    skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.CareDecisions]: isYesIntent });
                    speechText = setVisitOrOutcome(handlerInput);
                    break;
                case !_.isNil(attribute[AttributesSession.SaveForm]) && attribute[AttributesSession.SaveForm]:
                    isYesIntent = skillHelpers.isIntent(handlerInput, IntentTypes.YesIntent);
                    if (!isYesIntent) {
                        speechText = setVisitOrOutcome(handlerInput);
                        break;
                    }
                    const client = attribute[AttributesSession.ClientData];
                    const visit = attribute[AttributesSession.VisitDateTime];
                    const outcomeIndex = attribute[AttributesSession.OutcomeIndex];
                    const isAbleToMakeDecisions = attribute[AttributesSession.AbleToMakeDecisions];
                    const careDecisions = attribute[AttributesSession.CareDecisions];
                    const timestamp = Date.parse(`${visit.date} ${visit.time}`);
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
        case _.isEmpty(attribute[AttributesSession.ClientData]):
            return tr(Strings.ASK_CLIENT_MSG);
        case _.isNil(attribute[AttributesSession.OutcomeIndex]):
            const outcomes = OutcomeList.map(outcome => outcome.value).join(`<break time="1s"/>`);
            let speechText = tr(Strings.ASK_OUTCOME_MSG);
            return speechText.replace("{{outcomes}}", outcomes);
        case !_.isNil(attribute[AttributesSession.OutcomeIndex]) &&
            !_.isEmpty(attribute[AttributesSession.ClientData]) &&
            !_.isNil(attribute[AttributesSession.CareDecisions]) &&
            !_.isNil(attribute[AttributesSession.AbleToMakeDecisions]) &&
            !_.isEmpty(attribute[AttributesSession.VisitDateTime]):
            skillHelpers.setSessionAttributes(handlerInput, { [AttributesSession.SaveForm]: true });
            return tr(Strings.ASK_SAVE_FORM_MSG);
        default:
            return tr(Strings.ERROR_UNEXPECTED_MSG);
    }
}
