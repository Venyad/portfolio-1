/* @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export const numberNode = (value, unit) => ({ type: 'number', number: value, unit });
/**
 * Given a string representing a comma-separated set of CSS-like expressions,
 * parses and returns an array of ASTs that correspond to those expressions.
 *
 * Currently supported syntax includes:
 *
 *  - functions (top-level and nested)
 *  - calc() arithmetic operators
 *  - numbers with units
 *  - hexadecimal-encoded colors in 3, 6 or 8 digit form
 *  - idents
 *
 * All syntax is intended to match the parsing rules and semantics of the actual
 * CSS spec as closely as possible.
 *
 * @see https://www.w3.org/TR/CSS2/
 * @see https://www.w3.org/TR/css-values-3/
 */
export const parseExpressions = (() => {
    const cache = {};
    const MAX_PARSE_ITERATIONS = 1000; // Arbitrarily large
    return (inputString) => {
        const cacheKey = inputString;
        if (cacheKey in cache) {
            return cache[cacheKey];
        }
        const expressions = [];
        let parseIterations = 0;
        while (inputString) {
            if (++parseIterations > MAX_PARSE_ITERATIONS) {
                // Avoid a potentially infinite loop due to typos:
                inputString = '';
                break;
            }
            const expressionParseResult = parseExpression(inputString);
            const expression = expressionParseResult.nodes[0];
            if (expression == null || expression.terms.length === 0) {
                break;
            }
            expressions.push(expression);
            inputString = expressionParseResult.remainingInput;
        }
        return cache[cacheKey] = expressions;
    };
})();
/**
 * Parse a single expression. For the purposes of our supported syntax, an
 * expression is the set of semantically meaningful terms that appear before the
 * next comma, or between the parens of a function invocation.
 */
const parseExpression = (() => {
    const IS_IDENT_RE = /^(\-\-|[a-z\u0240-\uffff])/i;
    const IS_OPERATOR_RE = /^([\*\+\/]|[\-]\s)/i;
    const IS_EXPRESSION_END_RE = /^[\),]/;
    const FUNCTION_ARGUMENTS_FIRST_TOKEN = '(';
    const HEX_FIRST_TOKEN = '#';
    return (inputString) => {
        const terms = [];
        while (inputString.length) {
            inputString = inputString.trim();
            if (IS_EXPRESSION_END_RE.test(inputString)) {
                break;
            }
            else if (inputString[0] === FUNCTION_ARGUMENTS_FIRST_TOKEN) {
                const { nodes, remainingInput } = parseFunctionArguments(inputString);
                inputString = remainingInput;
                terms.push({
                    type: 'function',
                    name: { type: 'ident', value: 'calc' },
                    arguments: nodes
                });
            }
            else if (IS_IDENT_RE.test(inputString)) {
                const identParseResult = parseIdent(inputString);
                const identNode = identParseResult.nodes[0];
                inputString = identParseResult.remainingInput;
                if (inputString[0] === FUNCTION_ARGUMENTS_FIRST_TOKEN) {
                    const { nodes, remainingInput } = parseFunctionArguments(inputString);
                    terms.push({ type: 'function', name: identNode, arguments: nodes });
                    inputString = remainingInput;
                }
                else {
                    terms.push(identNode);
                }
            }
            else if (IS_OPERATOR_RE.test(inputString)) {
                // Operators are always a single character, so just pluck them out:
                terms.push({ type: 'operator', value: inputString[0] });
                inputString = inputString.slice(1);
            }
            else {
                const { nodes, remainingInput } = inputString[0] === HEX_FIRST_TOKEN ?
                    parseHex(inputString) :
                    parseNumber(inputString);
                // The remaining string may not have had any meaningful content. Exit
                // early if this is the case:
                if (nodes.length === 0) {
                    break;
                }
                terms.push(nodes[0]);
                inputString = remainingInput;
            }
        }
        return { nodes: [{ type: 'expression', terms }], remainingInput: inputString };
    };
})();
/**
 * An ident is something like a function name or the keyword "auto".
 */
