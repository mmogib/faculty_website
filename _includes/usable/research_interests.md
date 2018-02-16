<!--
<div id="researchInterests" >
<h2> Research Interests </h2>
<div> Loading please, wait ...</div>
</div>
-->
## Research Interests
{% for item in site.data.info.researchInterests %}
* {{item}}
{% endfor %}


