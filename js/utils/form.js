/**
 * Toggles the loading state of the given button.
 * Assumes it has two child elements, one with the class "text" and another with the class "spinner".
 */
export function toggleButtonLoading(buttonId) {
    const button = document.getElementById(buttonId);
    const buttonText = document.querySelector(`#${buttonId} .text`);
    const buttonSpinner = document.querySelector(`#${buttonId} .spinner`);

    if (button.disabled) {
        button.disabled = false;
        buttonText.style.display = "block";
        buttonSpinner.style.display = "none";
    } else {
        button.disabled = true;
        buttonText.style.display = "none";
        buttonSpinner.style.display = "block";
    }
}
