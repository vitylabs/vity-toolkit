import { earnActivityFeedTool } from "./actions/activity-feed"
import { earnFetchFeedItemTool } from "./actions/fetch-feed-item"
import { earnFetchGrantDetailsTool } from "./actions/fetch-grant-details"
import { earnFetchSponsorGrantsTool } from "./actions/fetch-sponsor-grants"
import { earnFetchUserPoWsTool } from "./actions/fetch-user-pow"
import { earnHomepageBountyListingsTool } from "./actions/homepage-bounty-listings"
import { earnListHomepageGrantsTool } from "./actions/list-homopage-grants"
import { earnSearchUsersTool } from "./actions/search-users"
import { earnSubmissionDetailsTool } from "./actions/submission-details"
import { earnTotalUserCountTool } from "./actions/total-user-count"
import { earnUserInfoTool } from "./actions/user-info"
import { earnFetchUserPublicStatsTool } from "./actions/user-public-stats"


export class EarnTool {

    constructor() {
    }

    getTools() {
        return [
            earnActivityFeedTool,
            earnFetchFeedItemTool,
            earnFetchGrantDetailsTool,
            earnFetchSponsorGrantsTool,
            earnFetchUserPoWsTool,
            earnHomepageBountyListingsTool,
            earnListHomepageGrantsTool,
            earnSearchUsersTool,
            earnSubmissionDetailsTool,
            earnTotalUserCountTool,
            earnUserInfoTool,
            earnFetchUserPublicStatsTool
        ]
    }

}


