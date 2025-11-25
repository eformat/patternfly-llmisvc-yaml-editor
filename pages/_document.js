import Document, { Html, Head, Main, NextScript } from 'next/document';

class PatternFlyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const assetPrefix = this.props.__NEXT_DATA__?.assetPrefix ?? '';

    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@patternfly/patternfly@6.4.0/dist/css/patternfly.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@patternfly/patternfly@6.4.0/dist/css/patternfly-addons.css"
          />
          <link rel="stylesheet" href={`${assetPrefix}/styles.css`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default PatternFlyDocument;

