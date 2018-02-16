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

{% if site.data.info.scopus_id %}
{% if include.limit=='5' %}
## Publications (short list)
{% else %}

# Publications
{% endif %}
<div id="ScopusPublications" data-limit="{{include.limit}}">
Loading data from scopus.com, please wait ...
 </div>

{% if include.limit=='5' %}
<a  class="more-link" href="{{site.baseurl}} research "> (more) </a>
{% endif %}
{% endif %}
