import Head from 'next/head'

export default function FisherhouseHeader(props) {
    return (
        <Head>
            <title>{props.title}</title>
            <meta name="description" content={props.description} />
            <link rel="icon" href="/favicon.ico" />
            <link href="https://use.typekit.net/yta3jvz.css" rel="stylesheet" />
        </Head>
    )
}