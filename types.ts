export interface Credentials {
    username: string,
    password: string
}

export interface Reddit {
    after: string,
    dist: number,
    modhash: string,
    geo_filter: string,
    children: RedditChild[],
    before: string
}

export interface RedditChild {
    data: RedditChildData
}

export interface RedditChildData {
    name: string,
    subreddit: string,
    media: RedditVideo,
    author: string,
    title: string,
    url: string
    created_utc: number;
    ups: number,
    downs: number
}

export interface RedditVideo {
    reddit_video: MediaData
}

export interface MediaData {
    duration: number,
    height: number,
    width: number,
    fallback_url: string
}

export interface RedditApiData {
    videoPage1: [{
        url: string,
        title: string,
        audio: string,
        ups: number,
        downs: number,
        duration?: string
    }],
    videoPage2: [{
        url: string,
        title: string,
        audio: string,
        ups: number,
        downs: number,
        duration?: string
    }],
    userRequestData: {
        subreddit: string,
        sortType: string,
        topSortType: string
        resultsAmount: string,
    }
    firstLoaded: boolean,
    error: string
}