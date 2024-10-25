const parseComparison = (expression) => {
    const regex = /(\w+)\s*(<=|>=|[><=]+)\s*(\d+|'[^']+')/;
    const match = expression.match(regex);

    if (!match) {
        throw new Error('Invalid comparison format');
    }

    return {
        type: 'operator',
        operator: match[2],
        left: { type: 'operand', value: match[1] },
        right: { type: 'operand', value: match[3].replace(/'/g, '') },
    };
};

const splitByLogicalOperators = (str) => {
    const tokens = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(') {
            if (depth === 0 && current.trim()) {
                tokens.push(current.trim());
                current = '';
            }
            current += char;
            depth++;
        } else if (char === ')') {
            current += char;
            depth--;
            if (depth === 0 && current.trim()) {
                tokens.push(current.trim());
                current = '';
            }
        } else if (depth === 0 && str.slice(i, i + 3) === "AND") {
            if (current.trim()) {
                tokens.push(current.trim());
                current = '';
            }
            tokens.push("AND");
            i += 2;
        } else if (depth === 0 && str.slice(i, i + 2) === "OR") {
            if (current.trim()) {
                tokens.push(current.trim());
                current = '';
            }
            tokens.push("OR");
            i += 1;
        } else {
            current += char;
        }
    }
    if (current.trim()) {
        tokens.push(current.trim());
    }
    return tokens;
};

const parseAST = (tokens) => {
    const stack = [];
    let currentOperator = null;

    for (const token of tokens) {
        if (token === "AND" || token === "OR") {
            currentOperator = token;
        } else if (token.startsWith('(') && token.endsWith(')')) {
            const innerExpression = token.slice(1, -1);
            const innerTokens = splitByLogicalOperators(innerExpression);
            const innerAST = parseAST(innerTokens);

            if (!stack.length) {
                stack.push(innerAST);
            } else {
                const newOperatorNode = {
                    type: 'logical_operator',
                    operator: currentOperator,
                    left: stack.pop(),
                    right: innerAST,
                };
                stack.push(newOperatorNode);
            }
        } else {
            const comparisonNode = parseComparison(token);

            if (!stack.length) {
                stack.push(comparisonNode);
            } else {
                const newOperatorNode = {
                    type: 'logical_operator',
                    operator: currentOperator,
                    left: stack.pop(),
                    right: comparisonNode,
                };
                stack.push(newOperatorNode);
            }
        }
    }

    return stack[0];
};

const createAST = (ruleString) => {
    const tokens = splitByLogicalOperators(ruleString);
    return parseAST(tokens);
};

const evaluateAST = (node, data) => {
    if (!node) return false;

    if (node.type === 'operator') {
        const leftValue = data[node.left.value];
        const rightValue = isNaN(node.right.value) ? node.right.value : Number(node.right.value);

        switch (node.operator) {
            case '>':
                return leftValue > rightValue;
            case '<':
                return leftValue < rightValue;
            case '=':
                return leftValue === rightValue;
            case '>=':
                return leftValue >= rightValue;
            case '<=':
                return leftValue <= rightValue;
            default:
                throw new Error(`Unknown operator: ${node.operator}`);
        }
    } else if (node.type === 'logical_operator') {
        const leftResult = evaluateAST(node.left, data);
        const rightResult = evaluateAST(node.right, data);

        if (node.operator === "AND") {
            return leftResult && rightResult;
        } else if (node.operator === "OR") {
            return leftResult || rightResult;
        }
    }

    return false;
};

module.exports = { createAST, evaluateAST };
