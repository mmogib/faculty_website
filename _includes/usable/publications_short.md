## Publications

{% assign Research = site.data.info.research %}

{% assign counter = 0 %}
{% for research in Research%}
{% if research.title=="Publications"%}
{% if research.list %}
{% for item in (1..5) %}
{% if research.list[item] %}
1. {{research.list[item]}}
{% endif %}
{% endfor %}
{% endif %}
{% endif %}
{% endfor %}
 [More ... ]({{baseurl}}{% link pages/research.md %})