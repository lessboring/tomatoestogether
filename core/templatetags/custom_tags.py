from django import template

register = template.Library()


@register.filter
def minutes(timedelta):
    return timedelta.seconds // 60
