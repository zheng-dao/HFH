$('.main-header.logged-in .hotels-logo').after('<span class="toggle"><img src="../img/toggle.svg" alt="Menu" /></span>');
$('.main-header.logged-in .toggle').click(function() {
    $('.site-menu').toggleClass('open');
    $(this).toggleClass('open');
});

$('a.nested').click(function(e) {
  // Let's check if the element that triggered this ("this") does not have the class we need (indicated by the "!" at the start)
  if (!$(this).hasClass('open')) {
    // We do not have the class, so let's add it and prevent the link from redirecting the user.
    $(this).addClass('open');
    e.preventDefault();
  }
  // There is no need to specify an "else" because we just want the link to work as normal. The preventDefault will only run if the link doesn't have the class.
});

$('.intro-banner nav').before('<span class="toggle">Section Menu</span>');
$('.intro-block .toggle').click(function() {
    $('.intro-banner > nav').toggleClass('open');
    $(this).toggleClass('open');
});

$('.topics').before('<span class="topics-toggle">Topics</span>');
$('.topics-toggle').click(function() {
    $('.topics').toggleClass('open');
    $(this).toggleClass('open');
});

$('.filter-toggle').click(function() {
    $('.search-filters').toggleClass('open');
    $(this).toggleClass('open');
});

$('.topics li a, .search-filters li a, .topics.sub-filter li a').click(function() {
  $(this).toggleClass('selected');
  return false;
});

$('.search-filters li a.articles, .search-filters li a.blog-posts').click(function() {
  $('.topics.sub-filter').toggleClass('open');
  return false;
});

$('.viewer-menu .toggle').click(function() {
    $('.viewer-menu ul').toggleClass('open');
});

$('.intro-block .toggle').click(function() {
    $('.news .intro nav').toggleClass('open');
    $(this).toggleClass('open');
});

$('.search-block section h3').click(function() {
  $(this).parent().toggleClass('open');
});

$('.browser .year > h3').click(function() {
  $(this).parent().toggleClass('open');
});

$('.months li > h3').click(function() {
  $(this).parent().toggleClass('open');
});

$('.share-links h4').click(function() {
  $(this).parent().toggleClass('open');
});

$('.months li h3').click(function() {
    $(this).parent().toggleClass('open');
});

$('.collapsible h3').click(function() {
  $(this).parent().toggleClass('open');
});

// App Additions & Mockup Interactions


$('#create-new').click(function() {
  $('.app-pane.hidden').removeClass('hidden');
});

$('#referrer-yes').click(function() {
  $('.referrer-info').removeClass('hidden');
});

$('#referrer-no').click(function() {
  $('.referrer-info').addClass('hidden');
});

$('button.remove').click(function() {
  $(this).addClass('clicked');
  $(this).parent().addClass('remove');
  $(this).parent().mouseleave(function() {
    $(this).parent().removeClass('remove');
    $(this).removeClass('clicked');
  })
  return false;
});

$('.files li label').click(function() {
  $(this).parent().toggleClass('selected');
});

$('.send-email').click(function() {
  $('.send-panel').removeClass('hidden');
  $(this).addClass('hidden');
  $('.files > ul li').prepend('<input type="checkbox" /> ')
  return false;
});

$('button.cancel').click(function() {
  $(this).parent().addClass('hidden');
  $('.pdf-controls .send-email').removeClass('hidden');
  return false;
});

$('#new-stay').click(function() {
  $('#extended-stay-1').removeClass('hidden');
});

$('.collapsible.detail-block h4').click(function() {
  $(this).parent().toggleClass('open');
});

$('.stay-heading').click(function() { // tie this to approved / completed stays only
  $(this).siblings().toggleClass('hidden');
  $(this).toggleClass('collapsed');
});

$('button.save').click(function() { 
  $(this).toggleClass('saved');
});

$('.detail-block.terms-and-conditions h5 a.more').click(function() { 
  $('.detail-block.terms-and-conditions .terms').removeClass('hidden');
  $('.detail-block.terms-and-conditions h5').removeClass('last-child-hack')
  return false;
});

$('.detail-block.hidden-section h5 a.more').click(function() { 
  $('.detail-block.hidden-section .hidden-content').removeClass('hidden');
  $('.detail-block.hidden-section h5').removeClass('last-child-hack')
  return false;
});

$('.detail-block.documents h5 a.more').click(function() { 
  $('.detail-block.documents .files').removeClass('hidden');
  $('.detail-block.documents h5').removeClass('last-child-hack')
  return false;
});

$('.history-and-notes .add').click(function() { 
  $('#add-note').removeClass('hidden');
});

$('a.advanced-link').click(function() {
  $('#main-search .filters ul > li.group-break-hack').removeClass('group-break');
  $('#main-search .filters').addClass('advanced-search-open');
  $('.advanced-search').removeClass('hidden');
  $(this).addClass('hidden');
});

$('#temp-stay-yes').click(function() {
  $('#stay_radios').removeClass('last-child-hack');
  $('.actual-stay-dates').removeClass('hidden');
  $('.actual-stay-dates').addClass('last-child-hack');
  $('.narrative').addClass('hidden');
});

$('#temp-stay-no').click(function() {
  $('#stay_radios').removeClass('last-child-hack');
  $('.actual-stay-dates').addClass('hidden');
  $('.narrative').removeClass('hidden');
});

$('a.more-history').click(function() {
  $(this).addClass('hidden');
  $('#show-full-target').removeClass('hidden');
  $('#hide-full-history').removeClass('hidden');
  return false;
});

$('a.show-table-controls').click(function() {
  $('.table-controls-panel').removeClass('hidden');
  $(this).addClass('hidden');
  return false
});

$('#unread-toggle').click(function() { 
  $('#unread-toggle').toggleClass('unread');
  $('#unread-target-row').toggleClass('unread');
});

$('#unread-all-toggle').click(function() { 
  $('#unread-all-toggle').addClass('unread');
  $('#unread-toggle').addClass('unread');
  $('tr').addClass('unread');
});

$('.dialog-content button.close').click(function() {
  event.preventDefault(); 
  $('.dialog').addClass('hidden');
  $(this).siblings().removeClass('blur');
});

$('#return-stay').click(function() {
  $('#return-hide-hack').removeClass('hidden');
  $('#return-hide-hack2').removeClass('hidden');
  $('#cancel').removeClass('hidden');
  $('#approve-stay').addClass('hidden');
  $('#decline-stay').addClass('hidden');
  $(this).addClass('final');
});

$('#add-new-org').click(function() {
  $('#add-new-org-target').removeClass('hidden');
  $('#organization-list').addClass('hidden');
  return false;
});

$('#remove-organization.clicked').click(function() {
  $('#organization-list').removeClass('hidden');
  $('#add-new-org-target').addClass('hidden');
});


$('#group-apps-list-select').click(function() {
  $(this).toggleClass('open');
  $('#group-apps-list-options').toggleClass('hidden');
});