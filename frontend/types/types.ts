import * as z from 'zod'

const SignInSchema = z.object({
    email:z.string().email("Invalid email"),
    password:z.string().min(4,'Password length must be at least 4 charactors')
})
const SignUpSchema = z.object({
    name:z.string().min(2,'User name must be at least 2 letters'),
    email:z.string().email("Invalid email"),
    password:z.string().min(4,'Password length must be at least 4 letters')
})

interface signInCredentialProps{
    email:string,
    password:string
}
interface signUpCredentialProps{
    name:string,
    email:string,
    password:string
}

export {SignInSchema,SignUpSchema}

export type{signInCredentialProps,signUpCredentialProps}