import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'
import { TextLink } from '~/components/TextLink'
import { postUrl } from '~/lib/format'
import { RedSealSVG } from '../../components/RedSealSVG'

type SeriesProps = {
  postId: string
  series: NonNullable<NonNullable<POST_BY_SLUGResult>['series']>
}

export const shouldShowSeries = (post: NonNullable<POST_BY_SLUGResult>) => {
  return (
    post.series &&
    post.series.posts.length > 1 &&
    (post.series.shouldListNonPublishedContent
      ? true
      : post.series.posts.every((postInSeries) => postInSeries.isAvailable))
  )
}

const Series = ({ postId, series }: SeriesProps) => {
  return (
    <div className="mx-auto mt-12 p-4 pl-6 h-[335px] w-[358px] md:w-auto box-border bg-[url('/images/letter-white.svg')] md:bg-[url('/images/letter-beige.svg')] text-black rounded-sm bg-no-repeat">
      <RedSealSVG />
      <div className="h-full w-full pb-8 overflow-scroll text-action-desktop">
        <h2 className="text-2xl my-4">{series.title}</h2>
        <p>{series.description}</p>
        <div className="mt-6 pb-6 border-box">
          {series.posts
            .filter((postInSeries) => (series?.shouldListNonPublishedContent ? true : postInSeries.isAvailable))
            .map((postInSeries) => (
              <div className="mt-2" key={postInSeries._id}>
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
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Series
