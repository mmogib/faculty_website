## Research Interest

{% assign research = site.data.info.research %}
{% for interest in research%}
{% if interest.title=="Research Interests"%}
{% if interest.list %}
{% for item in interest.list %}
* {{item}}
{% endfor %}
{% endif %}
{% if interest.para %}
{{interest.para}}
{% endif %}
{% endif %}
{% endfor %}

