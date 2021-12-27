import {query as q} from 'faunadb'

import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { fauna } from '../../../services/fauna'

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user'
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const { email } = user;
            
            try {
                //Query that verify wheter the user exists and in case of negative, insert the new user. Otherwise, get the information about it.
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(user.email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(user.email)
                            )
                        )
                    )
                )
            } catch(err) {
                console.log(err)
                return false;
            }
            
            
            return true;
        },
    }
})