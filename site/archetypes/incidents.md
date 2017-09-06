+++
# default attributes for an incident.
#
title = "{{ replace .TranslationBaseName "-" " " | title }}"
date = {{ .Date }}

# severity: represents the impact of
# your system due to the current incident.
# This is the list of supported severities:
#
# - under-maintenance
# - degraded-performance
# - partial-outage
# - major-outage
#
severity = "degraded-performance"

# affectedsystems: is a list of systems affected
# by the incident.
# Example:
# affectedsystems = ["API", "CDN"]
#
affectedsystems = ["API", "CDN"]

# resolved: marks an incident as resolved.
# It can be either true or false.
#
resolved = false
+++
