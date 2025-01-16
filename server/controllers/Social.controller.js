import axios from "axios";
import { SocialPost } from "../models/SocialMedia.model.js";

const fetchTwitterPostDetails = async (url, apiConfig) => {
  const tweetId = url.split("/").pop();
  const response = await axios.get(
    `https://api.twitter.com/2/tweets/${tweetId}`,
    {
      headers: { Authorization: `Bearer ${apiConfig.twitterBearerToken}` },
      params: {
        expansions: "author_id",
        "user.fields": "username,profile_image_url",
        "tweet.fields": "created_at,public_metrics,text",
      },
    }
  );

  const data = response.data;
  const tweet = data.data;
  const author = data.includes.users[0];

  return {
    platform: "Twitter",
    postId: tweet.id,
    url,
    text: tweet.text,
    media: [],
    author: {
      username: author.username,
      name: author.name,
      profileImage: author.profile_image_url,
    },
    metrics: {
      likes: tweet.public_metrics.like_count,
      shares: tweet.public_metrics.retweet_count,
      comments: tweet.public_metrics.reply_count,
    },
    createdAt: tweet.created_at,
  };
};


const fetchAndSavePost = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "Post URL is required." });
    }

    const apiConfig = {
      twitterBearerToken: process.env.TWITTER_BEARER_TOKEN,
      fbIgAccessToken: process.env.GRAPH_API_EXPLORE,
    };

    let postDetails;
    if (url.includes("x.com")) {
      postDetails = await fetchTwitterPostDetails(url, apiConfig);
     } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported platform." });
    }

    const post = new SocialPost(postDetails);
    await post.save();

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};


const getAllSocialMediaPost = async(req, res, next) => {
  try {
    const posts = await SocialPost.find({});
    
    if(!posts){
      return res.status(404).json({message: "Posts Not Found"});
    }

    return res.status(200).json({
      message: "Fetched Successfully",
      posts,
    })
  } catch (error) {
    next(error);
  }
}

export {
    fetchAndSavePost,
    getAllSocialMediaPost
}