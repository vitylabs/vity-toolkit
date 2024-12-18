import { earnActivityFeedTool } from "./actions/activity-feed"
import { earnFetchGrantDetailsTool } from "./actions/fetch-grant-details"
import { earnFetchExclusiveSponsorGrantsTool } from "./actions/fetch-exclusive-sponsor-grants"
import { earnFetchUserPoWsTool } from "./actions/fetch-user-pow"
import { earnBountyListingsTool } from "./actions/bounty-listings"
import { earnGrantsListingsTool } from "./actions/grants-listings"
import { earnSearchUsersTool } from "./actions/search-users"
import { earnSubmissionDetailsTool } from "./actions/submission-details"
import { earnTotalUserCountTool } from "./actions/total-user-count"
import { earnFetchUserPublicStatsTool } from "./actions/user-public-stats"
import { earnFetchFeedTool } from "./actions/feed"


export class EarnTool {

    constructor() {
    }

    getTools() {
        return [
            earnActivityFeedTool,
            earnFetchGrantDetailsTool,
            earnFetchExclusiveSponsorGrantsTool,
            earnFetchUserPoWsTool,
            earnBountyListingsTool,
            earnGrantsListingsTool,
            earnSearchUsersTool,
            earnSubmissionDetailsTool,
            earnTotalUserCountTool,
            earnFetchUserPublicStatsTool,
            earnFetchFeedTool
        ]
    }

}


