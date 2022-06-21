import { LocaleTypes } from '../lambda/custom/lib';
import { getLocalePath } from '../lambda/custom/locales/locale';
import { helpers, requestFactory, responseBuilder } from './helpers';
import { SystemExceptionEncounteredRequestBuilder } from './helpers/SystemExceptionEncouteredRequestBuilder';

helpers.buildTestPipeline({
    resource: getLocalePath(),
    locales: [[LocaleTypes.deDE], [LocaleTypes.enUS]]
}, locale => {
    describe("Session Ended", () => {
        it("should work", async () => {
            const request = requestFactory().createRequest(SystemExceptionEncounteredRequestBuilder, locale);

            const response = await helpers.skill(request.getRequest());

            expect(response).toMatchObject(responseBuilder().getResponse());
        });
    });
})