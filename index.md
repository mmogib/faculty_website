---
layout: default
---

## About Me
{% assign user = site.data.info.email | split : "@" %}
{% assign img = 'assets/images/' | append : user[0] | append : '.png' %}
<img class="profile-picture" src="{{ 'assets/images/dept.png' | relative_url }}">

{% include usable/aboutme.md %}

{% include usable/research_interests.md %}

{% include usable/publications_short.md %}


