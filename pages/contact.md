---
layout: page
is_contact: true
title: Contact Me
permalink: /contact/
---

* Email: [{{site.data.info.email}}]({{site.data.info.email}})

* Phone: [{{site.data.info.phone}}]({{site.data.info.phone}})

* Office: [{{site.data.info.office}}]({{site.data.info.office}})


---

## Mailing Address
{% assign mail = site.data.info.mail | split: "[period]"%}
{% for line in mail%}
> {{line}}
{% endfor %}

---

{% assign social = site.data.info.social_media %}
{% if social %}
## Social
{% for media in social %}
{% assign title =media[0] %}
{{title}} : 
{{media[1]}}
{% endfor %}
{% endif %}