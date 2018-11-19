export default {
    name: "Power x^y",
    type: "powxy",
    properties: {
        input: {
            base: {
                name: "base",
                type: "BigDecimal",
                default: 0.0,
            },
            exp: {
                name: "exponent",
                type: "BigDecimal",
                default: 1.0,
            },
        },
        output: {
            result: {
                name: "Result",
                type: "BigDecimal",
            },
        }
    }
}