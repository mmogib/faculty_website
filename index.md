---
layout: default
---


{% assign user = site.data.info.email | split : "@" %}
<!--
{% assign img = 'assets/images/' | append : 'unknown' | append : '.png' %}
-->
{% assign img =  site.data.info.profile_image%}

<img id="profile-picture" class="profile-picture" src="{{img}}" alt="Profile picture">

{% include usable/aboutme.md %}

{% include usable/research_interests.md %}


{% include usable/publications.md limit="5" %}


