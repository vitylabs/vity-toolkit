import { createAction } from "../../helpers/createAction";
import { toolMessage } from "../../helpers/common";
import { z } from "zod";
import { TwitterTool } from ".";
import type { SendTweetV2Params, TweetV2, TweetV2CountAllParams, TweetV2CountParams, Tweetv2FieldsParams, UsersV2Params, TweetRetweetedOrLikedByV2Params, TweetRetweetedOrLikedByV2ParamsWithoutPaginator, SpaceV2FieldsParams, ListUpdateV2Params, BatchComplianceJobV2, BatchComplianceV2Params, BatchComplianceSearchV2Params } from "twitter-api-v2";
import type { GetDMEventV2Params, PostDMInConversationParams } from "twitter-api-v2/dist/esm/types/v2/dm.v2.types";


const twitterSearch = async (inputParams: { query: string, limit?: number }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const searchTweets = await twitterTool.roClient.v2.search("recent", { query: inputParams.query });

    let response: TweetV2[] = [];
    const limit = inputParams.limit || 10;

    for await (const tweet of searchTweets) {
        if (response.length >= limit) break;
        response.push(tweet);
    }

    return toolMessage({
        success: true,
        data: response,
    });
}

export const twitterSearchTool = createAction({
    name: "twitterSearchTool",
    description: "Search tweets on Twitter.",
    inputParams: z.object({
        query: z.string().describe("The search query to use."),
        limit: z.number().optional().describe("Maximum number of tweets to return.").default(10)
    }),
    execute: twitterSearch,
});

const twitterSearchAll = async (inputParams: { query: string, limit?: number }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const searchTweets = await twitterTool.roClient.v2.searchAll(inputParams.query);

    let response: TweetV2[] = [];
    const limit = inputParams.limit || 10;

    for await (const tweet of searchTweets) {
        if (response.length >= limit) break;
        response.push(tweet);
    }

    return toolMessage({
        success: true,
        data: response,
    });
}

export const twitterSearchAllTool = createAction({
    name: "twitterSearchAllTool",
    description: "Search all tweets on Twitter.",
    inputParams: z.object({
        query: z.string().describe("The search query to use."),
        limit: z.number().optional().describe("Maximum number of tweets to return.").default(10)
    }),
    execute: twitterSearchAll,
});

const twitterHomeTimeline = async (inputParams: { exclude?: "retweets" | "replies" }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const homeTimeline = await twitterTool.roClient.v2.homeTimeline({ exclude: inputParams.exclude });

    let response: TweetV2[] = [];
    for await (const tweet of homeTimeline) {
        response.push(tweet);
    }

    return toolMessage({
        success: true,
        data: response,
    });
}

export const twitterHomeTimelineTool = createAction({
    name: "twitterHomeTimelineTool",
    description: "Get home timeline tweets.",
    inputParams: z.object({
        exclude: z.string().optional().describe("Exclude replies or retweets.")
    }),
    execute: twitterHomeTimeline,
});

const twitterUserTimeline = async (inputParams: { userId: string, exclude?: "retweets" | "replies" }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const userTimeline = await twitterTool.roClient.v2.userTimeline(inputParams.userId, { exclude: inputParams.exclude });

    let response: TweetV2[] = [];
    for await (const tweet of userTimeline) {
        response.push(tweet);
    }

    return toolMessage({
        success: true,
        data: response,
    });
}

export const twitterUserTimelineTool = createAction({
    name: "twitterUserTimelineTool",
    description: "Get user timeline tweets.",
    inputParams: z.object({
        userId: z.string().describe("The user ID."),
        exclude: z.string().optional().describe("Exclude replies or retweets.")
    }),
    execute: twitterUserTimeline,
});

