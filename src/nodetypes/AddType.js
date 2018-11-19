export default {
    name: "Add",
    type: "add",
    properties: {
        input: {
            a: {
                name: "a",
                type: "BigDecimal",
                default: 0.0,
            },
            b: {
                name: "b",
                type: "BigDecimal",
                default: 0.0,
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