(function () {
    App.Models = App.Models || {};
    App.Models.Facebook = Backbone.Model.extend({
        initialize: function () {
            this.facebook = FB;
            this.facebook.init(App.Global.Facebbok.init);
        },

        Login: function (cbLogin, scope) {
            return this.facebook.login(cbLogin, scope);
        },

        getLoginStatus: function (cbLogin) {
            return this.facebook.getLoginStatus(cbLogin);
        },

        search: function () {
            this.facebook.api('me?fields=feed{attachments}', 'get', function (response) {
                if (!response || response.error) {
                    //Error
                } else {
                    console.log(response);
                }
            });
        }
    });

    App.Models.FacebookPost = Backbone.Model.extend({
        defaults: {
            description: '',
            image: {
                src: '',
                height: '',
                width: ''
            }
        }
    });
})();
