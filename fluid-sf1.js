//blank out the dock notification counter
window.fluid.dockBadge = '';

//refresh feed every 5 mins
var refreshMins = 5;
setInterval(refreshFeed, 1000*60*refreshMins);

//update badge / notification once a second
setInterval(updateNotifications, 1000);

//default to notifications enabled
//toggle this value via the dock menu to enable or disable growl style notifications
var notificationsOn = true;

//default dock menu to Disable notifications
window.fluid.addDockMenuItem("Mute", setNotificationsInactive);

//methods toggle between the notification counter and popup notifications
function setNotificationsInactive() {
    notificationsOn = false;
    window.fluid.addDockMenuItem("Unmute", setNotificationsActive);
    window.fluid.removeDockMenuItem("Mute");
}

function setNotificationsActive() {
    notificationsOn = true;
    window.fluid.addDockMenuItem("Mute", setNotificationsInactive);
    window.fluid.removeDockMenuItem("Unmute");
}

//refresh the feed
function refreshFeed() {
    
    //only refresh feed if main feed in view, don't refresh if user is viewing a post and writing a comment
    //there must be a way to invoke the refresh which is run when user pulls down the screen, this would be
    //preferable as it does not refresh whole page
    if(document.getElementsByClassName('oneContent')[0].getAttribute('class').indexOf('active') > -1) {
        $A.get("e.force:refreshView").fire();
    }
}

//update the notification count or show notifications as appropriate 
function updateNotifications() {
    
    //get the number from the notification counter
    var newCount = document.getElementsByClassName('counter')[0].innerText;
    
    //if we are popping notifications, and the number has changes
    if(notificationsOn && window.fluid.dockBadge != newCount) {
        
        //simulate clicking the notifications icon open
        document.getElementsByClassName('oneNotificationsCounter')[0].click();
        
        //select all the unread notifications
        var unread = document.getElementsByClassName('notification-unread');
        
        //loop over them and pop them as toast
        for (var i=0; i<unread.length; i++) {
            showPopup(unread[i]);
        }
        
        //re-hide the notifications list
        document.getElementsByClassName('notificationsActive')[0].click();
        
    }
    
    //update the badge with number of notifications
	 window.fluid.dockBadge = newCount;
}

//pop a system notification for each SF notifications
function showPopup(toast) {
    
    //get the notification text
    var detail = toast.getElementsByClassName('notification-text')[0].innerText;
    
    //get the icon (irrelevant as does not work)
    //var avatarURL = toast.getElementsByClassName('notification-avatar')[0].getElementsByTagName('img')[0].getAttribute('src');
    
    //create the notification
    var notification = window.webkitNotifications.createNotification(null, 'Chatter Updates', detail);
    
    //add an on click function that refreshes the feed and shows the app
    notification.onclick = function() {
        refreshFeed();
        window.fluid.activate();
    }
    
    //pop the notification
    notification.show();
}
