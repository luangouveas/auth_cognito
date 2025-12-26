export interface IConfirmForgotPassword {
    email: string,
    code: string,
    password: string
}

export interface IRespondToAuthChallenge {
    email: string,
    code: string,
    session: string
}

export interface IRespondNewPasswordChallenge {
    email: string,
    password: string,
    session: string
}

export interface IChangePassword {
    access_token: string
    previus_password: string
    new_password: string
}