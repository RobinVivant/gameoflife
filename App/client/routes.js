Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { }
});


Router.map(function() {
  this.route('home', {path: '/'});
  this.route('description', {path: '/description'});
  this.route('simulation', {path: '/simulation'});
});