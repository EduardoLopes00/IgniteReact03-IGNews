import { Client } from 'faunadb'

export const fauna = new Client({
    secret: process.env.FAUNADB_KEY,
    domain: 'db.us.fauna.com' //Solution to access denied when trying to log in with github
})