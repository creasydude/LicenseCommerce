import paymentSchema from "../../db/paymentSchema.js";
const orderId = () => {
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    return numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)] + numbers[Math.floor(Math.random() * 9)];
}

const orderIdGenerator = async () => {
    let generatedOrderId = orderId()
    let finalOrderId;

    try {
        const checkDb = await paymentSchema.findOne({
            payData: [
                {payOrderId : generatedOrderId}
            ]
        });
        if (!checkDb) {
            finalOrderId = generatedOrderId;
        } else if (checkDb) {
            while (checkDb) {
                finalOrderId = orderId();
                checkDb = await paymentSchema.findOne({
                    payData: [
                        {payOrderId : finalOrderId}
                    ]
                });
            }
        }
    } catch (err) {
        console.log(err)
    }
    return finalOrderId;
}

export default orderIdGenerator;