const parseIdent = (() => {
    const NOT_IDENT_RE = /[^a-z0-9_\-\u0240-\uffff]/i;
    return (inputString) => {
        const match = inputString.match(NOT_IDENT_RE);
        const ident = match == null ? inputString : inputString.substr(0, match.index);
        const remainingInput = match == null ? '' : inputString.substr(match.index);
        return { nodes: [{ type: 'ident', value: ident }], remainingInput };
    };
})();
/**
 * Parses a number. A number value can be expressed with an integer or
 * non-integer syntax, and usually includes a unit (but does not strictly
 * require one for our purposes).
 */
const parseNumber = (() => {
    // @see https://www.w3.org/TR/css-syntax/#number-token-diagram
    const VALUE_RE = /[\+\-]?(\d+[\.]\d+|\d+|[\.]\d+)([eE][\+\-]?\d+)?/;
    const UNIT_RE = /^[a-z%]+/i;
    const ALLOWED_UNITS = /^(m|mm|cm|rad|deg|[%])$/;
    return (inputString) => {
        const valueMatch = inputString.match(VALUE_RE);
        const value = valueMatch == null ? '0' : valueMatch[0];
        inputString = value == null ? inputString : inputString.slice(value.length);
        const unitMatch = inputString.match(UNIT_RE);
        let unit = unitMatch != null && unitMatch[0] !== '' ? unitMatch[0] : null;
        const remainingInput = unitMatch == null ? inputString : inputString.slice(unit.length);
        if (unit != null && !ALLOWED_UNITS.test(unit)) {
            unit = null;
        }
        return {
            nodes: [{
                    type: 'number',
                    number: parseFloat(value) || 0,
                    unit: unit
                }],
            remainingInput
        };
    };
})();
/**
 * Parses a hexadecimal-encoded color in 3, 6 or 8 digit form.
 */
const parseHex = (() => {
    // TODO(cdata): right now we don't actually enforce the number of digits
    const HEX_RE = /^[a-f0-9]*/i;
    return (inputString) => {
        inputString = inputString.slice(1).trim();
        const hexMatch = inputString.match(HEX_RE);
        const nodes = hexMatch == null ? [] : [{ type: 'hex', value: hexMatch[0] }];
        return {
            nodes,
            remainingInput: hexMatch == null ? inputString :
                inputString.slice(hexMatch[0].length)
        };
    };
})();
/**
 * Parses arguments passed to a function invocation (e.g., the expressions
 * within a matched set of parens).
 */
const parseFunctionArguments = (inputString) => {
    const expressionNodes = [];
    // Consume the opening paren
    inputString = inputString.slice(1).trim();
    while (inputString.length) {
        const expressionParseResult = parseExpression(inputString);
        expressionNodes.push(expressionParseResult.nodes[0]);
        inputString = expressionParseResult.remainingInput.trim();
        if (inputString[0] === ',') {
            inputString = inputString.slice(1).trim();
        }
        else if (inputString[0] === ')') {
            // Consume the closing paren and stop parsing
            inputString = inputString.slice(1);
            break;
        }
    }
    return { nodes: expressionNodes, remainingInput: inputString };
};
const $visitedTypes = Symbol('visitedTypes');
/**
 * An ASTWalker walks an array of ASTs such as the type produced by
 * parseExpressions and invokes a callback for a configured set of nodes that
 * the user wishes to "visit" during the walk.
 */
export class ASTWalker {
    constructor(visitedTypes) {
        this[$visitedTypes] = visitedTypes;
    }
    /**
     * Walk the given set of ASTs, and invoke the provided callback for nodes that
     * match the filtered set that the ASTWalker was constructed with.
     */
    walk(ast, callback) {
        const remaining = ast.slice();
        while (remaining.length) {
            const next = remaining.shift();
            if (this[$visitedTypes].indexOf(next.type) > -1) {
                callback(next);
            }
            switch (next.type) {
                case 'expression':
                    remaining.unshift(...next.terms);
                    break;
                case 'function':
                    remaining.unshift(next.name, ...next.arguments);
                    break;
            }
        }
    }
}
export const ZERO = Object.freeze({ type: 'number', number: 0, unit: null });
//# sourceMappingURL=parsers.js.map