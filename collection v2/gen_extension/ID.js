function storeID() {
    let testPrefs = {'ID': localStorage.stress_analytics};
    chrome.storage.sync.set({'stress_analyt': testPrefs}, function() {console.log('saved')});
}

window.addEventListener('load', function() {
    storeID()
})