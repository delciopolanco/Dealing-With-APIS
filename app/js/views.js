(function () {
    App.Views = App.Views || {};
    App.Views.FBLogin = Backbone.View.extend({
        el: '#fbLogin',

        initialize: function () {
            this.render();
        },

        events: {
            'click #loginFB': 'fbStatus'
        },

        render: function () {
            this.model = new App.Models.Facebook();
        },

        loginFB: function () {
            var self = this;
            this.model.Login(function (response) {
                switch (response.status) {
                    case 'connected':
                        self.redirectToTimeLine();
                        break;
                    case 'not_authorized':
                        //TODO
                        break;
                    default:
                        //TODO
                        console.log('you dont accept the contract or arent login to facebook');
                        break;
                }
            }, { scope: App.Global.Facebbok.scope });
        },

        fbStatus: function (e) {
            e.preventDefault();
            var self = this;
            this.model.getLoginStatus(function (response) {
                switch (response.status) {
                    case 'connected':
                        self.redirectToTimeLine();
                        break;
                    case 'not_authorized':
                        //TODO
                        break;
                    default:
                        self.loginFB();
                        break;
                }
            });
        },

        redirectToTimeLine: function () {
            this.$el.hide();
            App.Views.fbTimeline = new App.Views.FBTimeLine({
                collection: new App.Collections.FBTimeLine()
            });

        }

    });

    App.Views.FBTimeLine = Backbone.View.extend({
        el: '#fbTimeLine',

        ui: {
            postContainer: '#fbPostContainer'
        },

        initialize: function () {

            this.listenTo(this.collection, 'onSuccessGetTimeline', this.successGetTimeLine);
            this.listenTo(this.collection, 'onErrorGetTimeline', this.errorGetTimeLine);

            this.collection.getTimeLine();
        },

        events: {
            'click #loginFB': 'fbStatus'
        },

        render: function () {
            var allPost = [];
            this.collection.each(function (model) {
                allPost.push(new App.Views.FBPost({
                    model: model
                }).render().el);
            }, this);
            this.$el.find(this.ui.postContainer).html(allPost);
            this.$el.show();
        },

        successGetTimeLine: function () {
            this.render();
        },

        errorGetTimeLine: function () {
            //TODO
        }
    });

    App.Views.FBPost = Backbone.View.extend({
        tagName: 'div',
        className: 'message-item',
        template: Handlebars.templates['facebook-Post'],

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    Handlebars.registerHelper('shortFormatDate', function (currentDate, options) {
        var date = new Date(currentDate);
        return moment(date).format('ll');
    });

})();
