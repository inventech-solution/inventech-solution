const metrics = {
    spend: function (adsData) {
        let totalSpend = 0;
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);  // Default to 0 if spend is undefined
            }
        });
        return totalSpend;  // Format as currency
    },
    purchase_roas: function (adsData) {
        let totalSpend = 0;
        let totalPurchaseValue = 0;
        let purchaseAction = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);

                totalPurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "purchase")?.value || 0);

            }

        });

        // Prevent division by zero
        return totalSpend > 0 ? (totalPurchaseValue / totalSpend).toFixed(2) : '0.00';
    },
    cpm: function (adsData) {
        let totalSpend = 0;
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Ensure it's a number
            }
        });

        // Calculate CPM
        return totalImpressions > 0 ? ((totalSpend / totalImpressions) * 1000).toFixed(2) : '0.00';
    },
    cpcall: function (adsData) {
        let totalSpend = 0;
        let totalClicks = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);

                totalClicks += parseInt(ad.insights[0]?.clicks || 0);

            }

        });

        // Prevent division by zero
        return totalSpend > 0 ? (totalSpend / totalClicks).toFixed(2) : '0.00';
    },
    aov: function (adsData) {
        let totalPurchaseValue = 0;
        let totalPurchaseCount = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add purchase value to total
                totalPurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "purchase")?.value || 0);

                // Count the purchases (each action of type "purchase" increments the count)
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "purchase")?.value || 0);
            }
        });

        // Calculate AOV
        return totalPurchaseCount > 0 ? (totalPurchaseValue / totalPurchaseCount).toFixed(2) : '0.00'; // Prevent division by zero
    },
    purchase: function (adsData) {
        let totalPurchaseCount = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total purchases (each action of type "purchase" increments the count)
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "purchase")?.value || 0);
            }
        });

        return totalPurchaseCount;  // Return the total number of purchases
    },
    ffr: function (adsData) {
        let totalVideoPlayActions = 0;
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up video play actions
                totalVideoPlayActions += parseInt(ad.insights[0]?.video_play_actions?.[0]?.value || 0);

                // Sum up impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Default to 0 if impressions are undefined
            }
        });

        // Calculate First Frame Retention
        return totalImpressions > 0 ? ((totalVideoPlayActions / totalImpressions) * 100).toFixed(2) : '0.00';  // Prevent division by zero
    },
    tsr: function (adsData) {
        let totalVideoViews3S = 0;
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up video views for at least 3 seconds (VIDEO VIEWS 3S)
                totalVideoViews3S += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0);

                // Sum up impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Default to 0 if impressions are undefined
            }
        });

        // Calculate Thumbstop Ratio
        return totalImpressions > 0 ? ((totalVideoViews3S / totalImpressions) * 100).toFixed(2) : '0.00';  // Prevent division by zero
    },
    outbound_clicks: function (adsData) {
        let totalOutboundClicks = 0;
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up outbound clicks (clicks that take users off Meta properties)
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0);

                // Sum up impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Default to 0 if impressions are undefined
            }
        });

        // Calculate CTR Outbound
        return totalImpressions > 0 ? ((totalOutboundClicks / totalImpressions) * 100).toFixed(2) : '0.00';  // Prevent division by zero
    },
    ctr: function (adsData) {
        let totalClicks = 0;
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up all clicks (not limited to outbound clicks)
                totalClicks += parseInt(ad.insights[0]?.clicks || 0);

                // Sum up impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Default to 0 if impressions is undefined
            }
        });

        // Calculate CTR (All)
        return totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';  // Prevent division by zero
    },
    hr: function (adsData) {
        let totalThruPlay = 0;
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up THRUPLAY (videos played for at least 15 seconds) 
                totalThruPlay += parseInt(ad.insights[0]?.video_thruplay_watched_actions?.[0]?.value || 0);

                // Sum up impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Default to 0 if impressions are undefined
            }
        });

        // Calculate Hold Rate
        return totalImpressions > 0 ? ((totalThruPlay / totalImpressions) * 100).toFixed(2) : '0.00';  // Prevent division by zero
    },
    aov_website: function (adsData) {
        let totalPurchaseValue = 0;
        let totalPurchaseCount = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add purchase value to total
                totalPurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);

                // Count the purchases (each action of type "purchase" increments the count)
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
            }
        });


        // Calculate AOV
        return totalPurchaseCount > 0 ? (totalPurchaseValue / totalPurchaseCount).toFixed(2) : '0.00'; // Prevent division by zero
    },
    impressions: function (adsData) {
        let totalImpressions = 0;

        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up impressions for each ad
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Default to 0 if impressions are undefined
            }
        });

        return totalImpressions;  // Add thousand separator for formatting
    },
    w_purchase_roas: function (adsData) {
        let totalPurchaseValue = 0;
        let totalPurchaseCount = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add purchase value to total
                totalPurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
    
                // Count the purchases (each action of type "purchase" increments the count)
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
            }
        });
    
        // Calculate AOV
        return totalPurchaseCount > 0 ? (totalPurchaseValue / totalPurchaseCount).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clicktopur: function (adsData) {
        let totalPurchaseCount = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the purchases
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
    
                // Count the link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0);  // Link clicks can be accessed via 'clicks'
            }
        });
    
        // Calculate the Click to Website Purchase Ratio
        return totalLinkClicks > 0 ? ((totalPurchaseCount / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clicktowebpur: function (adsData) {
        let totalPurchaseCount = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the purchases
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "purchase")?.value || 0);
    
                // Count the link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.clicks || 0);  // Link clicks can be accessed via 'clicks'
            }
        });
    
        // Calculate the Click to Website Purchase Ratio
        return totalLinkClicks > 0 ? ((totalPurchaseCount / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    purpermile: function (adsData) {
        let totalPurchaseCount = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total purchases
                totalPurchaseCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "purchase")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Purchases per 1,000 Impressions
        return totalImpressions > 0 ? ((totalPurchaseCount / totalImpressions) * 1000).toFixed(2) : '0.00'; // Prevent division by zero
    },
    revpermile: function (adsData) {
        let totalPurchaseValue = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add purchase value to total
                totalPurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "purchase")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Revenue per 1,000 Impressions
        return totalImpressions > 0 ? ((totalPurchaseValue / totalImpressions) * 1000).toFixed(2) : '0.00'; // Prevent division by zero
    },
    installpermile: function (adsData) {
        let totalAppInstalls = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total app installs
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_install")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Install per Mille
        return totalImpressions > 0 ? ((totalAppInstalls / totalImpressions) * 1000).toFixed(2) : '0.00'; // Prevent division by zero
    },
    imprtolead: function (adsData) {
        let totalLeads = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total leads
                totalLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "lead")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Impressions to Leads Ratio
        return totalImpressions > 0 ? ((totalLeads / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clicks_all: function (adsData) {
        let totalClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add up all types of clicks (link clicks and other types)
                totalClicks += parseInt(ad.insights[0]?.clicks || 0); // Includes all clicks
            }
        });
    
        return totalClicks.toLocaleString(); // Format the total clicks with thousand separators
    },
    link_click: function (adsData) {
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add the link clicks (on Meta or off Meta properties)
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0);
            }
        });
    
        return totalLinkClicks.toLocaleString(); // Format the total link clicks with thousand separators
    },
    cpclink: function (adsData) {
        let totalSpend = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Add link clicks for each ad
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0);
            }
        });
    
        // Calculate Cost per Link Click
        return totalLinkClicks > 0 ? (totalSpend / totalLinkClicks).toFixed(2) : '0.00'; // Prevent division by zero
    },
    click_outbound: function (adsData) {
        let totalOutboundClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add up all outbound clicks
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0);  // Get outbound clicks data
            }
        });
    
        return totalOutboundClicks.toLocaleString();  // Format the total outbound clicks with thousand separators
    },
    cpc_outbound: function (adsData) {
        let totalSpend = 0;
        let totalOutboundClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Add outbound clicks for each ad
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0); // Outbound clicks
            }
        });
    
        // Calculate Cost per Outbound Click
        return totalOutboundClicks > 0 ? (totalSpend / totalOutboundClicks).toFixed(2) : '0.00'; // Prevent division by zero
    },
    page_likes: function (adsData) {
        let totalPageLikes = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of page likes attributed to the ad
                totalPageLikes += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "like")?.value || 0);
            }
        });
    
        return totalPageLikes.toLocaleString();  // Format the total Page Likes with thousand separators
    },
    likerate: function (adsData) {
        let totalLikes = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total likes
                totalLikes += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "like")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Like Rate (%)
        return totalImpressions > 0 ? ((totalLikes / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    likeratepermile: function (adsData) {
        let totalLikes = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total likes
                totalLikes += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "like")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Like Rate per 1,000 Impressions
        return totalImpressions > 0 ? ((totalLikes / (totalImpressions / 1000)) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    cppagelike: function (adsData) {
        let totalSpend = 0;
        let totalPageLikes = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Add page likes for each ad
                totalPageLikes += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "like")?.value || 0); // Page likes
            }
        });
    
        // Calculate Cost per Page Like
        return totalPageLikes > 0 ? (totalSpend / totalPageLikes).toFixed(2) : '0.00'; // Prevent division by zero
    },
    comments: function (adsData) {
        let totalComments = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of comments attributed to the ad
                totalComments += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "comment")?.value || 0);
            }
        });
    
        return totalComments.toLocaleString();  // Format the total Comments with thousand separators
    },
    commentrate: function (adsData) {
        let totalComments = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total comments
                totalComments += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "comment")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Comment Rate (%)
        return totalImpressions > 0 ? ((totalComments / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    commentpermile: function (adsData) {
        let totalComments = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total comments
                totalComments += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "comment")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Comment Rate per 1,000 Impressions
        return totalImpressions > 0 ? ((totalComments / (totalImpressions / 1000)) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    postshares: function (adsData) {
        let totalPostShares = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of post shares attributed to the ad
                totalPostShares += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post")?.value || 0);
            }
        });
    
        return totalPostShares.toLocaleString();  // Format the total Post Shares with thousand separators
    },
    psr: function (adsData) {
        let totalShares = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of shares
                totalShares += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post")?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Post Share Ratio (PSR)
        return totalImpressions > 0 ? ((totalShares / totalImpressions) * 1000).toFixed(2) : '0.00'; // Prevent division by zero
    },
    reactions: function (adsData) {
        let totalPostReactions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of post reactions attributed to the ad
                totalPostReactions += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post_reaction")?.value || 0);
            }
        });
    
        return totalPostReactions.toLocaleString();  // Format the total Post Reactions with thousand separators
    },
    saves: function (adsData) {
        let totalPostSaves = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of post saves attributed to the ad
                totalPostSaves += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "onsite_conversion.post_save")?.value || 0);
            }
        });
    
        return totalPostSaves.toLocaleString();  // Format the total Post Saves with thousand separators
    },
    engagement: function (adsData) {
        let totalPostEngagement = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of post engagements attributed to the ad
                totalPostEngagement += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post_engagement")?.value || 0);
            }
        });
    
        return totalPostEngagement.toLocaleString();  // Format the total Post Engagement with thousand separators
    },
    engagement_rate: function (adsData) {
        let totalPostEngagement = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Count the total post engagements
                totalPostEngagement += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post_engagement")?.value || 0);
    
                // Count the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Engagement Rate (%)
        return totalImpressions > 0 ? ((totalPostEngagement / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    cpengagement: function (adsData) {
        let totalSpend = 0;
        let totalPostEngagement = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Add spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Add post engagements (likes, comments, shares, etc.) for each ad
                totalPostEngagement += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post_engagement")?.value || 0); // Post engagements
            }
        });
    
        // Calculate Cost per Engagement
        return totalPostEngagement > 0 ? (totalSpend / totalPostEngagement).toFixed(2) : '0.00'; // Prevent division by zero
    },
    smr: function (adsData) {
        let totalClicksAll = 0;
        let totalLinkClicks = 0;
        let totalPostReactions = 0;
        let totalPostComments = 0;
        let totalPostShares = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total clicks (all clicks including link clicks, reactions, etc.)
                totalClicksAll += parseInt(ad.insights[0]?.clicks || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.link_click || 0); // Assume link clicks are part of `clicks`
    
                // Sum up the total post reactions
                totalPostReactions += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post_reaction")?.value || 0);
    
                // Sum up the total post comments
                totalPostComments += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "comment")?.value || 0);
    
                // Sum up the total post shares
                totalPostShares += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "post")?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate the See More Rate
        const seeMoreClicks = totalClicksAll - totalLinkClicks - totalPostReactions - totalPostComments - totalPostShares;
        return totalImpressions > 0 ? ((seeMoreClicks / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    estCallConfClicks: function (adsData) {
        let totalCallConfirmationClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of call confirmation clicks attributed to the ad
                totalCallConfirmationClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "click_to_call_call_confirm")?.value || 0);
            }
        });
    
        return totalCallConfirmationClicks.toLocaleString();  // Format the total Estimated Call Confirmation Clicks with thousand separators
    },
    videoAvgPlayTime: function (adsData) {
        let totalWatchTime = 0;
        let totalCount = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total watch time from video_avg_time_watched_actions
                const watchTime = parseInt(ad.insights[0]?.video_avg_time_watched_actions?.[0]?.value || 0);
                if (watchTime > 0) {
                    totalWatchTime += watchTime;
                    totalCount++;
                }
            }
        });
    
        // Calculate the mean (average) of the watch times
        return totalCount > 0 ? (totalWatchTime / totalCount).toFixed(0) : 'Null'; // Prevent division by zero
    },
    thruplay: function (adsData) {
        let totalThruplays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total thruplay counts
                totalThruplays += parseInt(ad.insights[0]?.video_thruplay_watched_actions?.[0]?.value || 0);
            }
        });
    
        return totalThruplays.toLocaleString();  // Format the total thruplays with thousand separators
    },
    holdRate: function (adsData) {
        let totalThruplays = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total thruplays (videos played for at least 15 seconds)
                totalThruplays += parseInt(ad.insights[0]?.video_thruplay_watched_actions?.[0]?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Hold Rate (%)
        return totalImpressions > 0 ? ((totalThruplays / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    fifteenSecThreeSecVideoRetention: function (adsData) {
        let totalThruplays = 0;
        let totalThreeSecondViews = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total thruplays (videos watched for at least 15 seconds)
                totalThruplays += parseInt(ad.insights[0]?.video_thruplay_watched_actions?.[0]?.value || 0);
    
                // Sum up the total 3-second views (videos viewed for at least 3 seconds)
                totalThreeSecondViews += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0); // Assuming `video_views_3s` contains the number of 3-second views
            }
        });
    
        // Calculate 15s/3s Video Retention (%)
        return totalThreeSecondViews > 0 ? ((totalThruplays / totalThreeSecondViews) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    thruplayCTR: function (adsData) {
        let totalOutboundClicks = 0;
        let totalThruplays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total outbound clicks (clicks that take users off Meta properties)
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0);
    
                // Sum up the total thruplays (videos watched for at least 15 seconds)
                totalThruplays += parseInt(ad.insights[0]?.video_thruplay_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate Thruplay Click-Through Rate (CTR)
        return totalThruplays > 0 ? ((totalOutboundClicks / totalThruplays) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    hundredPercentThreeSecVideoRetention: function (adsData) {
        let totalCompleteViews = 0;
        let totalThreeSecondViews = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of 100% video plays (video watched to completion)
                totalCompleteViews += parseInt(ad.insights[0]?.video_p100_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of 3-second video views
                totalThreeSecondViews += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0);  // Assuming video_plays contains the number of 3-second views
            }
        });
    
        // Calculate 100%/3s Video Retention (%)
        return totalThreeSecondViews > 0 ? ((totalCompleteViews / totalThreeSecondViews) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    costPerVideoThruplay: function (adsData) {
        let totalSpend = 0;
        let totalThruplays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of video thruplays (videos played for at least 15 seconds)
                totalThruplays += parseInt(ad.insights[0]?.video_thruplay_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the Cost per Video Thruplay
        return totalThruplays > 0 ? (totalSpend / totalThruplays).toFixed(2) : '0.00'; // Prevent division by zero
    },
    thumbstopRatio: function (adsData) {
        let totalVideoViews3S = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total video views for at least 3 seconds
                totalVideoViews3S += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate Thumbstop Ratio (%)
        return totalImpressions > 0 ? ((totalVideoViews3S / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    firstFrameRetention: function (adsData) {
        let totalVideoPlayActions = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of video play actions (users who watched the video)
                totalVideoPlayActions += parseInt(ad.insights[0]?.video_play_actions?.[0]?.value || 0);
    
                // Sum up the total impressions (how many times the ad was shown)
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate First Frame Retention (%)
        return totalImpressions > 0 ? ((totalVideoPlayActions / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    thumbstopClickRate: function (adsData) {
        let totalLinkClicks = 0;
        let totalVideoViews3S = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total link clicks (clicks on links after watching the video)
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
    
                // Sum up the total video views for at least 3 seconds
                totalVideoViews3S += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0); // Assuming `video_plays_3s` contains the number of 3-second views
            }
        });
    
        // Calculate Thumbstop Click Rate (%)
        return totalVideoViews3S > 0 ? ((totalLinkClicks / totalVideoViews3S) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    threeSecVideoPlays: function (adsData) {
        let totalThreeSecondPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of 3-second video plays
                totalThreeSecondPlays += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0); // Assuming `video_plays_3s` contains the number of 3-second views
            }
        });
    
        return totalThreeSecondPlays.toLocaleString();  // Format the total 3-second video plays with thousand separators
    },
    costPerThreeSecPlays: function (adsData) {
        let totalSpend = 0;
        let totalThreeSecondPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of 3-second video plays
                totalThreeSecondPlays += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "video_view")?.value || 0);
            }
        });
    
        // Calculate the Cost per 3-Second Play
        return totalThreeSecondPlays > 0 ? (totalSpend / totalThreeSecondPlays).toFixed(2) : '0.00'; // Prevent division by zero
    },
    costPerMinuteViewed: function (adsData) {
        let totalSpend = 0;
        let totalVideoAvgPlayTime = 0;
        let totalVideoPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total spend for each ad
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total video average play time
                totalVideoAvgPlayTime += parseFloat(ad.insights[0]?.video_avg_time_watched_actions?.[0]?.value || 0);
    
                // Sum up the total video plays
                totalVideoPlays += parseInt(ad.insights[0]?.video_plays_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the total minutes viewed
        const totalMinutesViewed = (totalVideoAvgPlayTime * totalVideoPlays) / 60;
    
        // Calculate Cost per Minute Viewed
        return totalMinutesViewed > 0 ? (totalSpend / totalMinutesViewed).toFixed(2) : '0.00'; // Prevent division by zero
    },
    twentyFivePercentVideoPlays: function (adsData) {
        let totalTwentyFivePercentPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 25% point of the video was played
                totalTwentyFivePercentPlays += parseInt(ad.insights[0]?.video_p25_watched_actions?.[0]?.value || 0); // Assuming `video_plays_25` contains the number of times 25% of the video was played
            }
        });
    
        return totalTwentyFivePercentPlays.toLocaleString();  // Format the total 25% video plays with thousand separators
    },
    fiftyPercentVideoPlays: function (adsData) {
        let totalFiftyPercentPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 50% point of the video was played
                totalFiftyPercentPlays += parseInt(ad.insights[0]?.video_p50_watched_actions?.[0]?.value || 0); // Assuming `video_p50_watched_actions` contains the number of times 50% of the video was played
            }
        });
    
        return totalFiftyPercentPlays.toLocaleString();  // Format the total 50% video plays with thousand separators
    },
    seventyFivePercentVideoPlays: function (adsData) {
        let totalSeventyFivePercentPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 75% point of the video was played
                totalSeventyFivePercentPlays += parseInt(ad.insights[0]?.video_p75_watched_actions?.[0]?.value || 0); // Assuming `video_p75_watched_actions` contains the number of times 75% of the video was played
            }
        });
    
        return totalSeventyFivePercentPlays.toLocaleString();  // Format the total 75% video plays with thousand separators
    },
    ninetyFivePercentVideoPlays: function (adsData) {
        let totalNinetyFivePercentPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 95% point of the video was played
                totalNinetyFivePercentPlays += parseInt(ad.insights[0]?.video_p95_watched_actions?.[0]?.value || 0); // Assuming `video_p95_watched_actions` contains the number of times 95% of the video was played
            }
        });
    
        return totalNinetyFivePercentPlays.toLocaleString();  // Format the total 95% video plays with thousand separators
    },
    hundredPercentVideoPlays: function (adsData) {
        let totalHundredPercentPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 100% point of the video was played
                totalHundredPercentPlays += parseInt(ad.insights[0]?.video_p100_watched_actions?.[0]?.value || 0); // Assuming `video_p100_watched_actions` contains the number of times 100% of the video was played
            }
        });
    
        return totalHundredPercentPlays.toLocaleString();  // Format the total 100% video plays with thousand separators
    },
    twentyFivePercentVideoPlaysRate: function (adsData) {
        let totalVideo25pWatches = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 25% point of the video was watched
                totalVideo25pWatches += parseInt(ad.insights[0]?.video_p25_watched_actions?.[0]?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate 25% Video Plays Rate (%)
        return totalImpressions > 0 ? ((totalVideo25pWatches / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    fiftyPercentVideoPlaysRate: function (adsData) {
        let totalVideo50pWatches = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 50% point of the video was watched
                totalVideo50pWatches += parseInt(ad.insights[0]?.video_p50_watched_actions?.[0]?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate 50% Video Plays Rate (%)
        return totalImpressions > 0 ? ((totalVideo50pWatches / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    seventyFivePercentVideoPlaysRate: function (adsData) {
        let totalVideo75pWatches = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 75% point of the video was watched
                totalVideo75pWatches += parseInt(ad.insights[0]?.video_p75_watched_actions?.[0]?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate 75% Video Plays Rate (%)
        return totalImpressions > 0 ? ((totalVideo75pWatches / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    ninetyFivePercentVideoPlaysRate: function (adsData) {
        let totalVideo95pWatches = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 95% point of the video was watched
                totalVideo95pWatches += parseInt(ad.insights[0]?.video_p95_watched_actions?.[0]?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate 95% Video Plays Rate (%)
        return totalImpressions > 0 ? ((totalVideo95pWatches / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    hundredPercentVideoPlaysRate: function (adsData) {
        let totalVideo100pWatches = 0;
        let totalImpressions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 100% point of the video was watched
                totalVideo100pWatches += parseInt(ad.insights[0]?.video_p100_watched_actions?.[0]?.value || 0);
    
                // Sum up the total impressions
                totalImpressions += parseInt(ad.insights[0]?.impressions || 0);  // Impressions are in ad insights
            }
        });
    
        // Calculate 100% Video Plays Rate (%)
        return totalImpressions > 0 ? ((totalVideo100pWatches / totalImpressions) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    twentyFiveToFiftyPercentVideoDropOffRate: function (adsData) {
        let totalVideo25pWatches = 0;
        let totalVideo50pWatches = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 25% point of the video was watched
                totalVideo25pWatches += parseInt(ad.insights[0]?.video_p25_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of times the 50% point of the video was watched
                totalVideo50pWatches += parseInt(ad.insights[0]?.video_p50_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the 25% to 50% Video Plays Drop-Off Rate (%)
        return totalVideo25pWatches > 0 ? (((totalVideo25pWatches - totalVideo50pWatches) / totalVideo25pWatches) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    fiftyToSeventyFivePercentVideoDropOffRate: function (adsData) {
        let totalVideo50pWatches = 0;
        let totalVideo75pWatches = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 50% point of the video was watched
                totalVideo50pWatches += parseInt(ad.insights[0]?.video_p50_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of times the 75% point of the video was watched
                totalVideo75pWatches += parseInt(ad.insights[0]?.video_p75_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the 50% to 75% Video Plays Drop-Off Rate (%)
        return totalVideo50pWatches > 0 ? (((totalVideo50pWatches - totalVideo75pWatches) / totalVideo50pWatches) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    seventyFiveToNinetyFivePercentVideoDropOffRate: function (adsData) {
        let totalVideo75pWatches = 0;
        let totalVideo95pWatches = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 75% point of the video was watched
                totalVideo75pWatches += parseInt(ad.insights[0]?.video_p75_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of times the 95% point of the video was watched
                totalVideo95pWatches += parseInt(ad.insights[0]?.video_p95_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the 75% to 95% Video Plays Drop-Off Rate (%)
        return totalVideo75pWatches > 0 ? (((totalVideo75pWatches - totalVideo95pWatches) / totalVideo75pWatches) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    seventyFiveToHundredPercentVideoDropOffRate: function (adsData) {
        let totalVideo75pWatches = 0;
        let totalVideo100pWatches = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 75% point of the video was watched
                totalVideo75pWatches += parseInt(ad.insights[0]?.video_p75_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of times the 100% point of the video was watched
                totalVideo100pWatches += parseInt(ad.insights[0]?.video_p100_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the 75% to 100% Video Plays Drop-Off Rate (%)
        return totalVideo75pWatches > 0 ? (((totalVideo75pWatches - totalVideo100pWatches) / totalVideo75pWatches) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    ninetyFiveToHundredPercentVideoDropOffRate: function (adsData) {
        let totalVideo95pWatches = 0;
        let totalVideo100pWatches = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 95% point of the video was watched
                totalVideo95pWatches += parseInt(ad.insights[0]?.video_p95_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of times the 100% point of the video was watched
                totalVideo100pWatches += parseInt(ad.insights[0]?.video_p100_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the 95% to 100% Video Plays Drop-Off Rate (%)
        return totalVideo95pWatches > 0 ? (((totalVideo95pWatches - totalVideo100pWatches) / totalVideo95pWatches) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    sustainRate: function (adsData) {
        let totalVideo25pWatches = 0;
        let totalVideo95pWatches = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the 25% point of the video was watched
                totalVideo25pWatches += parseInt(ad.insights[0]?.video_p25_watched_actions?.[0]?.value || 0);
    
                // Sum up the total number of times the 95% point of the video was watched
                totalVideo95pWatches += parseInt(ad.insights[0]?.video_p95_watched_actions?.[0]?.value || 0);
            }
        });
    
        // Calculate the Sustain Rate (%)
        return totalVideo25pWatches > 0 ? ((1 - ((totalVideo25pWatches - totalVideo95pWatches) / totalVideo25pWatches)) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    videoPlays: function (adsData) {
        let totalVideoPlays = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of video plays
                totalVideoPlays += parseInt(ad.insights[0]?.video_plays_actions?.[0]?.value || 0);  // Assuming video_plays contains the number of video plays
            }
        });
    
        return totalVideoPlays.toLocaleString();  // Format the total video plays with thousand separators for readability  
    },
    metaLeads: function (adsData) {
        let totalMetaLeads = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of on-Facebook leads
                totalMetaLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "onsite_conversion.lead_grouped")?.value || 0); // Assuming `lead_grouped` contains the number of on-Facebook leads
            }
        });
    
        return totalMetaLeads.toLocaleString();  // Format the total Meta Leads with thousand separators for readability
    },
    clicksToLPV: function (adsData) {
        let totalLandingPageViews = 0;
        let totalOutboundClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total landing page views
                totalLandingPageViews += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "landing_page_view")?.value || 0); // Assuming `landing_page_views` contains the number of landing page views
    
                // Sum up the total outbound clicks
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0); // Assuming `outbound_clicks` contains the number of outbound clicks
            }
        });
    
        // Calculate Clicks to LPV (%)
        return totalOutboundClicks > 0 ? ((totalLandingPageViews / totalOutboundClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToAddToCartRatio: function (adsData) {
        let totalAddToCarts = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of add-to-cart actions
                totalAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "add_to_cart")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Clicks to Add-to-Cart Ratio (%)
        return totalLinkClicks > 0 ? ((totalAddToCarts / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    addToCartToPurchaseRatio: function (adsData) {
        let totalPurchases = 0;
        let totalAddToCarts = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of purchases
                totalPurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "purchase")?.value || 0);
    
                // Sum up the total number of add-to-cart actions
                totalAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "add_to_cart")?.value || 0);
            }
        });
    
        // Calculate Add-to-Cart to Purchase Ratio (%)
        return totalAddToCarts > 0 ? ((totalPurchases / totalAddToCarts) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToAppInstallRatio: function (adsData) {
        let totalAppInstalls = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of app installs
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_install")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to App Install Ratio (%)
        return totalLinkClicks > 0 ? ((totalAppInstalls / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToLeadsRatio: function (adsData) {
        let totalLeads = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of leads
                totalLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "lead")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to Leads Ratio (%)
        return totalLinkClicks > 0 ? ((totalLeads / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    avgLeadsValue: function (adsData) {
        let totalLeadsValue = 0;
        let totalLeads = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value generated from leads
                totalLeadsValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "lead")?.value || 0);
    
                // Sum up the total number of leads
                totalLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "lead")?.value || 0);
            }
        });
    
        // Calculate the Average Leads Value
        return totalLeads > 0 ? (totalLeadsValue / totalLeads).toFixed(2) : '0.00'; // Prevent division by zero
    },
    leadsROAS: function (adsData) {
        let totalLeadsValue = 0;
        let totalSpend = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value generated from leads
                totalLeadsValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "lead")?.value || 0);
    
                // Sum up the total spend
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
            }
        });
    
        // Calculate the Leads ROAS
        return totalSpend > 0 ? (totalLeadsValue / totalSpend).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToSubscriptionsRatio: function (adsData) {
        let totalSubscriptions = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of subscriptions
                totalSubscriptions += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "subscribe_total")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to Subscriptions Ratio (%)
        return totalLinkClicks > 0 ? ((totalSubscriptions / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToRegistrationsCompletedRatio: function (adsData) {
        let totalCompleteRegistrations = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of complete registrations
                totalCompleteRegistrations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_complete_registration")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to Registrations Completed Ratio (%)
        return totalLinkClicks > 0 ? ((totalCompleteRegistrations / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToTrialStartedRatio: function (adsData) {
        let totalTrialsStarted = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of trials started
                totalTrialsStarted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_total")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to Trial Started Ratio (%)
        return totalLinkClicks > 0 ? ((totalTrialsStarted / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    leadsToSubscriptionsRatio: function (adsData) {
        let totalSubscriptions = 0;
        let totalLeads = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of subscriptions
                totalSubscriptions += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "subscribe_total")?.value || 0);
    
                // Sum up the total number of leads
                totalLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "lead")?.value || 0);
            }
        });
    
        // Calculate Leads to Subscriptions Ratio (%)
        return totalLeads > 0 ? ((totalSubscriptions / totalLeads) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToContactRatio: function (adsData) {
        let totalContacts = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of contacts
                totalContacts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "contact_total")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to Contact Ratio (%)
        return totalLinkClicks > 0 ? ((totalContacts / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToFindLocationRatio: function (adsData) {
        let totalFindLocations = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of find location actions
                totalFindLocations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "find_location")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Link Click to Find Location Ratio (%)
        return totalLinkClicks > 0 ? ((totalFindLocations / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToAppointmentsScheduled: function (adsData) {
        let totalAppointmentsScheduled = 0;
        let totalOutboundClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of scheduled appointments
                totalAppointmentsScheduled += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "appointment_scheduled")?.value || 0);
    
                // Sum up the total number of outbound clicks
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0); // Assuming `outbound_clicks` contains the number of outbound clicks
            }
        });
    
        // Calculate Click to Appointments Scheduled Ratio (%)
        return totalOutboundClicks > 0 ? ((totalAppointmentsScheduled / totalOutboundClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clicksToInitiateCheckoutRatio: function (adsData) {
        let totalInitiateCheckout = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of initiate checkout actions
                totalInitiateCheckout += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_initiate_checkout")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Clicks to Initiate Checkout Ratio (%)
        return totalLinkClicks > 0 ? ((totalInitiateCheckout / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    installToTrialRate: function (adsData) {
        let totalTrialsStarted = 0;
        let totalAppInstalls = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of trials started
                totalTrialsStarted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_total")?.value || 0);
    
                // Sum up the total number of app installs
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_install")?.value || 0);
            }
        });
    
        // Calculate Install to Trial Rate (%)
        return totalAppInstalls > 0 ? ((totalTrialsStarted / totalAppInstalls) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    installToPurchaseRate: function (adsData) {
        let totalPurchases = 0;
        let totalAppInstalls = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of purchases
                totalPurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
    
                // Sum up the total number of app installs
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_install")?.value || 0);
            }
        });
    
        // Calculate Install to Purchase Ratio (%)
        return totalAppInstalls > 0 ? ((totalPurchases / totalAppInstalls) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    installToRegistrationRate: function (adsData) {
        let totalRegistrationsCompleted = 0;
        let totalAppInstalls = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of registrations completed
                totalRegistrationsCompleted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_complete_registration")?.value || 0);
    
                // Sum up the total number of app installs
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_install")?.value || 0);
            }
        });
    
        // Calculate Install to Registration Rate (%)
        return totalAppInstalls > 0 ? ((totalRegistrationsCompleted / totalAppInstalls) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    registrationToAchievementUnlockedRate: function (adsData) {
        let totalAchievementsUnlocked = 0;
        let totalRegistrations = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of achievements unlocked
                totalAchievementsUnlocked += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_achievement_unlocked")?.value || 0);
    
                // Sum up the total number of registrations
                totalRegistrations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_complete_registration")?.value || 0);
            }
        });
    
        // Calculate Registration to Achievement Unlocked Rate (%)
        return totalRegistrations > 0 ? ((totalAchievementsUnlocked / totalRegistrations) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    achievementUnlockedToPurchaseRate: function (adsData) {
        let totalPurchases = 0;
        let totalAchievementsUnlocked = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of purchases
                totalPurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
    
                // Sum up the total number of achievements unlocked
                totalAchievementsUnlocked += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_achievement_unlocked")?.value || 0);
            }
        });
    
        // Calculate Achievement Unlocked to Purchase Rate (%)
        return totalAchievementsUnlocked > 0 ? ((totalPurchases / totalAchievementsUnlocked) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    clickToWebsiteAddToCart: function (adsData) {
        let totalWebsiteAddToCarts = 0;
        let totalLinkClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of website add to cart actions
                totalWebsiteAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_cart")?.value || 0);
    
                // Sum up the total link clicks
                totalLinkClicks += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "link_click")?.value || 0); // Assuming clicks are counted here
            }
        });
    
        // Calculate Click to Website Add to Cart Ratio (%)
        return totalLinkClicks > 0 ? ((totalWebsiteAddToCarts / totalLinkClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    addToCartToPurchaseRatioWebsite: function (adsData) {
        let totalWebsitePurchases = 0;
        let totalWebsiteAddToCarts = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of website purchases
                totalWebsitePurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
    
                // Sum up the total number of website add to cart actions
                totalWebsiteAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_cart")?.value || 0);
            }
        });
    
        // Calculate Add to Cart to Purchase Ratio (Website) (%)
        return totalWebsiteAddToCarts > 0 ? ((totalWebsitePurchases / totalWebsiteAddToCarts) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    viewContentRatio: function (adsData) {
        let totalViewContent = 0;
        let totalOutboundClicks = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of view content actions
                totalViewContent += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "view_content")?.value || 0);
    
                // Sum up the total number of outbound clicks
                totalOutboundClicks += parseInt(ad.insights[0]?.outbound_clicks?.[0]?.value || 0); // Assuming outbound_clicks contains the number of outbound clicks
            }
        });
    
        // Calculate View Content Ratio (%)
        return totalOutboundClicks > 0 ? ((totalViewContent / totalOutboundClicks) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    viewContentToAddToCartRatio: function (adsData) {
        let totalAddToCarts = 0;
        let totalViewContent = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of add-to-cart actions
                totalAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_cart")?.value || 0);
    
                // Sum up the total number of view content actions
                totalViewContent += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "view_content")?.value || 0);
            }
        });
    
        // Calculate View Content to Add-to-Cart Ratio (%)
        return totalViewContent > 0 ? ((totalAddToCarts / totalViewContent) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },
    checkoutToPurchaseRatio: function (adsData) {
        let totalPurchases = 0;
        let totalInitiateCheckout = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of purchases
                totalPurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "purchase")?.value || 0);
    
                // Sum up the total number of initiate checkout actions
                totalInitiateCheckout += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_initiate_checkout")?.value || 0);
            }
        });
    
        // Calculate Checkout to Purchase Ratio (%)
        return totalInitiateCheckout > 0 ? ((totalPurchases / totalInitiateCheckout) * 100).toFixed(2) : '0.00'; // Prevent division by zero
    },

    col_landing_page_views: function (adsData) {
        let totalLandingPageViews = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of landing page views
                totalLandingPageViews += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "landing_page_view")?.value || 0);
            }
        });
    
        return totalLandingPageViews.toLocaleString();  // Format the total landing page views with thousand separators
    },
    col_view_content: function (adsData) {
        let totalViewContent = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times the view content event was triggered
                totalViewContent += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_view_content")?.value || 0);
            }
        });
    
        return totalViewContent.toLocaleString();  // Format the total view content with thousand separators
    },
    col_add_to_cart: function (adsData) {
        let totalAddToCart = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times products were added to the cart
                totalAddToCart += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_add_to_cart: Adds to Cart")?.value || 0);
            }
        });
    
        return totalAddToCart.toLocaleString();  // Format the total add to cart value with thousand separators
    },
    col_website_add_to_cart: function (adsData) {
        let totalWebsiteAddToCart = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times products were added to the cart on the website
                totalWebsiteAddToCart += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_cart")?.value || 0);
            }
        });
    
        return totalWebsiteAddToCart.toLocaleString();  // Format the total website add to cart value with thousand separators
    },
    col_add_to_wishlist: function (adsData) {
        let totalAddToWishlist = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times products were added to the wishlist
                totalAddToWishlist += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_wishlist")?.value || 0);
            }
        });
    
        return totalAddToWishlist.toLocaleString();  // Format the total add to wishlist value with thousand separators
    },
    col_initiate_checkout: function (adsData) {
        let totalInitiateCheckout = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of initiate checkout actions
                totalInitiateCheckout += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_initiate_checkout")?.value || 0);
            }
        });
    
        return totalInitiateCheckout.toLocaleString();  // Format the total initiate checkout value with thousand separators
    },
    col_purchase: function (adsData) {
        let totalPurchases = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of purchases attributed to the ad
                totalPurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_purchase")?.value || 0);
            }
        });
    
        return totalPurchases.toLocaleString();  // Format the total purchases with thousand separators
    },
    col_website_purchase: function (adsData) {
        let totalWebsitePurchases = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of website purchases attributed to the ad
                totalWebsitePurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
            }
        });
    
        return totalWebsitePurchases.toLocaleString();  // Format the total website purchases with thousand separators
    },
    col_app_installs: function (adsData) {
        let totalAppInstalls = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of app installs
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_app_install")?.value || 0);
            }
        });
    
        return totalAppInstalls.toLocaleString();  // Format the total app installs with thousand separators
    },
    col_achievements_unlocked: function (adsData) {
        let totalAchievementsUnlocked = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of achievements unlocked
                totalAchievementsUnlocked += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_achievement_unlocked")?.value || 0);
            }
        });
    
        return totalAchievementsUnlocked.toLocaleString();  // Format the total achievements unlocked with thousand separators
    },
    col_levels_achieved: function (adsData) {
        let totalLevelsAchieved = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of levels achieved
                totalLevelsAchieved += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_level_achieved")?.value || 0);
            }
        });
    
        return totalLevelsAchieved.toLocaleString();  // Format the total levels achieved with thousand separators
    },
    col_appointments_scheduled: function (adsData) {
        let totalAppointmentsScheduled = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of appointments scheduled
                totalAppointmentsScheduled += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "schedule_total")?.value || 0);
            }
        });
    
        return totalAppointmentsScheduled.toLocaleString();  // Format the total appointments scheduled with thousand separators
    },
    col_leads: function (adsData) {
        let totalLeads = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of leads (on and off-Facebook leads)
                totalLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "lead")?.value || 0);
            }
        });
    
        return totalLeads.toLocaleString();  // Format the total leads with thousand separators
    },
    col_subscriptions: function (adsData) {
        let totalSubscriptions = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of subscriptions
                totalSubscriptions += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "subscribe_total")?.value || 0);
            }
        });
    
        return totalSubscriptions.toLocaleString();  // Format the total subscriptions with thousand separators
    },
    col_registrations_completed: function (adsData) {
        let totalRegistrationsCompleted = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of completed registrations
                totalRegistrationsCompleted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_complete_registration")?.value || 0);
            }
        });
    
        return totalRegistrationsCompleted.toLocaleString();  // Format the total registrations completed with thousand separators
    },
    col_add_payment_info_mobile: function (adsData) {
        let totalAddPaymentInfoMobile = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times payment info was added on a mobile app
                totalAddPaymentInfoMobile += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_custom_event.fb_mobile_add_payment_info")?.value || 0);
            }
        });
    
        return totalAddPaymentInfoMobile.toLocaleString();  // Format the total add payment info mobile value with thousand separators
    },
    col_add_payment_info_website: function (adsData) {
        let totalAddPaymentInfoWebsite = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times payment info was added on a website
                totalAddPaymentInfoWebsite += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_payment_info")?.value || 0);
            }
        });
    
        return totalAddPaymentInfoWebsite.toLocaleString();  // Format the total add payment info website value with thousand separators
    },
    col_trials_started_total: function (adsData) {
        let totalTrialsStarted = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of trial starts
                totalTrialsStarted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_total")?.value || 0);
            }
        });
    
        return totalTrialsStarted.toLocaleString();  // Format the total trials started with thousand separators
    },
    col_trials_started_mobile: function (adsData) {
        let totalTrialsStartedMobile = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of trial starts on mobile
                totalTrialsStartedMobile += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_mobile_app")?.value || 0);
            }
        });
    
        return totalTrialsStartedMobile.toLocaleString();  // Format the total trials started on mobile with thousand separators
    },
    col_trials_started_website: function (adsData) {
        let totalTrialsStartedWebsite = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of trial starts on the website
                totalTrialsStartedWebsite += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_website")?.value || 0);
            }
        });
    
        return totalTrialsStartedWebsite.toLocaleString();  // Format the total trials started on website with thousand separators
    },
    col_products_customized: function (adsData) {
        let totalProductsCustomized = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of product customizations
                totalProductsCustomized += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "customize_product_total")?.value || 0);
            }
        });
    
        return totalProductsCustomized.toLocaleString();  // Format the total products customized with thousand separators
    },
    col_submit_application: function (adsData) {
        let totalApplicationsSubmitted = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of application submissions
                totalApplicationsSubmitted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "submit_application_total")?.value || 0);
            }
        });
    
        return totalApplicationsSubmitted.toLocaleString();  // Format the total applications submitted with thousand separators
    },
    col_contacts: function (adsData) {
        let totalContacts = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of contacts
                totalContacts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "contact_total")?.value || 0);
            }
        });
    
        return totalContacts.toLocaleString();  // Format the total contacts with thousand separators
    },
    col_find_location: function (adsData) {
        let totalFindLocations = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of times a find location event was triggered
                totalFindLocations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "find_location_total")?.value || 0);
            }
        });
    
        return totalFindLocations.toLocaleString();  // Format the total find location value with thousand separators
    },
    col_search: function (adsData) {
        let totalSearchEvents = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of search events triggered
                totalSearchEvents += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_search")?.value || 0);
            }
        });
    
        return totalSearchEvents.toLocaleString();  // Format the total search events with thousand separators
    },
    col_donations: function (adsData) {
        let totalDonations = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total number of donate events
                totalDonations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "donate_total")?.value || 0);
            }
        });
    
        return totalDonations.toLocaleString();  // Format the total donations with thousand separators
    },
    
    v_view_content_value: function (adsData) {
        let totalViewContentValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value earned from users who triggered a view content event
                totalViewContentValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_view_content")?.value || 0);
            }
        });
    
        return totalViewContentValue.toFixed(2);  // Return the total value rounded to two decimal places
    },
    v_add_to_cart_value: function (adsData) {
        let totalAddToCartValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of all products added to the cart
                totalAddToCartValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "omni_add_to_cart: Adds to Cart")?.value || 0);
            }
        });
    
        return totalAddToCartValue.toFixed(2);  // Return the total add to cart value rounded to two decimal places
    },
    v_website_add_to_cart_value: function (adsData) {
        let totalWebsiteAddToCartValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of all products added to the cart on the website
                totalWebsiteAddToCartValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_cart")?.value || 0);
            }
        });
    
        return totalWebsiteAddToCartValue.toFixed(2);  // Return the total website add to cart value rounded to two decimal places
    },
    v_add_to_wishlist_value: function (adsData) {
        let totalAddToWishlistValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of all products added to the wishlist
                totalAddToWishlistValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_wishlist")?.value || 0);
            }
        });
    
        return totalAddToWishlistValue.toFixed(2);  // Return the total add to wishlist value rounded to two decimal places
    },
    v_initiate_checkout_value: function (adsData) {
        let totalInitiateCheckoutValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of website checkouts initiated
                totalInitiateCheckoutValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_initiate_checkout")?.value || 0);
            }
        });
    
        return totalInitiateCheckoutValue.toFixed(2);  // Return the total initiate checkout value rounded to two decimal places
    },
    v_purchase_value: function (adsData) {
        let totalPurchaseValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of purchases attributed to the ad
                totalPurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "omni_purchase")?.value || 0);
            }
        });
    
        return totalPurchaseValue.toFixed(2);  // Return the total purchase value rounded to two decimal places
    },
    v_website_purchase_value: function (adsData) {
        let totalWebsitePurchaseValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of website purchases
                totalWebsitePurchaseValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
            }
        });
    
        return totalWebsitePurchaseValue.toFixed(2);  // Return the total website purchase value rounded to two decimal places
    },
    v_achievements_unlocked_value: function (adsData) {
        let totalAchievementsUnlockedValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of all achievement unlocked mobile events triggered
                totalAchievementsUnlockedValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "omni_achievement_unlocked")?.value || 0);
            }
        });
    
        return totalAchievementsUnlockedValue.toFixed(2);  // Return the total achievements unlocked value rounded to two decimal places
    },
    v_levels_achieved_value: function (adsData) {
        let totalLevelsAchievedValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of levels achieved
                totalLevelsAchievedValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "omni_level_achieved")?.value || 0);
            }
        });
    
        return totalLevelsAchievedValue.toFixed(2);  // Return the total levels achieved value rounded to two decimal places
    },
    v_appointments_scheduled_value: function (adsData) {
        let totalAppointmentsScheduledValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of all appointments scheduled
                totalAppointmentsScheduledValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "schedule_total")?.value || 0);
            }
        });
    
        return totalAppointmentsScheduledValue.toFixed(2);  // Return the total appointments scheduled value rounded to two decimal places
    },
    v_leads_value: function (adsData) {
        let totalLeadsValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of on and off-Facebook leads
                totalLeadsValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "lead")?.value || 0);
            }
        });
    
        return totalLeadsValue.toFixed(2);  // Return the total leads value rounded to two decimal places
    },
    v_subscriptions_value: function (adsData) {
        let totalSubscriptionsValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of subscriptions attributed to the asset
                totalSubscriptionsValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "subscribe_total")?.value || 0);
            }
        });
    
        return totalSubscriptionsValue.toFixed(2);  // Return the total subscriptions value rounded to two decimal places
    },
    v_registrations_completed_value: function (adsData) {
        let totalRegistrationsCompletedValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of all completed registrations
                totalRegistrationsCompletedValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "omni_complete_registration")?.value || 0);
            }
        });
    
        return totalRegistrationsCompletedValue.toFixed(2);  // Return the total registrations completed value rounded to two decimal places
    },
    v_add_payment_info_mobile_value: function (adsData) {
        let totalAddPaymentInfoMobileValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of payment info added on a mobile app
                totalAddPaymentInfoMobileValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "app_custom_event.fb_mobile_add_payment_info")?.value || 0);
            }
        });
    
        return totalAddPaymentInfoMobileValue.toFixed(2);  // Return the total payment info value rounded to two decimal places
    },
    v_add_payment_info_website_value: function (adsData) {
        let totalAddPaymentInfoWebsiteValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of payment info added on a website
                totalAddPaymentInfoWebsiteValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_payment_info")?.value || 0);
            }
        });
    
        return totalAddPaymentInfoWebsiteValue.toFixed(2);  // Return the total add payment info website value rounded to two decimal places
    },
    v_trials_started_total_value: function (adsData) {
        let totalTrialsStartedValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of trial starts
                totalTrialsStartedValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "start_trial_total")?.value || 0);
            }
        });
    
        return totalTrialsStartedValue.toFixed(2);  // Return the total trial starts value rounded to two decimal places
    },
    v_trials_started_mobile_value: function (adsData) {
        let totalTrialsStartedMobileValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of trial starts on mobile
                totalTrialsStartedMobileValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "start_trial_mobile_app")?.value || 0);
            }
        });
    
        return totalTrialsStartedMobileValue.toFixed(2);  // Return the total trial starts value on mobile rounded to two decimal places
    },
    v_trials_started_website_value: function (adsData) {
        let totalTrialsStartedWebsiteValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of trial starts on the website
                totalTrialsStartedWebsiteValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "start_trial_website")?.value || 0);
            }
        });
    
        return totalTrialsStartedWebsiteValue.toFixed(2);  // Return the total trial starts value on the website rounded to two decimal places
    },
    v_products_customized_value: function (adsData) {
        let totalProductsCustomizedValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value of customized product conversions
                totalProductsCustomizedValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "customize_product_total")?.value || 0);
            }
        });
    
        return totalProductsCustomizedValue.toFixed(2);  // Return the total customized product value rounded to two decimal places
    },
    v_submit_application_value: function (adsData) {
        let totalSubmitApplicationValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value assigned to the submission of an application
                totalSubmitApplicationValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "submit_application_total")?.value || 0);
            }
        });
    
        return totalSubmitApplicationValue.toFixed(2);  // Return the total submit application value rounded to two decimal places
    },
    v_contacts_value: function (adsData) {
        let totalContactsValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value earned from viewers who became contacts
                totalContactsValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "contact_total")?.value || 0);
            }
        });
    
        return totalContactsValue.toFixed(2);  // Return the total contacts value rounded to two decimal places
    },
    v_find_location_value: function (adsData) {
        let totalFindLocationValue = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total value earned from viewers who triggered a find location event
                totalFindLocationValue += parseFloat(ad.insights[0]?.action_values?.find(action => action.action_type === "find_location_total")?.value || 0);
            }
        });
    
        return totalFindLocationValue.toFixed(2);  // Return the total find location value rounded to two decimal places
    },
    
    cost_per_landing_page_views: function (adsData) {
        let spend = 0;
        let landingPageViews = 0;
        let totalCostPerLandingPageView = 0;
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                
                spend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Get the number of LANDING PAGE VIEWS
                landingPageViews += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "landing_page_view")?.value || 0);
    
            }
        });
        // Calculate the cost per landing page view: SPEND / LANDING PAGE VIEWS
        if (landingPageViews > 0) {
            totalCostPerLandingPageView = spend / landingPageViews;
        }
        return totalCostPerLandingPageView.toFixed(2);  // Return the total cost per landing page view rounded to two decimal places
    },
    cost_per_view_content: function (adsData) {
        let totalSpend = 0;
        let totalViewContent = 0;
        let totalCostPerViewContent = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of VIEW CONTENT events triggered
                totalViewContent += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_view_content")?.value || 0);
            }
        });
    
        // Calculate the cost per view content: SPEND / VIEW CONTENT
        if (totalViewContent > 0) {
            totalCostPerViewContent = totalSpend / totalViewContent;
        }
    
        return totalCostPerViewContent.toFixed(2);  // Return the total cost per view content rounded to two decimal places
    },
    cost_per_add_to_cart: function (adsData) {
        let totalSpend = 0;
        let totalAddToCarts = 0;
        let totalCostPerAddToCart = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of ADD TO CARTS
                totalAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_add_to_cart: Adds to Cart")?.value || 0);
            }
        });
    
        // Calculate the cost per add to cart: SPEND / ADD TO CARTS
        if (totalAddToCarts > 0) {
            totalCostPerAddToCart = totalSpend / totalAddToCarts;
        }
    
        return totalCostPerAddToCart.toFixed(2);  // Return the total cost per add to cart rounded to two decimal places
    },
    cost_per_website_add_to_cart: function (adsData) {
        let totalSpend = 0;
        let totalWebsiteAddToCarts = 0;
        let totalCostPerWebsiteAddToCart = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of Website ADD TO CARTS
                totalWebsiteAddToCarts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_cart")?.value || 0);
            }
        });
    
        // Calculate the cost per website add to cart: SPEND / Website ADD TO CARTS
        if (totalWebsiteAddToCarts > 0) {
            totalCostPerWebsiteAddToCart = totalSpend / totalWebsiteAddToCarts;
        }
    
        return totalCostPerWebsiteAddToCart.toFixed(2);  // Return the total cost per website add to cart rounded to two decimal places
    },
    cost_per_add_to_wishlist: function (adsData) {
        let totalSpend = 0;
        let totalAddToWishlist = 0;
        let totalCostPerAddToWishlist = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of ADD TO WISHLIST events
                totalAddToWishlist += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_to_wishlist")?.value || 0);
            }
        });
    
        // Calculate the cost per add to wishlist: SPEND / ADD TO WISHLIST
        if (totalAddToWishlist > 0) {
            totalCostPerAddToWishlist = totalSpend / totalAddToWishlist;
        }
    
        return totalCostPerAddToWishlist.toFixed(2);  // Return the total cost per add to wishlist rounded to two decimal places
    },
    cost_per_initiate_checkout: function (adsData) {
        let totalSpend = 0;
        let totalInitiateCheckout = 0;
        let totalCostPerInitiateCheckout = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of INITIATE CHECKOUTS
                totalInitiateCheckout += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_initiate_checkout")?.value || 0);
            }
        });
    
        // Calculate the cost per initiate checkout: SPEND / INITIATE CHECKOUT
        if (totalInitiateCheckout > 0) {
            totalCostPerInitiateCheckout = totalSpend / totalInitiateCheckout;
        }
    
        return totalCostPerInitiateCheckout.toFixed(2);  // Return the total cost per initiate checkout rounded to two decimal places
    },
    cost_per_purchase: function (adsData) {
        let totalSpend = 0;
        let totalPurchases = 0;
        let totalCostPerPurchase = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of PURCHASES
                totalPurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_purchase")?.value || 0);
            }
        });
    
        // Calculate the cost per purchase: SPEND / PURCHASES
        if (totalPurchases > 0) {
            totalCostPerPurchase = totalSpend / totalPurchases;
        }
    
        return totalCostPerPurchase.toFixed(2);  // Return the total cost per purchase rounded to two decimal places
    },
    cost_per_website_purchase: function (adsData) {
        let totalSpend = 0;
        let totalWebsitePurchases = 0;
        let totalCostPerWebsitePurchase = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of WEBSITE PURCHASES
                totalWebsitePurchases += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_purchase")?.value || 0);
            }
        });
    
        // Calculate the cost per website purchase: SPEND / WEBSITE PURCHASES
        if (totalWebsitePurchases > 0) {
            totalCostPerWebsitePurchase = totalSpend / totalWebsitePurchases;
        }
    
        return totalCostPerWebsitePurchase.toFixed(2);  // Return the total cost per website purchase rounded to two decimal places
    },
    cost_per_app_installs: function (adsData) {
        let totalSpend = 0;
        let totalAppInstalls = 0;
        let totalCostPerAppInstall = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of APP INSTALLS
                totalAppInstalls += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_app_install")?.value || 0);
            }
        });
    
        // Calculate the cost per app install: SPEND / APP INSTALLS
        if (totalAppInstalls > 0) {
            totalCostPerAppInstall = totalSpend / totalAppInstalls;
        }
    
        return totalCostPerAppInstall.toFixed(2);  // Return the total cost per app install rounded to two decimal places
    },
    cost_per_achievements_unlocked: function (adsData) {
        let totalSpend = 0;
        let totalAchievementsUnlocked = 0;
        let totalCostPerAchievementsUnlocked = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of ACHIEVEMENTS UNLOCKED
                totalAchievementsUnlocked += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_achievement_unlocked")?.value || 0);
            }
        });
    
        // Calculate the cost per achievements unlocked: SPEND / ACHIEVEMENTS UNLOCKED
        if (totalAchievementsUnlocked > 0) {
            totalCostPerAchievementsUnlocked = totalSpend / totalAchievementsUnlocked;
        }
    
        return totalCostPerAchievementsUnlocked.toFixed(2);  // Return the total cost per achievement unlocked rounded to two decimal places
    },
    cost_per_levels_achieved: function (adsData) {
        let totalSpend = 0;
        let totalLevelsAchieved = 0;
        let totalCostPerLevelsAchieved = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of LEVELS ACHIEVED
                totalLevelsAchieved += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_level_achieved")?.value || 0);
            }
        });
    
        // Calculate the cost per levels achieved: SPEND / LEVELS ACHIEVED
        if (totalLevelsAchieved > 0) {
            totalCostPerLevelsAchieved = totalSpend / totalLevelsAchieved;
        }
    
        return totalCostPerLevelsAchieved.toFixed(2);  // Return the total cost per levels achieved rounded to two decimal places
    },
    cost_per_appointments_scheduled: function (adsData) {
        let totalSpend = 0;
        let totalAppointmentsScheduled = 0;
        let totalCostPerAppointmentsScheduled = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of APPOINTMENTS SCHEDULED
                totalAppointmentsScheduled += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "schedule_total")?.value || 0);
            }
        });
    
        // Calculate the cost per appointment scheduled: SPEND / TOTAL APPOINTMENTS SCHEDULED
        if (totalAppointmentsScheduled > 0) {
            totalCostPerAppointmentsScheduled = totalSpend / totalAppointmentsScheduled;
        }
    
        return totalCostPerAppointmentsScheduled.toFixed(2);  // Return the total cost per appointment scheduled rounded to two decimal places
    },
    cost_per_leads: function (adsData) {
        let totalSpend = 0;
        let totalLeads = 0;
        let totalCostPerLead = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of LEADS
                totalLeads += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "lead")?.value || 0);
            }
        });
    
        // Calculate the cost per lead: SPEND / LEADS
        if (totalLeads > 0) {
            totalCostPerLead = totalSpend / totalLeads;
        }
    
        return totalCostPerLead.toFixed(2);  // Return the total cost per lead rounded to two decimal places
    },
    cost_per_subscriptions: function (adsData) {
        let totalSpend = 0;
        let totalSubscriptions = 0;
        let totalCostPerSubscription = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of SUBSCRIPTIONS
                totalSubscriptions += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "subscribe_total")?.value || 0);
            }
        });
    
        // Calculate the cost per subscription: SPEND / SUBSCRIPTIONS
        if (totalSubscriptions > 0) {
            totalCostPerSubscription = totalSpend / totalSubscriptions;
        }
    
        return totalCostPerSubscription.toFixed(2);  // Return the total cost per subscription rounded to two decimal places
    },
    cost_per_registrations_completed: function (adsData) {
        let totalSpend = 0;
        let totalRegistrationsCompleted = 0;
        let totalCostPerRegistrationsCompleted = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of COMPLETED REGISTRATIONS
                totalRegistrationsCompleted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "omni_complete_registration")?.value || 0);
            }
        });
    
        // Calculate the cost per registration completed: SPEND / COMPLETE REGISTRATIONS
        if (totalRegistrationsCompleted > 0) {
            totalCostPerRegistrationsCompleted = totalSpend / totalRegistrationsCompleted;
        }
    
        return totalCostPerRegistrationsCompleted.toFixed(2);  // Return the total cost per registration completed rounded to two decimal places
    },
    cost_per_add_payment_info_mobile: function (adsData) {
        let totalSpend = 0;
        let totalMobileAddPaymentInfo = 0;
        let totalCostPerAddPaymentInfoMobile = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of MOBILE ADD PAYMENT INFO events
                totalMobileAddPaymentInfo += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "app_custom_event.fb_mobile_add_payment_info")?.value || 0);
            }
        });
    
        // Calculate the cost per add payment info (mobile): SPEND / MOBILE ADD PAYMENT INFO
        if (totalMobileAddPaymentInfo > 0) {
            totalCostPerAddPaymentInfoMobile = totalSpend / totalMobileAddPaymentInfo;
        }
    
        return totalCostPerAddPaymentInfoMobile.toFixed(2);  // Return the total cost per add payment info (mobile) rounded to two decimal places
    },
    cost_per_add_payment_info_website: function (adsData) {
        let totalSpend = 0;
        let totalWebsiteAddPaymentInfo = 0;
        let totalCostPerAddPaymentInfoWebsite = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of WEBSITE ADD PAYMENT INFO events
                totalWebsiteAddPaymentInfo += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_add_payment_info")?.value || 0);
            }
        });
    
        // Calculate the cost per add payment info (website): SPEND / WEBSITE ADD PAYMENT INFO
        if (totalWebsiteAddPaymentInfo > 0) {
            totalCostPerAddPaymentInfoWebsite = totalSpend / totalWebsiteAddPaymentInfo;
        }
    
        return totalCostPerAddPaymentInfoWebsite.toFixed(2);  // Return the total cost per add payment info (website) rounded to two decimal places
    },
    cost_per_trials_started_total: function (adsData) {
        let totalSpend = 0;
        let totalTrialsStartedTotal = 0;
        let totalCostPerTrialsStartedTotal = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of TRIALS STARTED (TOTAL)
                totalTrialsStartedTotal += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_total")?.value || 0);
            }
        });
    
        // Calculate the cost per trials started (total): SPEND / TRIALS STARTED (TOTAL)
        if (totalTrialsStartedTotal > 0) {
            totalCostPerTrialsStartedTotal = totalSpend / totalTrialsStartedTotal;
        }
    
        return totalCostPerTrialsStartedTotal.toFixed(2);  // Return the total cost per trials started rounded to two decimal places
    },
    cost_per_trials_started_mobile: function (adsData) {
        let totalSpend = 0;
        let totalTrialsStartedMobile = 0;
        let totalCostPerTrialsStartedMobile = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of TRIALS STARTED (MOBILE)
                totalTrialsStartedMobile += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_mobile_app")?.value || 0);
            }
        });
    
        // Calculate the cost per trials started (mobile): SPEND / TRIALS STARTED (MOBILE)
        if (totalTrialsStartedMobile > 0) {
            totalCostPerTrialsStartedMobile = totalSpend / totalTrialsStartedMobile;
        }
    
        return totalCostPerTrialsStartedMobile.toFixed(2);  // Return the total cost per trials started on mobile rounded to two decimal places
    },
    cost_per_trials_started_website: function (adsData) {
        let totalSpend = 0;
        let totalTrialsStartedWebsite = 0;
        let totalCostPerTrialsStartedWebsite = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of TRIALS STARTED (WEBSITE)
                totalTrialsStartedWebsite += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "start_trial_website")?.value || 0);
            }
        });
    
        // Calculate the cost per trials started (website): SPEND / TRIALS STARTED (WEBSITE)
        if (totalTrialsStartedWebsite > 0) {
            totalCostPerTrialsStartedWebsite = totalSpend / totalTrialsStartedWebsite;
        }
    
        return totalCostPerTrialsStartedWebsite.toFixed(2);  // Return the total cost per trials started on website rounded to two decimal places
    },
    cost_per_products_customized: function (adsData) {
        let totalSpend = 0;
        let totalProductsCustomized = 0;
        let totalCostPerProductsCustomized = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of PRODUCT CUSTOMIZED events
                totalProductsCustomized += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "customize_product_total")?.value || 0);
            }
        });
    
        // Calculate the cost per product customized: SPEND / PRODUCT CUSTOMIZED
        if (totalProductsCustomized > 0) {
            totalCostPerProductsCustomized = totalSpend / totalProductsCustomized;
        }
    
        return totalCostPerProductsCustomized.toFixed(2);  // Return the total cost per product customized rounded to two decimal places
    },
    cost_per_submit_application: function (adsData) {
        let totalSpend = 0;
        let totalApplicationsSubmitted = 0;
        let totalCostPerSubmitApplication = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of APPLICATIONS SUBMITTED
                totalApplicationsSubmitted += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "submit_application_total")?.value || 0);
            }
        });
    
        // Calculate the cost per submit application: SPEND / APPLICATIONS SUBMITTED
        if (totalApplicationsSubmitted > 0) {
            totalCostPerSubmitApplication = totalSpend / totalApplicationsSubmitted;
        }
    
        return totalCostPerSubmitApplication.toFixed(2);  // Return the total cost per submit application rounded to two decimal places
    },
    cost_per_contacts: function (adsData) {
        let totalSpend = 0;
        let totalContacts = 0;
        let totalCostPerContacts = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of CONTACTS
                totalContacts += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "contact_total")?.value || 0);
            }
        });
    
        // Calculate the cost per contact: SPEND / TOTAL CONTACTS
        if (totalContacts > 0) {
            totalCostPerContacts = totalSpend / totalContacts;
        }
    
        return totalCostPerContacts.toFixed(2);  // Return the total cost per contact rounded to two decimal places
    },
    cost_per_find_location: function (adsData) {
        let totalSpend = 0;
        let totalFindLocations = 0;
        let totalCostPerFindLocation = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of FIND LOCATIONS
                totalFindLocations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "find_location_total")?.value || 0);
            }
        });
    
        // Calculate the cost per find location: SPEND / TOTAL FIND LOCATIONS
        if (totalFindLocations > 0) {
            totalCostPerFindLocation = totalSpend / totalFindLocations;
        }
    
        return totalCostPerFindLocation.toFixed(2);  // Return the total cost per find location rounded to two decimal places
    },
    cost_per_search: function (adsData) {
        let totalSpend = 0;
        let totalSearchCount = 0;
        let totalCostPerSearch = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of SEARCH EVENTS
                totalSearchCount += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "offsite_conversion.fb_pixel_search")?.value || 0);
            }
        });
    
        // Calculate the cost per search: SPEND / SEARCH COUNT
        if (totalSearchCount > 0) {
            totalCostPerSearch = totalSpend / totalSearchCount;
        }
    
        return totalCostPerSearch.toFixed(2);  // Return the total cost per search rounded to two decimal places
    },
    cost_per_donations: function (adsData) {
        let totalSpend = 0;
        let totalWebsiteDonations = 0;
        let totalCostPerDonations = 0;
    
        adsData.forEach(ad => {
            if (ad.insights && ad.insights.length > 0) {
                // Sum up the total SPEND
                totalSpend += parseFloat(ad.insights[0]?.spend || 0);
    
                // Sum up the total number of WEBSITE DONATIONS
                totalWebsiteDonations += parseInt(ad.insights[0]?.actions?.find(action => action.action_type === "donate_total")?.value || 0);
            }
        });
    
        // Calculate the cost per donation: SPEND / WEBSITE DONATIONS
        if (totalWebsiteDonations > 0) {
            totalCostPerDonations = totalSpend / totalWebsiteDonations;
        }
    
        return totalCostPerDonations.toFixed(2);  // Return the total cost per donation rounded to two decimal places
    }  
};

window.metrics = metrics;