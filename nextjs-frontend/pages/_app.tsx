import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Meta from '../components/elements/Meta'


// DayJS
import dayjs from 'dayjs'
import 'dayjs/locale/da'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.locale('da')

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Meta/>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default App
