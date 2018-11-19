export default {
    name: "Fresnel Effect",
    type: "fresnelEffect",
    properties: {
        input: {
            normal: {
                name: "Normal",
                type: "Vector3",
                default: { x: 0.0, y: 0.0, z: 0.0 },
            },
            viewDir: {
                name: "View Dir",
                type: "Vector3",
                default: { x: 0.0, y: 0.0, z: 0.0 },
            },
            power: {
                name: "Power",
                type: "BigDecimal",
                default: 1.0,
            },
        },
        output: {
            out: {
                name: "Out",
                type: "BigDecimal",
            },
        }
    }
}