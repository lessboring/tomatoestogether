from django_webtest import WebTest
from .models import User


class BaseTest(WebTest):
    API_ROOT = ''

    def setUp(self):
        self.headers = {}

    def create_user(self, email, password, name=''):
        user = User.objects.create(
            email=email,
            name=name,
        )
        user.set_password(password)
        user.save()
        return user

    def login(self, email, password):
        self.create_user(email, password)

        res = self.post('/auth/token/', {
            'email': 'dvcolgan@gmail.com',
            'password': 'password',
        })
        token = res.json.get('token')
        self.headers = {
            'Authorization': 'JWT ' + token,
        }

    def logout(self):
        self.headers = {}

    def get(self, url, params={}):
        return self.app.get(self.API_ROOT + url, params, self.headers)

    def post(self, url, data):
        return self.app.post_json(self.API_ROOT + url, data, self.headers)

    def put(self, url, data):
        return self.app.put_json(self.API_ROOT + url, data, self.headers)

    def patch(self, url, data):
        return self.app.patch_json(self.API_ROOT + url, data, self.headers)

    def delete(self, url, data):
        return self.app.delete_json(self.API_ROOT + url, data, self.headers)

    def assertResponse(self, res, expected_status_code, expected_json):
        self.assertEqual(res.status_code, expected_status_code)
        self.assertDictEqual(res.json, expected_json)

    def assertResponseCode(self, res, status_code):
        self.assertEqual(res.status_code, status_code)


class TestUsers(BaseTest):
    API_ROOT = '/api/v1'

    def test_create_account(self):
        res = self.post('/users/', {
            'email': 'dvcolgan@gmail.com',
            'password': 'password',
            'name': 'David',
        })

        self.assertResponse(res, 201, {
            'email': 'dvcolgan@gmail.com',
            'name': 'David',
            'tomato_break_iframe_url': '',
        })

    def test_login(self):
        self.create_user('dvcolgan@gmail.com', 'password')
        res = self.post('/auth/token/', {
            'email': 'dvcolgan@gmail.com',
            'password': 'password',
        })
        token = res.json['token']

        self.assertResponse(res, 200, {
            'token': token,
        })

    def test_change_password(self):
        self.login('dvcolgan@gmail.com', 'password')

        res = self.patch('/users/me/', {
            'password': 'password2',
        })

        res = self.post('/auth/token/', {
            'email': 'dvcolgan@gmail.com',
            'password': 'password2',
        })
        token = res.json['token']

        self.assertResponse(res, 200, {
            'token': token,
        })
