import { POST_BY_SLUGResult } from 'utils/sanity/types/sanity.types'
import { TextLink } from '~/components/TextLink'
import { postUrl } from '~/lib/format'
import { StampBorder } from '../StampBorder'

type SeriesProps = {
  postId: string
  series: NonNullable<NonNullable<POST_BY_SLUGResult>['series']>
  mobileOnly: boolean
}

const visiblePosts = (series: NonNullable<NonNullable<POST_BY_SLUGResult>['series']>) => {
  return series.posts.filter((post) => series.shouldListNonPublishedContent || post.isAvailable)
}

export const shouldShowSeries = (post: NonNullable<POST_BY_SLUGResult>) => {
  return post.series && visiblePosts(post.series).length >= 2
}

const Series = ({ postId, series, mobileOnly }: SeriesProps) => {
  return (
    <div className={`${mobileOnly ? 'block max-w-[358px] mt-16 md:hidden' : 'hidden md:block'} h-fit w-full`}>
      <StampBorder background="#F7F3EE" borderColor={'#ED7E87'} borderThickness="16px" borderRotation="-1deg">
        <div className={`p-8 text-action-desktop`}>
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
      </StampBorder>
    </div>
  )
}

export default Series
