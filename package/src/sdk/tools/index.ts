import { SolanaWalletTool } from "./solana-wallet";
import { TwitterTool } from "./twitter";
import { EarnTool } from "./earn";

import { solanaWalletGenerateKeypairTool } from "./solana-wallet/actions/generate-keypair";
import { solanaWalletGetBalanceTool } from "./solana-wallet/actions/get-balance";
import { solanaWalletGetMyPublicKeyTool } from "./solana-wallet/actions/get-my-publicKey";
import { solanaWalletTransferTool } from "./solana-wallet/actions/transfer";

import {
    twitterSearchTool,
    twitterSearchAllTool,
    twitterHomeTimelineTool,
    twitterUserTimelineTool,
    twitterUserMentionTimelineTool,
    twitterCreateTweetTool,
    twitterReplyTweetTool,
    twitterDeleteTweetTool,
    twitterLikeTweetTool,
    twitterUnlikeTweetTool,
    twitterRetweetTool,
    twitterUnretweetTool,
    twitterTweetCountRecentTool,
    twitterTweetCountAllTool,
    twitterSingleTweetTool,
    twitterGetUserTool,
    twitterGetUserByUsernameTool,
    twitterGetUsersTool,
    twitterGetUsersByUsernamesTool,
    twitterTweetLikedByTool,
    twitterTweetRetweetedByTool,
    twitterCreateTweetThreadTool,
    twitterBookmarkTweetTool,
    twitterRemoveBookmarkTool,
    twitterCreateListTool,
    twitterUpdateListTool,
    twitterDeleteListTool,
    twitterGetSpaceTool,
    twitterGetSpacesTool,
    twitterListDmEventsTool,
    twitterListDmEventsWithParticipantTool,
    twitterListDmEventsOfConversationTool,
    twitterSendDmToParticipantTool,
    twitterSendDmInConversationTool,
    twitterGetComplianceJobTool,
    twitterSearchComplianceJobsTool,
    twitterCreateComplianceJobTool,
    twitterGetComplianceJobResultTool,
} from "./twitter/actions/v2";

import { earnActivityFeedTool } from "./earn/actions/activity-feed";
import { earnFetchGrantDetailsTool } from "./earn/actions/fetch-grant-details";
import { earnFetchExclusiveSponsorGrantsTool } from "./earn/actions/fetch-exclusive-sponsor-grants";
import { earnFetchUserPoWsTool } from "./earn/actions/fetch-user-pow";
import { earnBountyListingsTool } from "./earn/actions/bounty-listings";
import { earnGrantsListingsTool } from "./earn/actions/grants-listings";
import { earnSearchUsersTool } from "./earn/actions/search-users";
import { earnSubmissionDetailsTool } from "./earn/actions/submission-details";
import { earnTotalUserCountTool } from "./earn/actions/total-user-count";
import { earnFetchUserPublicStatsTool } from "./earn/actions/user-public-stats";
import { earnFetchFeedTool } from "./earn/actions/feed";
import { RedditTool } from "./reddit";
import { redditFilterTool } from "./reddit/actions/filter";


//  A P P S

export enum App {
    SOLANA_WALLET = 'solana-wallet',
    TWITTER = 'twitter',
    EARN = 'earn',
    REDDIT = 'reddit',
}

export const appsMap = {
    [App.SOLANA_WALLET]: SolanaWalletTool,
    [App.TWITTER]: TwitterTool,
    [App.EARN]: EarnTool,
    [App.REDDIT]: RedditTool,
}

// Integrable apps

export type IntegrableApps = Extract<
    App,
    App.TWITTER | App.REDDIT
>;

// Connectable apps

export type ConnectableApps = Extract<
    App,
    App.TWITTER | App.REDDIT
>;


// A C T I O N S

export enum Action {
    SOLANA_WALLET_GENERATE_KEYPAIR,
    SOLANA_WALLET_GET_BALANCE,
    SOLANA_WALLET_GET_MY_PUBLIC_KEY,
    SOLANA_WALLET_TRANSFER,

