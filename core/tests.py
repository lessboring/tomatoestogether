from django_webtest import WebTest


class TestUsers(WebTest):
    def test_create_account(self):
        res = self.app.post_json('/api/v1/users/', {
            'email': 'dvcolgan@gmail.com',
            'password': 'password',
            'name': 'David',
        })

        self.assertDictEqual(res.json, {
            'email': 'dvcolgan@gmail.com',
            'name': 'David',
            'tomato_break_iframe_url': '',
        })
