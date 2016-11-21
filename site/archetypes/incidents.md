+++
# default attributes for an incident.
#
# Hugo adds `title` and `date` by default
# when running `hugo new incidents/new-incident.md`,
# so we don't have to specify them here.

# state: represents the global state of 
# your system due to the current incident.
# This is the list of supported states:
#
# - under-maintenance
# - degraded-performance
# - partial-outage
# - major-outage
#
state = "degraded-performance"

# affectedsystem: is a list of systems affected
# by the incident.
# Example:
# affectedsytems = ["API", "Build servers"]
#
affectedsytems = ["API", "Build servers"]

# resolved: marks an incident as resolved.
# It can be either true or false.
#
resolved = false
+++
