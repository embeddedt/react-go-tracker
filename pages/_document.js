import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name='application-name' content='GO Tracker' />
                    <meta name='description' content='GO Tracker' />
                    <meta name='format-detection' content='telephone=no' />
                    <meta name='mobile-web-app-capable' content='yes' />
    
                    <meta name='theme-color' content='#000000' />

                    <link rel='manifest' href='/static/manifest.json' />
                    <link rel='shortcut icon' href='/favicon.ico' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
