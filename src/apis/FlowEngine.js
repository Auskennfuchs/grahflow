import Axios from 'axios'

const FlowEngine = {
    getTypes: async () => {
        try {
            const res = await Axios.get("/calc/flow/v1/types")
            return res.data
        } catch (err) {
            return err.response
        }
    },
}

export default FlowEngine