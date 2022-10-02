import Head from 'next/head'

interface MetaProps {
    title?: string;
    keywords?: string;
    description?: string;
    icon?: string;
    image?: string;
    url: string;
}

const Meta = (props: MetaProps) => {
  return (
    <Head>
      <meta name="theme-color" content="#0050ff"/>

      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='keywords' content={props.keywords} />
      <meta name='description' content={props.description} />
    
      <meta name="Language" content="da" />
      <meta httpEquiv="Content-Language" content="da" />

      <meta charSet='utf-8' />
      <link rel='icon' href={props.icon} />
      <title>{props.title}</title>


      <meta property='og:title' content={props.title}/>
      <meta property='og:site_name' content={props.title}/>
      <meta property="og:url" content={props.url}/>
      <meta property='og:description' content={props.description}/>
      <meta property="og:type" content="website"/>
      <meta property="og:image" content={props.image}/>

      <meta property='twitter:card' content='summary_large_image'/>
      <meta property='twitter:url' content={props.url}/>
      <meta property='twitter:title' content={props.title}/>
      <meta property="twitter:description" content={props.description}/>
      <meta property='twitter:image' content={props.image}/>

    </Head>
  )
}

Meta.defaultProps = {
  title: 'Clubreview - Find din næste klub',
  keywords: 'Some nice keywords right here.',
  description: 'Descriptive description',
  icon: '/favicon.svg',
  image: '/png/banner.png',
  url: 'https://clubreview.dk',
}

export default Meta