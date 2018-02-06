{% assign aboutme = site.data.info.about_me | split: "[period]" %}

{% for about in aboutme %}
{{about}}
{% endfor %} 
