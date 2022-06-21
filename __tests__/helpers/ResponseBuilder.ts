import { Response, ResponseEnvelope, ui } from 'ask-sdk-model';
import i18next from 'i18next';
import _ from 'lodash';
import { ConsoleColorBg, ConsoleColorFg } from '../../lambda/custom/lib';

import { helpers } from './';

export class ResponseBuilder {

    private _response: ResponseEnvelope;
    private _ssmlInput: any;
    private _ssmlReprompt: any;

    /**
     *
     */
    constructor() {
        this._response = helpers.partial<ResponseEnvelope>({
            response: helpers.partial<Response>({})
        })
    }

    public addSessionAttributes(attribute: { [key: string]: any }): ResponseBuilder {
        switch (true) {
            case _.isNil(this._response.sessionAttributes):
                this._response.sessionAttributes = attribute;
                break;
            default:
                this._response.sessionAttributes = _.merge(this._response.sessionAttributes, attribute);
                break;
        }
        return this;
    }

    /**
     * Add ssml response in the response envelope, this uses i18n by default to get the responses
     * @param key the key
     * @param args the args
     */
    public addResponse(key: string, ...args: any[]): ResponseBuilder {
        if (!i18next.isInitialized) {
            throw new Error('i18next its not initialized!')
        }

        const response = i18next.t(key, args);
        this._ssmlInput = response;
        this._response.response.outputSpeech = helpers.partial<ui.OutputSpeech>({
            ssml: expect.stringMatching(response)
        })

        return this;
    }

    /**
     * Add ssml response array in the response envelope, this uses i18n by default to get the responses
     * @param key the key
     * @param args the args
     */
    public addResponseArray(key: string, ...args: any[]): ResponseBuilder {
        if (!i18next.isInitialized) {
            throw new Error('i18next its not initialized!')
        }

        const responses = i18next.t<String[]>(key, args);
        this._ssmlInput = responses;
        this._response.response.outputSpeech = helpers.partial<ui.OutputSpeech>({
            ssml: responses as any
        });

        return this;
    }

    /**
     * Add ssml reprompt in the response envelope, this uses i18n by default to get the responses
     * @param key the key
     * @param args the args
     */
    public addReprompt(key: string, ...args: any[]): ResponseBuilder {
        const response = i18next.t(key, args);
        this._ssmlReprompt = response;

        this._response.response.reprompt = helpers.partial<ui.Reprompt>({
            outputSpeech: {
                ssml: expect.stringMatching(response)
            }
        });

        return this;
    }

    public addSimpleCard(title: { key: string, args?: any[] }, content: { key: string, args?: any[] }): ResponseBuilder {
        this._response.response.card = helpers.partial<ui.Card>({
            type: "Simple",
            content: i18next.t(content.key, content.args),
            title: i18next.t(title.key, title.args)
        })

        return this;
    }

    public shouldEndSession(endSession: boolean): ResponseBuilder {
        this._response.response.shouldEndSession = endSession;
        return this;
    }

    public getResponse(): ResponseEnvelope {
        this.logResponse();
        return this._response;
    }

    private logResponse() {
        const clone = JSON.parse(JSON.stringify(this._response)) as ResponseEnvelope;
        
        clone.response.outputSpeech = helpers.partial<ui.OutputSpeech>({
            ssml: this._ssmlInput
        });

        if (!_.isNil(clone.response.reprompt)) {
            clone.response.reprompt = helpers.partial<ui.Reprompt>({
                outputSpeech: {
                    ssml: this._ssmlReprompt
                }
            });
        }

        helpers.logEvents({ bgColor: ConsoleColorBg.black, fgColor: ConsoleColorFg.yellow }, `TEST 'ResponseEnvelope'`, clone);
    }
}

export const responseBuilder = () => new ResponseBuilder();