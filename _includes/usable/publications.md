<!--
{% assign publications = site.data.info.research %}
{% for pub in publications%}
{% if pub.title=="Publications"%}
# {{pub.title}}
{% for item in pub.list %}
1. {{item}}
{% endfor %}
{% endif %}
{% endfor %}
-->
# Publications 
{% if include.limit=='5' %}<a  href="{{site.baseurl}} research "> (more) </a>{% endif %}
<div id="ScopusPublications" data-limit="{{include.limit}}"></div>