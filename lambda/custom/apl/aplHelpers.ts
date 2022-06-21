import { HandlerInput } from "ask-sdk-core";
import { getAPLPath } from ".";
import { OutcomeList } from "../lib";

const OUTCOME_LIST_TOKEN = "OUTCOME_LIST_TOKEN";

function createOutcomeApl(handlerInput: HandlerInput) {
    const apl = require(`${getAPLPath()}/outcomelist.json`);
    
    apl.datasources.textListData.listItems = OutcomeList.map(outcome => {
        return {
            primaryText: outcome.value,
            primaryAction: [
                {
                    type: "SetValue",
                    componentId: "outcomeList",
                    property: "headerTitle",
                    value: outcome.id
                }
            ]
        }
    });

    handlerInput.responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: OUTCOME_LIST_TOKEN,
        document: apl
    });
}

export const aplHelpers = {
    createOutcomeApl,
}