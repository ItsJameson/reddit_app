import express from "express";
const app = express();
const Reddit = require("reddit");
require("dotenv").config({ path: "./specs.env" });
const username = process.env.USERNAME_REDDIT as string;
const password = process.env.PASSWORD as string;
const clientId = process.env.CLIENTID as string;
const clientSecret = process.env.CLIENTSECRET as string;
const userAgent = process.env.USERAGENT as string;
import { Credentials, Reddit, RedditChild, RedditApiData } from "./types";


app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("port", 3000);

const credentials: Credentials = { username: username, password: password };

let redditData: RedditApiData = {
  videoPage1: [
    {
      url: "",
      title: "",
      audio: "",
      ups: 0,
      downs: 0,
    },
  ],
  videoPage2: [
    {
      url: "",
      title: "",
      audio: "",
      ups: 0,
      downs: 0,
    },
  ],
  userRequestData: {
    subreddit: "",
    sortType: "",
    topSortType: "",
    resultsAmount: "",
  },
  firstLoaded: true,
  error: "",
};

const reddit = new Reddit({
  username: credentials.username,
  password: credentials.password,
  appId: clientId,
  appSecret: clientSecret,
  userAgent: userAgent,
});

let need2Pages: boolean = true;
let wideVideos: boolean = false;

