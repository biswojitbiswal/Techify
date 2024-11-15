import axios from "axios";
import { SocialPost } from "../models/SocialMedia.model.js";

const fetchTwitterPostDetails = async (url, apiConfig) => {
  const tweetId = url.split("/").pop(); // Extract tweet ID
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

// Helper: Fetch Instagram post
// const fetchInstagramPostDetails = async (url, apiConfig) => {
//     const postId = url.split("/").slice(-2, -1)[0]; // Extract the post's shortcode
//     const response = await axios.get(
//       `https://graph.instagram.com/${postId}`,
//       {
//         headers: { Authorization: `Bearer ${apiConfig.fbIgAccessToken}` },
//         params: {
//           fields:
//             "id,media_type,media_url,username,timestamp,caption,like_count,comments_count",
//         },
//       }
//     );
  
//     const data = response.data;
  
//     if (!data.id) {
//       throw new Error("Failed to fetch Instagram post details. `id` is missing.");
//     }
  
//     return {
//       platform: "Instagram",
//       postId: data.id, // This should be present in the response
//       url,
//       text: data.caption || "",
//       media: [data.media_url],
//       author: { username: data.username },
//       metrics: {
//         likes: data.like_count,
//         comments: data.comments_count,
//       },
//       createdAt: data.timestamp,
//     };
//   };

// // Helper: Fetch Facebook post
// const fetchFacebookPostDetails = async (url, apiConfig) => {
//   const postId = url.split("/").pop(); // Extract post ID
//   const response = await axios.get(
//     `https://www.facebook.com/v17.0/${postId}`,
//     {
//       headers: { Authorization: `Bearer ${apiConfig.fbIgAccessToken}` },
//       params: {
//         fields:
//           "id,message,created_time,shares.summary(true),comments.summary(true),from",
//       },
//     }
//   );

//   const data = response.data;

//   return {
//     platform: "Facebook",
//     postId: data.id,
//     url,
//     text: data.message || "",
//     media: [], // Extend to fetch media URLs if needed
//     author: { name: data.from.name },
//     metrics: {
//       shares: data.shares?.count || 0,
//       comments: data.comments?.summary?.total_count || 0,
//     },
//     createdAt: data.created_time,
//   };
// };

// Unified Controller
const fetchAndSavePost = async (req, res) => {
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
     } 
    //else if (url.includes("instagram.com")) {
    //   postDetails = await fetchInstagramPostDetails(url, apiConfig);
    // } else if (url.includes("facebook.com")) {
    //   postDetails = await fetchFacebookPostDetails(url, apiConfig);
    // } 
    else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported platform." });
    }

    const post = new SocialPost(postDetails);
    await post.save();

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message, error });
  }
};


export {
    fetchAndSavePost
}