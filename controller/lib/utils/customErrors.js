
export function typeErrorFromTemplate(variableName, expectedType, actualValue) {
    return new TypeError(`${variableName} was expected to be a/an ${expectedType}, instead got this ${actualValue}`)
}