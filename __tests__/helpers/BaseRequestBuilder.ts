import { Request, RequestEnvelope } from 'ask-sdk-model';
import _ from 'lodash';
import { helpers } from '.';
import { ConsoleColorBg, ConsoleColorFg } from '../../lambda/custom/lib';

/**
 * Has all actions basis for all requests. 
 */
export class BaseRequestBuilder<T extends BaseRequestBuilder<T>> {

    protected requestEnvelope: RequestEnvelope;

    /**
     *
     */
    constructor(request: RequestEnvelope) {
        if (_.isNil(request)) {
            throw new Error('RequestEnvelope is null or undefined');
        }
        this.requestEnvelope = request;
    }

    /**
     * If the 'attributes' are null a new attribute is saved, whether dont it's merged with pre-existents attributes.
     * @param attribute the attribute
     */
    public addSessionAttributes(attribute: { [key: string]: any }): T {
        if (_.isNil(this.requestEnvelope.session)) {
            throw new Error('Session is null or undefined');
        }
        if (_.isNil(attribute)) {
            throw new Error('Attribute is null or undefined');
        }
        switch (true) {
            case _.isNil(this.requestEnvelope.session.attributes):
                this.requestEnvelope.session.attributes = attribute;
                break;
            default:
                this.requestEnvelope.session.attributes = _.merge(this.requestEnvelope.session.attributes, attribute);
                break;
        }

        return this as unknown as T;
    }

    /**
     * Get the request envelope.
     */
    public getRequest(): RequestEnvelope {
        helpers.logEvents({bgColor: ConsoleColorBg.black, fgColor: ConsoleColorFg.cyan}, `TEST 'ResquestEnvelope'`, this.requestEnvelope);
        return this.requestEnvelope;
    }

    /**
     * Convert the request to type R.
     */
    protected as<R extends Request>(): R {
        return this.requestEnvelope.request as R;
    }
}