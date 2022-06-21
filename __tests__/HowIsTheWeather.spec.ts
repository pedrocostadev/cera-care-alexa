import { IntentTypes, Strings } from '../lambda/custom/lib/constants';
import { getLocalePath } from '../lambda/custom/locales/locale';
import { helpers, IntentRequestBuilder, requestFactory, responseBuilder } from './helpers';

helpers.buildTestPipeline({
    resource: getLocalePath()
}, locale => {
    describe("How is the weather", () => {
        it("should work", async () => {
            const matcher = responseBuilder()
                .addResponseArray(Strings.STRINGARRAY_MSG)

            const request = requestFactory()
                .createRequest(IntentRequestBuilder, locale)
                .addIntent({
                    name: IntentTypes.HowIsTheWeather,
                    confirmationStatus: "CONFIRMED"
                });

            const response = await helpers.skill(request.getRequest());

            helpers.expectResponseArray(matcher, response);
        });
    });
});