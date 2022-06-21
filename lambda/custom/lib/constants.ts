export enum RequestTypes {
    Launch = "LaunchRequest",
    Intent = "IntentRequest",
    SessionEnded = "SessionEndedRequest",
    SystemExceptionEncountered = "System.ExceptionEncountered",
}

export enum IntentTypes {
    Help = "AMAZON.HelpIntent",
    Stop = "AMAZON.StopIntent",
    Cancel = "AMAZON.CancelIntent",
    Fallback = "AMAZON.FallbackIntent",
    
    // Custom Intents
    GetVisitDateTimeIntent = "GetVisitDateTimeIntent",
    GetClientNameIntent = "GetClientNameIntent",
    AddOutcomeIntent = "AddOutcomeIntent"
}

export enum ErrorTypes {
    Unknown = "UnknownError",
    Unexpected = "UnexpectedError",
}

export enum SlotsTypes{
    VisitDateSlot = "VisitDateSlot",
    VisitTimeSlot = "VisitTimeSlot",
    ClientAddressSlot = "ClientAddressSlot",
    ClientNameSlot = "ClientNameSlot"
}

export enum LocaleTypes {
    deDE = "de-DE",
    enAU = "en-AU",
    enCA = "en-CA",
    enGB = "en-GB",
    enIN = "en-IN",
    enUS = "en-US",
    esES = "es-ES",
    frFR = "fr-FR",
    itIT = "it-IT",
    jaJP = "ja-JP",
}

export enum AttributesSession {
    VisitDateTime = "VisitDateTime",
    ClientData = "ClientData"
}

export enum Strings {
    ASK_VISIT_TIME_MSG = "ASK_VISIT_TIME_MSG",
    ASK_CLIENT_NAME_MSG = "ASK_CLIENT_NAME_MSG",
    WELCOME_MSG = "WELCOME_MSG",
    GOODBYE_MSG = "GOODBYE_MSG",
    HELLO_MSG = "HELLO_MSG",
    HELP_MSG = "HELP_MSG",
    ERROR_MSG = "ERROR_MSG",
    ERROR_UNEXPECTED_MSG = "ERROR_UNEXPECTED_MSG"
}

export enum ConsoleConfig {
    reset = "\x1b[0m",
    bright = "\x1b[1m",
    dim = "\x1b[2m",
    underscore = "\x1b[4m",
    blink = "\x1b[5m",
    reverse = "\x1b[7m",
    hidden = "\x1b[8m"
}

export enum ConsoleColorFg {
    black = "\x1b[30m",
    red = "\x1b[31m",
    green = "\x1b[32m",
    yellow = "\x1b[33m",
    blue = "\x1b[34m",
    magenta = "\x1b[35m",
    cyan = "\x1b[36m",
    white = "\x1b[37m",
}

export enum ConsoleColorBg {
    black = "\x1b[40m",
    red = "\x1b[41m",
    green = "\x1b[42m",
    yellow = "\x1b[43m",
    blue = "\x1b[44m",
    magenta = "\x1b[45m",
    cyan = "\x1b[46m",
    white = "\x1b[47m"
}
