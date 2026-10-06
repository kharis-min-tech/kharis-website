/** This site's workspace id in the shared Kharis database. */
export const SITE_WORKSPACE = "kp2" as const;

/** Rows tagged with these workspaces are allowed on this site. */
export const SITE_WORKSPACES = ["kp2", "general"] as const;

export type SiteWorkspace = (typeof SITE_WORKSPACES)[number];
