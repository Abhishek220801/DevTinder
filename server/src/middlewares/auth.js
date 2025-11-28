export const adminAuth = (req, res, next) => {
    console.log(`Admin auth is getting checked!!`)
    const token = 'xyz';
    const isAdminAuthorized= token==='xyz';
    if(!isAdminAuthorized){
        res.status(401).send('Unauthorized request')
    } else {
        console.log(`Admin auth passed!`)
        next();
    }
}

export const userAuth = (req, res, next) => {
    console.log(`User auth is getting checked!!`)
    const token = 'xyz';
    const isUserAuthorized= token==='xyz';
    if(!isUserAuthorized){
        res.status(401).send('Unauthorized request')
    } else {
        console.log(`User auth passed!`)
        next();
    }
}