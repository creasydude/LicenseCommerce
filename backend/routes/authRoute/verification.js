import joi from 'joi';

const joiVerification = data => {
    const schema = joi.object({
        email : joi.string().email().max(255),
    })

    return schema.validate({email: data})
}

export default joiVerification;