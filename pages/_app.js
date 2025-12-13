import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import { GlobalContextProvider } from './store/globalContext'

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalContextProvider>
  );
}

export default MyApp
