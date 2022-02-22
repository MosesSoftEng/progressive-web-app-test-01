/*
 *
 */
logI("Test if method can be called before initializing.");

/*
 * Register a service worker.
 */
if ('serviceWorker' in navigator) { // If service worker is supported.
    // Register a service worker.
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
            // display a success message
            logI(`Service Worker Registration (Scope: ${reg.scope})`);
        }).catch(error => {
        logI(`Service Worker Error (${error})`);
    });
} else { // If service worker is not supported.
   logI("ServiceWorker not in Navigator. Not Supported.")
}

/*
 * Notifications.
 * - https://www.javascripttutorial.net/web-apis/javascript-notification/
 * -
 */
const button = document.querySelector("#notification");

button.addEventListener("click", function () {
    //*. Request permission for Notifications.
    Notification.requestPermission().then(function(permissionResult){
        logI(permissionResult);

        if (permissionResult === 'default') {
            // User did not make a choice.
        }

        if (permissionResult === 'denied') {
            //TODO - tell user how to unblock app notification request.
        }

        if (permissionResult === 'granted') {
            showNotification();
        }
    });
});

function showNotification() {
    console.log("show notification");
    console.log("Max visible actions: " + Notification.maxActions);

    /*
     * Check if any notification property is supported
     */
    if ('actions' in Notification.prototype) {
        console.log("Action buttons are supported.");
    } else {
        console.log("Action buttons are NOT supported.");
    }

    let notification = new Notification(
        "Example notification.", // Title
        {
            title: "Ovveride Example Title", // Override title
            body: "Hello this is a notification from App.",
            icon: "logo-01-192.png", // Minimum 192px
            badge: "icons/logo-96.png", // Appears in status bar, minimum 72px
            image: "images/logo-01-timeline.png", // min-width 1350px, aspect ratio 4:3
            sound: "https://studyansw.com/pwa/mixkit-software-interface-remove-2576.mp3", // Not supported
            vibrate: true, // Not supported from android o onwards.
            actions: [
                {
                    action: 'coffee-action', // id
                    title: 'Coffee',
                    icon: 'icons/logo-32.png' // min 24px
                },
                {
                    action: 'doughnut-action',
                    title: 'Doughnut',
                    icon: 'icons/logo-32.png'
                }
            ],
            dir: "auto", // Direction of text auto | ltr | rtl
            timestamp: Date.parse('01 Jan 2000 00:00:00') // Event happen time.
        }
    );

    setTimeout(function(){
        //* Close previous notification
        notification.close();

        showNotification();
    }, 10000);

    //* Notification events
    //  all events; click, show, close, error.
    notification.addEventListener("click", function(){
        window.alert("You clicked the notification!");
    });
}

/*
 * Manage logs.
 */
function logI(message) {
    console.log(message)
}