    TWITTER_SEARCH,
    TWITTER_SEARCH_ALL,
    TWITTER_HOME_TIMELINE,
    TWITTER_USER_TIMELINE,
    TWITTER_USER_MENTION_TIMELINE,
    TWITTER_CREATE_TWEET,
    TWITTER_REPLY_TWEET,
    TWITTER_DELETE_TWEET,
    TWITTER_LIKE_TWEET,
    TWITTER_UNLIKE_TWEET,
    TWITTER_RETWEET,
    TWITTER_UNRETWEET,
    TWITTER_TWEET_COUNT_RECENT,
    TWITTER_TWEET_COUNT_ALL,
    TWITTER_SINGLE_TWEET,
    TWITTER_GET_USER,
    TWITTER_GET_USER_BY_USERNAME,
    TWITTER_GET_USERS,
    TWITTER_GET_USERS_BY_USERNAMES,
    TWITTER_TWEET_LIKED_BY,
    TWITTER_TWEET_RETWEETED_BY,
    TWITTER_CREATE_TWEET_THREAD,
    TWITTER_BOOKMARK_TWEET,
    TWITTER_REMOVE_BOOKMARK,
    TWITTER_CREATE_LIST,
    TWITTER_UPDATE_LIST,
    TWITTER_DELETE_LIST,
    TWITTER_GET_SPACE,
    TWITTER_GET_SPACES,
    TWITTER_LIST_DM_EVENTS,
    TWITTER_LIST_DM_EVENTS_WITH_PARTICIPANT,
    TWITTER_LIST_DM_EVENTS_OF_CONVERSATION,
    TWITTER_SEND_DM_TO_PARTICIPANT,
    TWITTER_SEND_DM_IN_CONVERSATION,
    TWITTER_GET_COMPLIANCE_JOB,
    TWITTER_SEARCH_COMPLIANCE_JOBS,
    TWITTER_CREATE_COMPLIANCE_JOB,
    TWITTER_GET_COMPLIANCE_JOB_RESULT,

    EARN_ACTIVITY_FEED,
    EARN_FETCH_FEED,
    EARN_FETCH_GRANT_DETAILS,
    EARN_FETCH_EXCLUSIVE_SPONSOR_GRANTS,
    EARN_FETCH_USER_POWS,
    EARN_BOUNTY_LISTINGS,
    EARN_GRANT_LISTINGS,
    EARN_SEARCH_USERS,
    EARN_SUBMISSION_DETAILS,
    EARN_TOTAL_USER_COUNT,
    EARN_FETCH_USER_PUBLIC_STATS,

    REDDIT_FILTER,
}

