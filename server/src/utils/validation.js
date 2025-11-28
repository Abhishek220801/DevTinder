import validator from 'validator'

export const validateSignUpData = (req) => {
    const {firstName, emailId, password} = req.body;
    if(!firstName) 
        throw new Error('Please enter a first name')
    else if(firstName.length<3 && firstName.length>64)
        throw new Error('First name must be between 4-64 characters long')
    else if(!validator.isStrongPassword(password)){
        throw new Error('Please enter a strong password');
    }
}

