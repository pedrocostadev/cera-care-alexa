import { ConsoleColorBg, ConsoleColorFg, ConsoleConfig } from "./constants"

function logInfo(title: string, object: any) {
    console.info(title, JSON.stringify(object, null, 2))
}

function logAssert(title: string, object: any) {
    console.assert(title, JSON.stringify(object, null, 2))
}

function logWarn(title: string, object: any) {
    console.warn(title, JSON.stringify(object, null, 2))
}

function logError(title: string, object: any) {
    console.error(title, JSON.stringify(object, null, 2))
}

function logCustom(config: { console?: ConsoleConfig, fgColor?: ConsoleColorFg, bgColor?: ConsoleColorBg } = {}, title: string, object: any) {
    const bgColor = config.bgColor ?? ConsoleColorBg.black;
    const fgColor = config.fgColor ?? ConsoleColorFg.white;
    const consoleConfig = config.console ?? ConsoleConfig.reset; 

    console.log(bgColor, fgColor, title, JSON.stringify(object, null, 2), consoleConfig);
}

export const logHelpers = {
    logInfo,
    logAssert,
    logWarn,
    logError,
    logCustom
}