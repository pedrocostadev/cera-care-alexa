import { Resource } from "i18next";
import { Strings, LocaleTypes } from "./constants";

interface IStrings {
    [Strings.WELCOME_MSG]: string[];
    [Strings.GOODBYE_MSG]: string[];
    [Strings.HELLO_MSG]: string[];
    [Strings.HELP_MSG]: string[];
    [Strings.ERROR_MSG]: string[];
    [Strings.ERROR_UNEXPECTED_MSG]: string[];
}

export const resourceStrings: Resource = {
    [LocaleTypes.enGB]: {
        translation: {
            WELCOME_MSG: [
                "Welcome to the Zé Skill, you can say 'Add new visit'",
                "Welcome this is Zé Skill, you can say 'I'm in some client's house'"
            ],
            GOODBYE_MSG: ["Goodbye!"],
            HELLO_MSG: ["Hello world!"],
            HELP_MSG: ["You can say hello to me!"],
            ERROR_MSG: ["Sorry, I can't understand the command. Please say again."],
            ERROR_UNEXPECTED_MSG: ["Sorry, an unexpected error has occured. Please try again later."],
        } as IStrings,
    },
};