const twitterUserMentionTimeline = async (inputParams: { userId: string, end_time?: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const userMentionTimeline = await twitterTool.roClient.v2.userMentionTimeline(inputParams.userId, { end_time: inputParams.end_time });

    let response: TweetV2[] = [];
    for await (const tweet of userMentionTimeline) {
        response.push(tweet);
    }

    return toolMessage({
        success: true,
        data: response,
    });
}

export const twitterUserMentionTimelineTool = createAction({
    name: "twitterUserMentionTimelineTool",
    description: "Get user mention timeline tweets.",
    inputParams: z.object({
        userId: z.string().describe("The user ID."),
        end_time: z.string().optional().describe("End time for the search.")
    }),
    execute: twitterUserMentionTimeline,
});

const twitterCreateTweet = async (inputParams: { statusOrPayload: string | SendTweetV2Params, payload?: SendTweetV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    let createdTweet;
    if (typeof inputParams.statusOrPayload === 'string') {
        createdTweet = await twitterTool.client.v2.tweet(inputParams.statusOrPayload);
    } else {
        createdTweet = await twitterTool.client.v2.tweet(inputParams.statusOrPayload);
    }

    return toolMessage({
        success: true,
        data: createdTweet,
    });
}

export const twitterCreateTweetTool = createAction({
    name: "twitterCreateTweetTool",
    description: "Create a new tweet.",
    inputParams: z.object({
        statusOrPayload: z.union([z.string(), z.object({})]).describe("The tweet content or payload."),
        payload: z.object({}).optional().describe("Additional tweet payload.")
    }),
    execute: twitterCreateTweet,
});

const twitterReplyTweet = async (inputParams: { status: string, in_reply_to_status_id: string, payload?: SendTweetV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const replyTweet = await twitterTool.client.v2.reply(inputParams.status, inputParams.in_reply_to_status_id, inputParams.payload);

    return toolMessage({
        success: true,
        data: replyTweet,
    });
}

export const twitterReplyTweetTool = createAction({
    name: "twitterReplyTweetTool",
    description: "Reply to a tweet.",
    inputParams: z.object({
        status: z.string().describe("The reply content."),
        in_reply_to_status_id: z.string().describe("The ID of the tweet to reply to."),
        payload: z.object({}).optional().describe("Additional tweet payload.")
    }),
    execute: twitterReplyTweet,
});

const twitterDeleteTweet = async (inputParams: { tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const deleteTweet = await twitterTool.client.v2.deleteTweet(inputParams.tweetId);

    return toolMessage({
        success: true,
        data: deleteTweet,
    });
}

export const twitterDeleteTweetTool = createAction({
    name: "twitterDeleteTweetTool",
    description: "Delete a tweet.",
    inputParams: z.object({
        tweetId: z.string().describe("The ID of the tweet to delete.")
    }),
    execute: twitterDeleteTweet,
});

const twitterLikeTweet = async (inputParams: { loggedUserId: string, tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const likeTweet = await twitterTool.client.v2.like(inputParams.loggedUserId, inputParams.tweetId);

    return toolMessage({
        success: true,
        data: likeTweet,
    });
}

export const twitterLikeTweetTool = createAction({
    name: "twitterLikeTweetTool",
    description: "Like a tweet.",
    inputParams: z.object({
        loggedUserId: z.string().describe("The ID of the logged user."),
        tweetId: z.string().describe("The ID of the tweet to like.")
    }),
    execute: twitterLikeTweet,
});

const twitterUnlikeTweet = async (inputParams: { loggedUserId: string, tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const unlikeTweet = await twitterTool.client.v2.unlike(inputParams.loggedUserId, inputParams.tweetId);

    return toolMessage({
        success: true,
        data: unlikeTweet,
    });
}

export const twitterUnlikeTweetTool = createAction({
    name: "twitterUnlikeTweetTool",
    description: "Unlike a tweet.",
    inputParams: z.object({
        loggedUserId: z.string().describe("The ID of the logged user."),
        tweetId: z.string().describe("The ID of the tweet to unlike.")
    }),
    execute: twitterUnlikeTweet,
});

const twitterRetweet = async (inputParams: { loggedUserId: string, tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const retweet = await twitterTool.client.v2.retweet(inputParams.loggedUserId, inputParams.tweetId);

    return toolMessage({
        success: true,
        data: retweet,
    });
}

export const twitterRetweetTool = createAction({
    name: "twitterRetweetTool",
    description: "Retweet a tweet.",
    inputParams: z.object({
        loggedUserId: z.string().describe("The ID of the logged user."),
        tweetId: z.string().describe("The ID of the tweet to retweet.")
    }),
    execute: twitterRetweet,
});

const twitterUnretweet = async (inputParams: { loggedUserId: string, tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const unretweet = await twitterTool.client.v2.unretweet(inputParams.loggedUserId, inputParams.tweetId);

    return toolMessage({
        success: true,
        data: unretweet,
    });
}

export const twitterUnretweetTool = createAction({
    name: "twitterUnretweetTool",
    description: "Unretweet a tweet.",
    inputParams: z.object({
        loggedUserId: z.string().describe("The ID of the logged user."),
        tweetId: z.string().describe("The ID of the tweet to unretweet.")
    }),
    execute: twitterUnretweet,
});

const twitterTweetCountRecent = async (inputParams: { query: string, options?: TweetV2CountParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const tweetCount = await twitterTool.roClient.v2.tweetCountRecent(inputParams.query, inputParams.options);

    return toolMessage({
        success: true,
        data: tweetCount,
    });
}

export const twitterTweetCountRecentTool = createAction({
    name: "twitterTweetCountRecentTool",
    description: "Get recent tweet counts for a search query.",
    inputParams: z.object({
        query: z.string().describe("The search query."),
        options: z.object({}).optional().describe("Additional options for the search.")
    }),
    execute: twitterTweetCountRecent,
});

const twitterTweetCountAll = async (inputParams: { query: string, options?: TweetV2CountAllParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const tweetCount = await twitterTool.roClient.v2.tweetCountAll(inputParams.query, inputParams.options);

    return toolMessage({
        success: true,
        data: tweetCount,
    });
}

export const twitterTweetCountAllTool = createAction({
    name: "twitterTweetCountAllTool",
    description: "Get all tweet counts for a search query.",
    inputParams: z.object({
        query: z.string().describe("The search query."),
        options: z.object({}).optional().describe("Additional options for the search.")
    }),
    execute: twitterTweetCountAll,
});

const twitterSingleTweet = async (inputParams: { tweetId: string, options?: Tweetv2FieldsParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const tweet = await twitterTool.roClient.v2.singleTweet(inputParams.tweetId, inputParams.options);

    return toolMessage({
        success: true,
        data: tweet,
    });
}

export const twitterSingleTweetTool = createAction({
    name: "twitterSingleTweetTool",
    description: "Get a single tweet by ID.",
    inputParams: z.object({
        tweetId: z.string().describe("The ID of the tweet."),
        options: z.object({}).optional().describe("Additional options for the tweet.")
    }),
    execute: twitterSingleTweet,
});

const twitterGetUser = async (inputParams: { userId: string, options?: UsersV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const user = await twitterTool.roClient.v2.user(inputParams.userId, inputParams.options);

    return toolMessage({
        success: true,
        data: user,
    });
}

export const twitterGetUserTool = createAction({
    name: "twitterGetUserTool",
    description: "Get a single user by ID.",
    inputParams: z.object({
        userId: z.string().describe("The ID of the user."),
        options: z.object({}).optional().describe("Additional options for the user.")
    }),
    execute: twitterGetUser,
});

const twitterGetUserByUsername = async (inputParams: { username: string, options?: UsersV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const user = await twitterTool.roClient.v2.userByUsername(inputParams.username, inputParams.options);

    return toolMessage({
        success: true,
        data: user,
    });
}

export const twitterGetUserByUsernameTool = createAction({
    name: "twitterGetUserByUsernameTool",
    description: "Get a single user by username.",
    inputParams: z.object({
        username: z.string().describe("The username of the user."),
        options: z.object({}).optional().describe("Additional options for the user.")
    }),
    execute: twitterGetUserByUsername,
});

const twitterGetUsers = async (inputParams: { userIds: string | string[], options?: UsersV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const users = await twitterTool.roClient.v2.users(inputParams.userIds, inputParams.options);

    return toolMessage({
        success: true,
        data: users,
    });
}

export const twitterGetUsersTool = createAction({
    name: "twitterGetUsersTool",
    description: "Get multiple users by IDs.",
    inputParams: z.object({
        userIds: z.union([z.string(), z.array(z.string())]).describe("The IDs of the users."),
        options: z.object({}).optional().describe("Additional options for the users.")
    }),
    execute: twitterGetUsers,
});

const twitterGetUsersByUsernames = async (inputParams: { usernames: string | string[], options?: UsersV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const users = await twitterTool.roClient.v2.usersByUsernames(inputParams.usernames, inputParams.options);

    return toolMessage({
        success: true,
        data: users,
    });
}

export const twitterGetUsersByUsernamesTool = createAction({
    name: "twitterGetUsersByUsernamesTool",
    description: "Get multiple users by usernames.",
    inputParams: z.object({
        usernames: z.union([z.string(), z.array(z.string())]).describe("The usernames of the users."),
        options: z.object({}).optional().describe("Additional options for the users.")
    }),
    execute: twitterGetUsersByUsernames,
});

const twitterTweetLikedBy = async (inputParams: { tweetId: string, options?: TweetRetweetedOrLikedByV2ParamsWithoutPaginator }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const likedBy = await twitterTool.roClient.v2.tweetLikedBy(inputParams.tweetId, inputParams.options);

    return toolMessage({
        success: true,
        data: likedBy,
    });
}

export const twitterTweetLikedByTool = createAction({
    name: "twitterTweetLikedByTool",
    description: "Get users that liked a specific tweet.",
    inputParams: z.object({
        tweetId: z.string().describe("The ID of the tweet."),
        options: z.object({}).optional().describe("Additional options for the request.")
    }),
    execute: twitterTweetLikedBy,
});

const twitterTweetRetweetedBy = async (inputParams: { tweetId: string, options?: TweetRetweetedOrLikedByV2ParamsWithoutPaginator }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const retweetedBy = await twitterTool.roClient.v2.tweetRetweetedBy(inputParams.tweetId, inputParams.options);

    return toolMessage({
        success: true,
        data: retweetedBy,
    });
}

export const twitterTweetRetweetedByTool = createAction({
    name: "twitterTweetRetweetedByTool",
    description: "Get users that retweeted a specific tweet.",
    inputParams: z.object({
        tweetId: z.string().describe("The ID of the tweet."),
        options: z.object({}).optional().describe("Additional options for the request.")
    }),
    execute: twitterTweetRetweetedBy,
});

const twitterCreateTweetThread = async (inputParams: { tweets: (SendTweetV2Params | string)[] }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const tweetThread = await twitterTool.client.v2.tweetThread(inputParams.tweets);

    return toolMessage({
        success: true,
        data: tweetThread,
    });
}

export const twitterCreateTweetThreadTool = createAction({
    name: "twitterCreateTweetThreadTool",
    description: "Create a thread of tweets.",
    inputParams: z.object({
        tweets: z.array(z.union([z.string(), z.object({})])).describe("The tweets to post in the thread.")
    }),
    execute: twitterCreateTweetThread,
});

const twitterBookmarkTweet = async (inputParams: { tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const bookmark = await twitterTool.client.v2.bookmark(inputParams.tweetId);

    return toolMessage({
        success: true,
        data: bookmark,
    });
}

export const twitterBookmarkTweetTool = createAction({
    name: "twitterBookmarkTweetTool",
    description: "Bookmark a tweet.",
    inputParams: z.object({
        tweetId: z.string().describe("The ID of the tweet to bookmark.")
    }),
    execute: twitterBookmarkTweet,
});

const twitterRemoveBookmark = async (inputParams: { tweetId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const removeBookmark = await twitterTool.client.v2.deleteBookmark(inputParams.tweetId);

    return toolMessage({
        success: true,
        data: removeBookmark,
    });
}

export const twitterRemoveBookmarkTool = createAction({
    name: "twitterRemoveBookmarkTool",
    description: "Remove a bookmark from a tweet.",
    inputParams: z.object({
        tweetId: z.string().describe("The ID of the tweet to remove the bookmark from.")
    }),
    execute: twitterRemoveBookmark,
});

const twitterCreateList = async (inputParams: { name: string, private?: boolean }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const list = await twitterTool.client.v2.createList({ name: inputParams.name, private: inputParams.private });

    return toolMessage({
        success: true,
        data: list,
    });
}

export const twitterCreateListTool = createAction({
    name: "twitterCreateListTool",
    description: "Create a new list.",
    inputParams: z.object({
        name: z.string().describe("The name of the list."),
        private: z.boolean().optional().describe("Whether the list is private.")
    }),
    execute: twitterCreateList,
});

const twitterUpdateList = async (inputParams: { listId: string, options: ListUpdateV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const updatedList = await twitterTool.client.v2.updateList(inputParams.listId, inputParams.options);

    return toolMessage({
        success: true,
        data: updatedList,
    });
}

export const twitterUpdateListTool = createAction({
    name: "twitterUpdateListTool",
    description: "Update list metadata.",
    inputParams: z.object({
        listId: z.string().describe("The ID of the list."),
        options: z.object({}).describe("The options to update the list.")
    }),
    execute: twitterUpdateList,
});

const twitterDeleteList = async (inputParams: { listId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const deleteList = await twitterTool.client.v2.removeList(inputParams.listId);

    return toolMessage({
        success: true,
        data: deleteList,
    });
}

export const twitterDeleteListTool = createAction({
    name: "twitterDeleteListTool",
    description: "Delete a list.",
    inputParams: z.object({
        listId: z.string().describe("The ID of the list to delete.")
    }),
    execute: twitterDeleteList,
});

const twitterGetSpace = async (inputParams: { spaceId: string, options?: SpaceV2FieldsParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const space = await twitterTool.roClient.v2.space(inputParams.spaceId, inputParams.options);

    return toolMessage({
        success: true,
        data: space,
    });
}

export const twitterGetSpaceTool = createAction({
    name: "twitterGetSpaceTool",
    description: "Get a single space by ID.",
    inputParams: z.object({
        spaceId: z.string().describe("The ID of the space."),
        options: z.object({}).optional().describe("Additional options for the space.")
    }),
    execute: twitterGetSpace,
});

const twitterGetSpaces = async (inputParams: { spaceIds: string | string[], options?: SpaceV2FieldsParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const spaces = await twitterTool.roClient.v2.spaces(inputParams.spaceIds, inputParams.options);

    return toolMessage({
        success: true,
        data: spaces,
    });
}

export const twitterGetSpacesTool = createAction({
    name: "twitterGetSpacesTool",
    description: "Get multiple spaces by IDs.",
    inputParams: z.object({
        spaceIds: z.union([z.string(), z.array(z.string())]).describe("The IDs of the spaces."),
        options: z.object({}).optional().describe("Additional options for the spaces.")
    }),
    execute: twitterGetSpaces,
});

const twitterListDmEvents = async (inputParams: { options?: GetDMEventV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const dmEvents = await twitterTool.roClient.v2.listDmEvents(inputParams.options);

    return toolMessage({
        success: true,
        data: dmEvents,
    });
}

export const twitterListDmEventsTool = createAction({
    name: "twitterListDmEventsTool",
    description: "Fetch direct message events.",
    inputParams: z.object({
        options: z.object({}).optional().describe("Additional options for fetching DM events.")
    }),
    execute: twitterListDmEvents,
});

const twitterListDmEventsWithParticipant = async (inputParams: { participantId: string, options?: GetDMEventV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const dmEvents = await twitterTool.roClient.v2.listDmEventsWithParticipant(inputParams.participantId, inputParams.options);

    return toolMessage({
        success: true,
        data: dmEvents,
    });
}

export const twitterListDmEventsWithParticipantTool = createAction({
    name: "twitterListDmEventsWithParticipantTool",
    description: "Fetch DM events with a specific participant.",
    inputParams: z.object({
        participantId: z.string().describe("The ID of the participant."),
        options: z.object({}).optional().describe("Additional options for fetching DM events.")
    }),
    execute: twitterListDmEventsWithParticipant,
});

const twitterListDmEventsOfConversation = async (inputParams: { dmConversationId: string, options?: GetDMEventV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const dmEvents = await twitterTool.roClient.v2.listDmEventsOfConversation(inputParams.dmConversationId, inputParams.options);

    return toolMessage({
        success: true,
        data: dmEvents,
    });
}

export const twitterListDmEventsOfConversationTool = createAction({
    name: "twitterListDmEventsOfConversationTool",
    description: "Fetch DM events of a specific conversation.",
    inputParams: z.object({
        dmConversationId: z.string().describe("The ID of the DM conversation."),
        options: z.object({}).optional().describe("Additional options for fetching DM events.")
    }),
    execute: twitterListDmEventsOfConversation,
});

const twitterSendDmToParticipant = async (inputParams: { participantId: string, options: PostDMInConversationParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const dmResult = await twitterTool.client.v2.sendDmToParticipant(inputParams.participantId, inputParams.options);

    return toolMessage({
        success: true,
        data: dmResult,
    });
}

export const twitterSendDmToParticipantTool = createAction({
    name: "twitterSendDmToParticipantTool",
    description: "Send a DM to a participant.",
    inputParams: z.object({
        participantId: z.string().describe("The ID of the participant."),
        options: z.object({}).describe("The DM options.")
    }),
    execute: twitterSendDmToParticipant,
});

const twitterSendDmInConversation = async (inputParams: { conversationId: string, options: PostDMInConversationParams }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const dmResult = await twitterTool.client.v2.sendDmInConversation(inputParams.conversationId, inputParams.options);

    return toolMessage({
        success: true,
        data: dmResult,
    });
}

export const twitterSendDmInConversationTool = createAction({
    name: "twitterSendDmInConversationTool",
    description: "Send a DM in a known conversation.",
    inputParams: z.object({
        conversationId: z.string().describe("The ID of the DM conversation."),
        options: z.object({}).describe("The DM options.")
    }),
    execute: twitterSendDmInConversation,
});

const twitterGetComplianceJob = async (inputParams: { jobId: string }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const job = await twitterTool.roClient.v2.complianceJob(inputParams.jobId);

    return toolMessage({
        success: true,
        data: job,
    });
}

export const twitterGetComplianceJobTool = createAction({
    name: "twitterGetComplianceJobTool",
    description: "Get a single compliance job.",
    inputParams: z.object({
        jobId: z.string().describe("The ID of the compliance job.")
    }),
    execute: twitterGetComplianceJob,
});

const twitterSearchComplianceJobs = async (inputParams: { options: BatchComplianceSearchV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const jobs = await twitterTool.roClient.v2.complianceJobs(inputParams.options);

    return toolMessage({
        success: true,
        data: jobs,
    });
}

export const twitterSearchComplianceJobsTool = createAction({
    name: "twitterSearchComplianceJobsTool",
    description: "Search compliance jobs.",
    inputParams: z.object({
        options: z.object({}).describe("The options to search compliance jobs.")
    }),
    execute: twitterSearchComplianceJobs,
});

const twitterCreateComplianceJob = async (inputParams: { options: BatchComplianceV2Params }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const job = await twitterTool.client.v2.sendComplianceJob(inputParams.options);

    return toolMessage({
        success: true,
        data: job,
    });
}

export const twitterCreateComplianceJobTool = createAction({
    name: "twitterCreateComplianceJobTool",
    description: "Create a new compliance job.",
    inputParams: z.object({
        options: z.object({}).describe("The options to create a compliance job.")
    }),
    execute: twitterCreateComplianceJob,
});

const twitterGetComplianceJobResult = async (inputParams: { job: BatchComplianceJobV2 }): Promise<string> => {
    const twitterTool = new TwitterTool();
    const jobResult = await twitterTool.roClient.v2.complianceJobResult(inputParams.job);

    return toolMessage({
        success: true,
        data: jobResult,
    });
}

export const twitterGetComplianceJobResultTool = createAction({
    name: "twitterGetComplianceJobResultTool",
    description: "Get compliance job result.",
    inputParams: z.object({
        job: z.object({}).describe("The compliance job.")
    }),
    execute: twitterGetComplianceJobResult,
});


