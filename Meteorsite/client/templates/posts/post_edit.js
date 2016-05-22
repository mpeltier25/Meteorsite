Template.postEdit.onCreated(function() {
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    
    var postProperties = {
      firstName: $(e.target).find('[name=firstName]').val(),
      lastName: $(e.target).find('[name=lastName]').val(),
      primaryContactEmail: $(e.target).find('[name=primaryContactEmail]').val(),
    }
    
    var errors = validatePost(postProperties);
    if (errors.title)
      return Session.set('postEditErrors', errors);
    
     Posts.update(currentPostId, {$set: postProperties}, function(error) {
      
    		if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('home');
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  }
});
