---
layout: default
---

## About Me
{% assign user = site.data.info.email | split : "@" %}
{% assign img = 'assets/images/' | append : 'unknown' | append : '.png' %}
<img id="profile-picture" class="profile-picture" src="{{img}}" alt="Profile picture">

{% include usable/aboutme.md %}

{% include usable/research_interests.md %}


{% include usable/publications.md limit="5" %}


