from rest_framework.exceptions import APIException
from django.utils.encoding import force_str
from django.utils.translation import gettext_lazy as _

class CannotFollowSelfError(APIException):
    status_code = 403  # HTTP_403_FORBIDDEN
    default_detail = 'You cannot follow yourself.'
    default_code = 'cannot_follow_self'

class CannotActionOtherUserInfoError(APIException):
    status_code = 403  # HTTP_403_FORBIDDEN
    default_detail = _('You cannot {action} other user {info}.')
    default_code = _('cannot_{action}_other_user_{info}')

    def __init__(self, action, info, detail=None, code=None):
        if detail is None:
            detail = force_str(self.default_detail).format(action=action, info=info)
        super().__init__(detail, code)