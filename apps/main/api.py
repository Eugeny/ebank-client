from tastypie import fields
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import ImmediateHttpResponse
from tastypie.http import HttpBadRequest
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash

from django.conf import settings
from django.conf.urls import url
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import HttpResponse

from apps.main.models import *


class SessionAuthentication (Authentication):
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()

    def get_identifier(self, request):
        return request.user.username


class AngularResource (ModelResource):
    def alter_list_data_to_serialize(self, request, data_dict):
        return data_dict['objects']

    def build_filters(self, filters=None):
        if filters is None:
            filters = {}
        orm_filters = super(ModelResource, self).build_filters(filters)
        orm_filters['_custom'] = Q()

        if filters:
            for k, v in list(filters.iteritems()):
                for suffix in [
                    'iexact', 
                    'contains', 
                    'icontains', 
                    'startswith', 
                    'istartswith', 
                    'endswith', 
                    'iendswith', 
                    'isnull',
                ]:
                    if k.endswith('__' + suffix):
                        del filters[k]
                        orm_filters['_custom'] |= Q(**{k: v})

        return orm_filters

    def apply_filters(self, request, applicable_filters):
        if '_custom' in applicable_filters:
            custom = applicable_filters.pop('_custom')
        else:
            custom = None
        semi_filtered = super(ModelResource, self).apply_filters(request, applicable_filters)
        return semi_filtered.filter(custom) if custom else semi_filtered

    @classmethod
    def api_field_from_django_field(cls, f, **kwargs):
        internal_type = f.get_internal_type()
        if internal_type == 'BigIntegerField':
            return fields.IntegerField
        return ModelResource.api_field_from_django_field(f, **kwargs)

    def _handle_500(self, request, exception):
        if settings.DEBUG == False:
            settings.DEBUG = True
            resp = ModelResource._handle_500(self, request, exception)
            settings.DEBUG = False
            return resp
        else:
            return ModelResource._handle_500(self, request, exception)

    class Meta:
        trailing_slash = False
        always_return_data = True
        authentication = SessionAuthentication()
        authorization = Authorization()


class JsonField (fields.CharField):
    dehydrated_type = 'string'

    def dehydrate(self, bundle, for_list=True):
        d = fields.CharField.dehydrate(self, bundle, for_list=True)
        return json.loads(d)

    def hydrate(self, bundle):
        d = fields.CharField.hydrate(self, bundle)
        return json.dumps(d)


# -----------------------------------------------

class UserResource (AngularResource):
    class Meta (AngularResource.Meta):
        queryset = User.objects.all()
        resource_name = 'user'


class BankAccountResource (AngularResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)

    class Meta (AngularResource.Meta):
        queryset = BankAccount.objects.all()
        resource_name = 'bank-account'

        filtering = {
            'id': ALL,
            'user': ALL_WITH_RELATIONS,
            'name': ALL,
        }

