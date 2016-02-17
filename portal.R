#################################################
####  Filter portal data to make it smaller  ####
#################################################

## We won't be plotting points that have missing data for weight or hindfoot
## length, so these can be removed. This drastically reduces the number of
## genera present in the data, so the legend won't be cluttered with genera that
## are never plotted because they're missing data.

library("dplyr")

## Load data
portal <- read.csv("portal_combined.csv", stringsAsFactors = FALSE)

## Filter data
portal_sml <- portal %>%
  filter(!is.na(weight) & !is.na(hindfoot_length))

## What genera are present?
genera <- portal_sml %>%
  group_by(genus) %>%
  tally() %>%
  ## Order by abundance
  arrange(desc(n))

unique(genera$genus)

## Export CSV
write.csv(portal_sml, "portal_NAs_removed.csv", row.names = FALSE)
