---
layout: page
title: Research
permalink: /research/
---


{% assign publications = site.data.info.research %}
{% for pub in publications%}
{% if pub.title=="Publications"%}
# {{pub.title}}
{% for item in pub.list %}
1. {{item}}
{% endfor %}
{% endif %}
{% endfor %}