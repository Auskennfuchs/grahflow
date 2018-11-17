export default {
    name: "Multiply",
    type: "multiply",
    properties: {
        input: {
            a: {
                name: "a",
                type: "BigDecimal",
                default: 0.0,
            },
            b: {
                name: "View Dir",
                type: "BigDecimal",
                default: 0.0,
            },
        },
        output: {
            result: {
                name: "Result",
                type: "BigDecimal",
                default: 0.0,
            },
        }
    }
}