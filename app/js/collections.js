(function () {
    App.Collections = App.Collections || {};
    App.Collections.FBTimeLine = Backbone.Collection.extend({
        model: App.Models.FacebookPost,

        initialize: function () {
            this.facebook = FB;
        },

        parse: function (response) {
            var data = '';
            if (response) {
                var allPost = this.getFacebooksPost(response);
                this.reset(allPost);
            }
        },

        getFacebooksPost: function (response) {
            var allPost = [];
            var profile = { 
                name: response.name, 
                picture: response.picture.data.url,
                date: ''
            };
            _.each(response.feed.data, function (post) {
                if (post.attachments) {
                    profile.date = post.created_time;
                    _.each(post.attachments.data, function (attachment) {
                        if (attachment.type !== 'album' && attachment.description) {
                            var post = {
                                description: attachment.description,
                                image: attachment.media.image,
                                name: profile.name,
                                picture: profile.picture,
                                date: profile.date
                            }
                            allPost.push(post);
                        }
                    });
                }
            });
            return allPost;
        },

        getTimeLine: function () {
            var self = this;
            this.facebook.api('me?fields=id,name,feed{attachments,created_time},picture', 'get', function (response) {
                if (!response || response.error) {
                    self.trigger('onErrorGetTimeline', response);
                } else {
                    self.trigger('onSuccessGetTimeline', self.parse(response));
                }
            });
        }
    });
})();