export const actionsMap = {
    [Action.SOLANA_WALLET_GENERATE_KEYPAIR]: solanaWalletGenerateKeypairTool,
    [Action.SOLANA_WALLET_GET_BALANCE]: solanaWalletGetBalanceTool,
    [Action.SOLANA_WALLET_GET_MY_PUBLIC_KEY]: solanaWalletGetMyPublicKeyTool,
    [Action.SOLANA_WALLET_TRANSFER]: solanaWalletTransferTool,

    [Action.TWITTER_SEARCH]: twitterSearchTool,
    [Action.TWITTER_SEARCH_ALL]: twitterSearchAllTool,
    [Action.TWITTER_HOME_TIMELINE]: twitterHomeTimelineTool,
    [Action.TWITTER_USER_TIMELINE]: twitterUserTimelineTool,
    [Action.TWITTER_USER_MENTION_TIMELINE]: twitterUserMentionTimelineTool,
    [Action.TWITTER_CREATE_TWEET]: twitterCreateTweetTool,
    [Action.TWITTER_REPLY_TWEET]: twitterReplyTweetTool,
    [Action.TWITTER_DELETE_TWEET]: twitterDeleteTweetTool,
    [Action.TWITTER_LIKE_TWEET]: twitterLikeTweetTool,
    [Action.TWITTER_UNLIKE_TWEET]: twitterUnlikeTweetTool,
    [Action.TWITTER_RETWEET]: twitterRetweetTool,
    [Action.TWITTER_UNRETWEET]: twitterUnretweetTool,
    [Action.TWITTER_TWEET_COUNT_RECENT]: twitterTweetCountRecentTool,
    [Action.TWITTER_TWEET_COUNT_ALL]: twitterTweetCountAllTool,
    [Action.TWITTER_SINGLE_TWEET]: twitterSingleTweetTool,
    [Action.TWITTER_GET_USER]: twitterGetUserTool,
    [Action.TWITTER_GET_USER_BY_USERNAME]: twitterGetUserByUsernameTool,
    [Action.TWITTER_GET_USERS]: twitterGetUsersTool,
    [Action.TWITTER_GET_USERS_BY_USERNAMES]: twitterGetUsersByUsernamesTool,
    [Action.TWITTER_TWEET_LIKED_BY]: twitterTweetLikedByTool,
    [Action.TWITTER_TWEET_RETWEETED_BY]: twitterTweetRetweetedByTool,
    [Action.TWITTER_CREATE_TWEET_THREAD]: twitterCreateTweetThreadTool,
    [Action.TWITTER_BOOKMARK_TWEET]: twitterBookmarkTweetTool,
    [Action.TWITTER_REMOVE_BOOKMARK]: twitterRemoveBookmarkTool,
    [Action.TWITTER_CREATE_LIST]: twitterCreateListTool,
    [Action.TWITTER_UPDATE_LIST]: twitterUpdateListTool,
    [Action.TWITTER_DELETE_LIST]: twitterDeleteListTool,
    [Action.TWITTER_GET_SPACE]: twitterGetSpaceTool,
    [Action.TWITTER_GET_SPACES]: twitterGetSpacesTool,
    [Action.TWITTER_LIST_DM_EVENTS]: twitterListDmEventsTool,
    [Action.TWITTER_LIST_DM_EVENTS_WITH_PARTICIPANT]: twitterListDmEventsWithParticipantTool,
    [Action.TWITTER_LIST_DM_EVENTS_OF_CONVERSATION]: twitterListDmEventsOfConversationTool,
    [Action.TWITTER_SEND_DM_TO_PARTICIPANT]: twitterSendDmToParticipantTool,
    [Action.TWITTER_SEND_DM_IN_CONVERSATION]: twitterSendDmInConversationTool,
    [Action.TWITTER_GET_COMPLIANCE_JOB]: twitterGetComplianceJobTool,
    [Action.TWITTER_SEARCH_COMPLIANCE_JOBS]: twitterSearchComplianceJobsTool,
    [Action.TWITTER_CREATE_COMPLIANCE_JOB]: twitterCreateComplianceJobTool,
    [Action.TWITTER_GET_COMPLIANCE_JOB_RESULT]: twitterGetComplianceJobResultTool,

    [Action.EARN_ACTIVITY_FEED]: earnActivityFeedTool,
    [Action.EARN_FETCH_FEED]: earnFetchFeedTool,
    [Action.EARN_FETCH_GRANT_DETAILS]: earnFetchGrantDetailsTool,
    [Action.EARN_FETCH_EXCLUSIVE_SPONSOR_GRANTS]: earnFetchExclusiveSponsorGrantsTool,
    [Action.EARN_FETCH_USER_POWS]: earnFetchUserPoWsTool,
    [Action.EARN_BOUNTY_LISTINGS]: earnBountyListingsTool,
    [Action.EARN_GRANT_LISTINGS]: earnGrantsListingsTool,
    [Action.EARN_SEARCH_USERS]: earnSearchUsersTool,
    [Action.EARN_SUBMISSION_DETAILS]: earnSubmissionDetailsTool,
    [Action.EARN_TOTAL_USER_COUNT]: earnTotalUserCountTool,
    [Action.EARN_FETCH_USER_PUBLIC_STATS]: earnFetchUserPublicStatsTool,

    [Action.REDDIT_FILTER]: redditFilterTool,
}