const mainScrapper = async (
  subreddit: string,
  sorttype: string,
  topSortType: string,
  resultsamount: string
) => {
  let childData1: RedditChild[] = [];
  let childData2: RedditChild[] = [];
  redditData.error = "";
  if (topSortType == undefined) {
    topSortType = "hour";
  }

  try {
    const resultsPage1 = await reddit.get(`/r/${subreddit}/${sorttype}`, {
      t: `${topSortType}`,
      limit: `${resultsamount}`,
    });
    childData1 = resultsPage1.data.children;

    const resultsPage2 = await reddit.get(`/r/${subreddit}/${sorttype}`, {
      after: childData1[childData1.length - 1].data.name,
      t: `${topSortType}`,
      limit: `${resultsamount}`,
    });
    childData2 = resultsPage2.data.children;
  } catch (error: any) {
    redditData.error = error.message;
  }

  let audioLink: string = "";
  let indexOfDash: number = -1;
  let indexOfDot: number = -1;

  redditData.videoPage1.splice(0, redditData.videoPage1.length);
  redditData.videoPage2.splice(0, redditData.videoPage2.length);

  let j: number = 0;

  for (let i = 0; i < childData1.length; i++) {
    if (childData1[i].data.media != null) {
      if (childData1[i].data.media.reddit_video != null) {
        if (childData1[i].data.media.reddit_video.width > 1000 && wideVideos) {
          audioLink = "";

          for (
            let k = childData1[i].data.media.reddit_video.fallback_url.length;
            k > 0;
            k--
          ) {
            if (childData1[i].data.media.reddit_video.fallback_url[k] == ".") {
              indexOfDot = k;
              k = 0;
            }
          }

          indexOfDash =
            childData1[i].data.media.reddit_video.fallback_url.indexOf("_");
          audioLink = childData1[
            i
          ].data.media.reddit_video.fallback_url.substring(0, indexOfDash + 1);
          audioLink += `audio${childData1[
            i
          ].data.media.reddit_video.fallback_url.substring(indexOfDot)}`;

          redditData.videoPage1[j] = {
            url: "",
            audio: "",
            title: "",
            ups: 0,
            downs: 0,
          };
          redditData.videoPage1[
            j
          ].url = `${childData1[i].data.media.reddit_video.fallback_url}`;
          redditData.videoPage1[j].audio = `${audioLink}`;
          redditData.videoPage1[j].title = childData1[i].data.title;

          j++;
        } else if (!wideVideos) {
          audioLink = "";

          for (
            let k = childData1[i].data.media.reddit_video.fallback_url.length;
            k > 0;
            k--
          ) {
            if (childData1[i].data.media.reddit_video.fallback_url[k] == ".") {
              indexOfDot = k;
              k = 0;
            }
          }
          indexOfDash =
            childData1[i].data.media.reddit_video.fallback_url.indexOf("_");
          audioLink = childData1[
            i
          ].data.media.reddit_video.fallback_url.substring(0, indexOfDash + 1);
          audioLink += `audio${childData1[
            i
          ].data.media.reddit_video.fallback_url.substring(indexOfDot)}`;

          redditData.videoPage1[j] = {
            url: "",
            audio: "",
            title: "",
            ups: 0,
            downs: 0,
          };
          redditData.videoPage1[
            j
          ].url = `${childData1[i].data.media.reddit_video.fallback_url}`;
          redditData.videoPage1[j].audio = `${audioLink}`;
          redditData.videoPage1[j].title = childData1[i].data.title;
          redditData.videoPage1[j].ups = childData1[i].data.ups;
          redditData.videoPage1[j].downs = childData1[i].data.downs;

          j++;
        }
      }
    }
  }

  if (need2Pages) {
    j = 0;
    for (let i = 0; i < childData2.length; i++) {
      if (childData2[i].data.media != null) {
        if (childData2[i].data.media.reddit_video != null) {
          if (
            childData2[i].data.media.reddit_video.width > 1000 &&
            wideVideos
          ) {
            audioLink = "";

            for (
              let k = childData2[i].data.media.reddit_video.fallback_url.length;
              k > 0;
              k--
            ) {
              if (
                childData2[i].data.media.reddit_video.fallback_url[k] == "."
              ) {
                indexOfDot = k;
                k = 0;
              }
            }

            indexOfDash =
              childData2[i].data.media.reddit_video.fallback_url.indexOf("_");
            audioLink = childData2[
              i
            ].data.media.reddit_video.fallback_url.substring(
              0,
              indexOfDash + 1
            );
            audioLink += `audio${childData2[
              i
            ].data.media.reddit_video.fallback_url.substring(indexOfDot)}`;

            redditData.videoPage2[j] = {
              url: "",
              audio: "",
              title: "",
              ups: 0,
              downs: 0,
            };
            redditData.videoPage2[
              j
            ].url = `${childData2[i].data.media.reddit_video.fallback_url}`;
            redditData.videoPage2[j].audio = `${audioLink}`;
            redditData.videoPage2[j].title = childData2[i].data.title;

            j++;
          } else if (!wideVideos) {
            audioLink = "";

            for (
              let k = childData2[i].data.media.reddit_video.fallback_url.length;
              k > 0;
              k--
            ) {
              if (
                childData2[i].data.media.reddit_video.fallback_url[k] == "."
              ) {
                indexOfDot = k;
                k = 0;
              }
            }
            indexOfDash =
              childData2[i].data.media.reddit_video.fallback_url.indexOf("_");
            audioLink = childData2[
              i
            ].data.media.reddit_video.fallback_url.substring(
              0,
              indexOfDash + 1
            );
            audioLink += `audio${childData2[
              i
            ].data.media.reddit_video.fallback_url.substring(indexOfDot)}`;

            redditData.videoPage2[j] = {
              url: "",
              audio: "",
              title: "",
              ups: 0,
              downs: 0,
            };
            redditData.videoPage2[
              j
            ].url = `${childData2[i].data.media.reddit_video.fallback_url}`;
            redditData.videoPage2[j].audio = `${audioLink}`;
            redditData.videoPage2[j].title = childData2[i].data.title;
            redditData.videoPage2[j].ups = childData2[i].data.ups;
            redditData.videoPage2[j].downs = childData2[i].data.downs;

            j++;
          }
        }
      }
    }
  }
};

app.get("/", (req, res) => {
  res.render("index", { dataApi: redditData });
});

app.post("/", (req, res) => {
  let userSubredditChoice = req.body.subreddit;
  let userSortChoice = req.body.sortType;
  let userResultsChoice = req.body.resultsAmount;
  let userTopSortChoice = req.body.topSortType;

  redditData.userRequestData = {
    subreddit: userSubredditChoice,
    sortType: userSortChoice,
    topSortType: userTopSortChoice,
    resultsAmount: userResultsChoice,
  };

  if (userResultsChoice <= 100) {
    userResultsChoice = Math.ceil(userResultsChoice / 2);
  }

  mainScrapper(
    userSubredditChoice,
    userSortChoice,
    userTopSortChoice,
    userResultsChoice
  );
  redditData.firstLoaded = false;

  setTimeout(() => {
    res.render("index", { dataApi: redditData });
  }, 6000);
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);

export {};
