export interface IConfirmForgotPassword {
    username: string,
    code: string,
    password: string
}

export interface IRespondToAuthChallenge {
    username: string,
    code: string,
    session: string
}

export interface IRespondNewPasswordChallenge {
    username: string,
    password: string,
    session: string
}

export interface IChangePassword {
    access_token: string
    previus_password: string
    new_password: string
}