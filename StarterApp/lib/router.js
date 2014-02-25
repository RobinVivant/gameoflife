Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { }
});


Router.map(function() {
  this.route('home', {path: '/'});
  this.route('simulation', {path: '/simulation'});
  this.route('about', {path: '/about'});
});