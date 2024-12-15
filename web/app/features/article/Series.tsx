import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'
import { TextLink } from '~/components/TextLink'
import { postUrl } from '~/lib/format'

type SeriesProps = {
  postId: string
  series: NonNullable<NonNullable<POST_BY_SLUGResult>['series']>
}

const Series = ({ postId, series }: SeriesProps) => {
  return (
    <div className="p-2 bg-primary-foreground text-black rounded-sm">
      <div className="bg-red-600 text-sm text-white rounded-sm uppercase w-fit py-1 px-4 mb-4">Serie</div>
      <details>
        <summary className="text-2xl font-bold mb-2">{series.title}</summary>
        <p className="text-md">{series.description}</p>
        <ol className="list-disc ml-4 mt-8">
          {series.posts
            .filter((postInSeries) => (series?.shouldListNonPublishedContent ? true : postInSeries.isAvailable))
            .map((postInSeries) => (
              <li key={postInSeries._id}>
                {postInSeries.isAvailable ? (
                  <TextLink
                    href={postUrl(postInSeries)}
                    className={`text-md ${postInSeries._id === postId ? 'font-gt-standard-medium' : ''}`}
                    aria-current={postInSeries._id === postId}
                  >
                    {postInSeries.title}
                  </TextLink>
                ) : (
                  <span className="text-md">{postInSeries.title}</span>
                )}
              </li>
            ))}
        </ol>
      </details>
    </div>
  )
}

export default Series
