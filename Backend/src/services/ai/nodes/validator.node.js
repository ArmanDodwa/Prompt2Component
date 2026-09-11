export const validatorNode = async (state) => {
  const errors = [];
  const code = state.code || "";

  // 1. Check for basic export requirements
  if (!code.includes("export default")) {
    errors.push("Missing 'export default' statement in component definition.");
  }

  // 2. Check for return statement
  if (!code.includes("return")) {
    errors.push("Component is missing a 'return' statement with JSX output.");
  }

  // 3. Check for JSX tag indicators
  if (!code.includes("<") || !code.includes(">")) {
    errors.push("Component contains no valid JSX tag elements.");
  }

  // 4. Bracket parity sanity checks
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched curly braces: ${openBraces} open vs ${closeBraces} closed.`);
  }

  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Mismatched parentheses: ${openParens} open vs ${closeParens} closed.`);
  }

  // 5. Ensure React hook imports exist if hooks are used
  const usesState = code.includes("useState") && !code.includes("import") && !code.includes("React.useState");
  if (usesState) {
    errors.push("Uses useState without importing it from 'react'.");
  }

  return {
    isValid: errors.length === 0,
    errorLogs: errors,
  };
};