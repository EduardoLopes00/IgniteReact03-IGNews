import { GetStaticProps } from "next";
import Head from "next/head";
import styles from './styles.module.scss'
import Prismic from '@prismicio/client'
import { getPrismicClient } from "../../services/prismic";

export default function posts() {
    return(
        <>     
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a>
                        <time>31 de dezembro de 2021</time>
                        <strong>Learning how to play with Vayne</strong>
                        <p>In this guide, you will learn everything you need to master Vayne in botlane and take off in your Rank journey</p>
                    </a>
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'publication')
    ], {
        fetch: ['publication.title', 'publication.content'],
        pageSize: 100
    })

    

    return {
        props: {}
    }
}