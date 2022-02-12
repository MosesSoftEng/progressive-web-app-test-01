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
 * Notifications - alert user.
 */
const button = document.querySelector("#notification");

button.addEventListener("click", function (){
    //* Request permission for both Motifications and Push.
    Notification.requestPermission().then(function(permissionResult){
        logI(permissionResult);

        if (permissionResult === 'default') {
            // User did not make a choice.
        }

        if (permissionResult === 'denied') {
            //TODO - tell user how to unblock app.
        }

        if (permissionResult === 'granted') {
            showNotification();
        }
    });
});

function showNotification() {
    new Notification(
        "Example notification.",
        {
            icon: "logo-01-96.png",
            body: "Hello this is a notification from App."
        }
    );

    setTimeout(showNotification, 10000);
}

/*
 * Manage logs.
 */
function logI(message) {
    console.log(message)
}
