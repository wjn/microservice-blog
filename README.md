# microservice-blog

POC experiment to learn micro service architecture with a simple blog app.

This POC demonstrates architecture that will allow for resiliancy and future service additions over time.

For example when running this app services can fail and there is a higher percentage chance that the end user will not be effected.

Because the hand-rolled Event Bus (POC) stores off events, services like the Query Service can fail or not be built yet, and when brought online will catch up with all events it missed.
