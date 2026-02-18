// ExerciseUtils.tsx

/**
 * De-repr converts repr strings to their original form based on type
 * @param value - The repr string value from Python
 * @param type - The Python type (int, str, bool, float, etc.)
 * @returns The de-repr'd value
 */
export const deRepr = (value: string, type: string): any => {
  switch (type) {
    case 'int':
      return parseInt(value);
    case 'float':
      return parseFloat(value);
    case 'bool':
      return value === 'True';
    case 'str':
      // Remove surrounding quotes from repr string
      if ((value.startsWith("'") && value.endsWith("'")) || 
          (value.startsWith('"') && value.endsWith('"'))) {
        return value.slice(1, -1);
      }
      return value;
    case 'NoneType':
      return null;
    default:
      // For other types, return as-is
      return value;
  }
};

/**
 * Validate variable checks if a variable exists, has the correct type, and optionally the correct value
 * @param vars - The variables object from Python execution
 * @param name - The variable name to check
 * @param expectedType - The expected Python type
 * @param expectedValue - Optional expected value (already de-repr'd)
 * @returns Object with passed boolean and message string
 */
export const validateVariable = (
  vars: Record<string, any>, 
  name: string, 
  expectedType: string, 
  expectedValue?: any
): {passed: boolean, message: string} => {
  if (!vars[name]) {
    console.log(`Validation failed. Variable "${name}" not found.`);
    return {passed: false, message: `Variable "${name}" not found.`};
  }
  
  if (vars[name].type !== expectedType) {
    console.log(`Validation failed. Variable "${name}" is of type ${vars[name].type}, expected '${expectedType}'.`);
    return {passed: false, message: `Variable "${name}" is of type ${vars[name].type}, expected '${expectedType}'.`};
  }
  
  if (expectedValue !== undefined) {
    const actualValue = deRepr(vars[name].value, vars[name].type);
    if (actualValue !== expectedValue) {
      console.log(`Validation failed. Variable "${name}" has value ${actualValue}, expected ${expectedValue}.`);
      return {passed: false, message: `Variable "${name}" has value ${actualValue}, expected ${expectedValue}.`};
    }
  }
  
  return {passed: true, message: `Variable "${name}" is correctly assigned.`};
};

